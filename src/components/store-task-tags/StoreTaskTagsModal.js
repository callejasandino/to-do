import { computed, defineComponent, onMounted, reactive, ref, watchEffect } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

import notify from '@/helpers/notifications'
import { useTagStore } from '@/stores/tag'

export default defineComponent({
  props: {
    isTaskTagsModalOpen: {
      type: Boolean,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    currentTags: {
      type: String,
      required: false
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
    const open = ref(props.isTaskTagsModalOpen)
    const tagValue = ref('')
    const divs = ref([])
    const tags = ref([])
    const tagStore = useTagStore()
    const error = computed(() => tagStore.getError)

    const addDiv = () => {
      if (tagValue.value.trim()) {
        divs.value.push(tagValue.value)
        tags.value.push(tagValue.value)
        tagValue.value = ''
      }
    }

    onMounted(() => {
      if (props.currentTags) {
        let existingTags = parseTags(props.currentTags)

        existingTags.forEach((element) => {
          divs.value.push(element)
          tags.value.push(element)
        })
      }
    })

    const parseTags = (tags) => {
      return JSON.parse(tags)
    }

    const store = async () => {
      if (!tags.value) {
        notify.error('Tag is required')
      }

      const payload = {
        task_id: props.taskId,
        tags: tags.value
      }

      await tagStore.store(payload)

      if (error.value) {
        notify.error(error.value)
        return
      }

      notify.success('Tags Saved')

      closeModal()
    }

    const closeModal = () => {
      open.value = false
      emit('close')
    }

    watchEffect(() => {
      open.value = props.isTaskTagsModalOpen
    })

    return {
      open,
      closeModal,
      addDiv,
      tagValue,
      divs,
      store
    }
  }
})
