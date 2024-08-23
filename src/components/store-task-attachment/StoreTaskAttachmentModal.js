import { computed, defineComponent, ref, watchEffect } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import notify from '@/helpers/notifications'
import { useTaskAttachmentStore } from '@/stores/task-attachment'

export default defineComponent({
  props: {
    isStoreTaskAttachmentModalOpen: {
      type: Boolean,
      required: true
    },
    taskId: {
      type: Number,
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
    const open = ref(props.isStoreTaskAttachmentModalOpen)
    const fileNames = ref([])
    const selectedFiles = ref([])
    const uploadError = ref('')
    const allowedFileTypes = [
      'image/svg+xml',
      'image/png',
      'image/jpeg',
      'video/mp4',
      'text/csv',
      'text/plain', // For .txt
      'application/msword', // Sometimes used for older Word documents
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // For .docx
    ]
    const taskAttachmentStore = useTaskAttachmentStore()
    const error = computed(() => taskAttachmentStore.getError)

    // Close modal and emit close event
    const closeModal = () => {
      open.value = false
      emit('close')
    }

    // Watch for prop change and update modal state
    watchEffect(() => {
      open.value = props.isStoreTaskAttachmentModalOpen
    })

    // Handle file selection
    const handleFileChange = (event) => {
      const files = Array.from(event.target.files).slice(0, 3) // Limit to 3 files
      fileNames.value = []
      selectedFiles.value = []

      for (const file of files) {
        if (!allowedFileTypes.includes(file.type)) {
          notify.error(`Invalid file type: ${file.name}`)
          return
        }
        fileNames.value.push(file.name)
        selectedFiles.value.push(file)
      }
    }

    // Submit selected files to the server
    const submitFiles = async () => {
      if (!selectedFiles.value.length) {
        notify.error('Please select files to upload')
        return
      }

      const formData = new FormData()
      formData.append('task_id', props.taskId)

      // Append files without manually setting the index
      selectedFiles.value.forEach((file) => {
        formData.append('attachments[]', file)
      })

      await taskAttachmentStore.store(formData)

      if (error.value) {
        notify.error(error.value)
      } else {
        notify.success('Upload Successful')
        closeModal()
      }
    }

    return {
      open,
      closeModal,
      fileNames,
      uploadError,
      handleFileChange,
      submitFiles
    }
  }
})
