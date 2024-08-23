import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/stores/task'
import moment from 'moment'
import notify from '@/helpers/notifications'

export default defineComponent({
  props: {
    isUpdateTaskModalOpen: {
      type: Boolean,
      required: true
    },
    task: {
      type: Object,
      required: true
    }
  },
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationTriangleIcon
  },
  setup(props, { emit }) {
    const open = ref(props.isUpdateTaskModalOpen)
    const taskStore = useTaskStore()
    const error = computed(() => taskStore.getError)

    const closeModal = () => {
      open.value = false
      emit('close')
    }

    const priorityMethods = [
      { id: 'Urgent', title: 'Urgent' },
      { id: 'High', title: 'High' },
      { id: 'Normal', title: 'Normal' },
      { id: 'Low', title: 'Low' }
    ]

    const taskInformation = reactive({
      task_id: props.task.id,
      title: props.task.title,
      description: props.task.description,
      due_date: props.task.due_date,
      task_priority: props.task.task_priority
    })

    const update = async () => {
      if (!taskInformation.title || !taskInformation.description) {
        notify.error('Title and Description is required')
        return
      }

      if (!taskInformation.due_date) {
        taskInformation.due_date = formatDate(taskInformation.due_date)
      }

      await taskStore.update(taskInformation)

      if (error.value) {
        notify.error(error.value)
        return
      }

      notify.success('Task updated')

      closeModal()
    }

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }

    watchEffect(() => {
      open.value = props.isUpdateTaskModalOpen
    })

    return {
      open,
      priorityMethods,
      closeModal,
      taskInformation,
      update
    }
  }
})
