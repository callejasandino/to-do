import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useTaskStore } from '@/stores/task'
import moment from 'moment'
import notify from '@/helpers/notifications'

export default defineComponent({
  props: {
    isCreateTaskModalOpen: {
      type: Boolean,
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
    const open = ref(props.isCreateTaskModalOpen)
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
      title: '',
      description: '',
      due_date: '',
      task_priority: ''
    })

    const store = async () => {
      if (!taskInformation.title || !taskInformation.description) {
        notify.error('Title and Description is required')
        return
      }

      if (!taskInformation.due_date) {
        taskInformation.due_date = formatDate(taskInformation.due_date)
      }

      await taskStore.store(taskInformation)

      if (error.value) {
        notify.error(error.value)
        return
      }

      notify.success('Task Saved')

      closeModal()
    }

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }

    watchEffect(() => {
      open.value = props.isCreateTaskModalOpen
    })

    return {
      open,
      priorityMethods,
      closeModal,
      taskInformation,
      store
    }
  }
})
