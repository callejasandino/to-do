import notify from '@/helpers/notifications'
import { useAuthStore } from '@/stores/auth'
import Cookies from 'js-cookie'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon, ArrowLongLeftIcon, ArrowLongRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { useTaskStore } from '@/stores/task'
import StoreTaskModal from '../../components/store-task/StoreTaskModal.vue'
import UpdateTaskModal from '../../components/update-task/UpdateTaskModal.vue'
import StoreTaskTagsModal from '../../components/store-task-tags/StoreTaskTagsModal.vue'
import StoreTaskAttachmentModal from '../../components/store-task-attachment/StoreTaskAttachmentModal.vue'
import Carousel from '@/components/carousel/Carousel.vue'
import moment from 'moment'

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    EllipsisHorizontalIcon,
    StoreTaskModal,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
    UpdateTaskModal,
    StoreTaskTagsModal,
    StoreTaskAttachmentModal,
    CheckCircleIcon,
    XCircleIcon,
    Carousel
  },

  setup() {
    // Refs and Computed Properties
    const isCreateTaskModalOpen = ref(false)
    const isUpdateTaskModalOpen = ref(false)
    const isTaskTagsModalOpen = ref(false)
    const isStoreTaskAttachmentModalOpen = ref(false)
    const currentPage = ref(1)
    const taskToUpdate = ref(null)
    const taskId = ref(null)
    const tags = ref([])
    const sortBy = ref('')
    const orderBy = ref('')
    const filterBy = ref('')
    const taskPriority = ref('')
    const fromDate = ref('')
    const toDate = ref('')
    const search = ref('')
    const route = ref('index')

    const authStore = useAuthStore()
    const taskStore = useTaskStore()

    const tasks = computed(() => taskStore.getTasks)
    const error = computed(() => taskStore.getError)
    const noOfPages = computed(() => taskStore.getNoOfPages)

    const router = useRouter()

    // Lifecycle Hook
    onMounted(() => {
      loadTasks()
    })

    // Task Loading and Pagination
    const loadTasks = async () => {
      await taskStore.index()
    }

    const showNextPage = async (page) => {
      await taskStore.showNextPage(page, route.value)
    }

    const goToNextPage = () => {
      currentPage.value++
      showNextPage(currentPage.value, route.value)
    }

    const goToPrevPage = () => {
      currentPage.value--
      showNextPage(currentPage.value, route.value)
    }

    const goToPage = (page) => {
      currentPage.value = page
      showNextPage(currentPage.value, route.value)
    }

    // Specific Modal Toggles
    const toggleCreateTask = () => {
      isCreateTaskModalOpen.value = !isCreateTaskModalOpen.value
    }

    const toggleUpdateTask = (task) => {
      taskToUpdate.value = task
      isUpdateTaskModalOpen.value = !isUpdateTaskModalOpen.value
    }

    const toggleCreateTaskTag = (task, currentTags) => {
      tags.value = extractTags(currentTags)
      taskId.value = task
      isTaskTagsModalOpen.value = !isTaskTagsModalOpen.value
    }

    const toggleTaskAttachment = (task) => {
      taskId.value = task
      isStoreTaskAttachmentModalOpen.value = !isStoreTaskAttachmentModalOpen.value
    }

    // Tag Extraction and Parsing
    const extractTags = (taskTag) => taskTag?.tags || null

    const parseTags = (tags) => {
      try {
        return JSON.parse(tags)
      } catch (e) {
        notify.error('Failed to parse tags')
        return []
      }
    }

    // Task Actions
    const handleTaskAction = async (taskAction, taskId, mark = null) => {
      const taskData = { task_id: taskId, mark }
      await taskStore[taskAction](taskData)

      if (error.value) {
        notify.error(error.value)
      } else {
        loadTasks()
      }
    }

    const markTask = (taskId, mark) => handleTaskAction('markTask', taskId, mark)
    const archiveTask = (taskId, mark) => handleTaskAction('archiveTask', taskId, mark)

    const deleteTask = async (taskId) => {
      try {
        await taskStore.deleteTask(taskId)

        if (error.value) {
          notify.error(error.value)
        } else {
          notify.success('Task deleted successfully')
          loadTasks() // Refresh the task list after deletion
        }
      } catch (e) {
        notify.error('Failed to delete task')
      }
    }

    //sort and order by functions

    const sort = async () => {
      route.value = 'sort'

      const arrangement = {
        sort_column: sortBy.value,
        sort_direction: orderBy.value
      }

      await taskStore.sort(arrangement)
    }

    //filter

    const filter = async () => {
      const payload = {}

      if (filterBy.value == 'date_completed' || filterBy.value == 'due_date' || filterBy.value == 'archived_date') {
        const fromDateValue = formatDate(fromDate.value)
        const toDateValue = formatDate(toDate.value)
        if (fromDateValue.isAfter(toDateValue)) {
          notify.error('From date should be before the To date')
          return
        }
        payload.from = fromDateValue
        payload.to = toDateValue
        payload.filter_by = filterBy.value
      } else if (filterBy.value == 'priority') {
        payload.priority = taskPriority.value // assuming priority.value exists
        payload.filter_by = filterBy.value
      } else {
        payload.search = search.value
        payload.filter_by = 'search'
      }

      route.value = 'filter'

      await taskStore.filter(payload)

      if (error.value) {
        notify.error(error.value)
      }
    }

    const formatDate = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }

    const resetArrangement = () => {
      route.value = 'index'
      loadTasks()
    }

    // Logout Functionality
    const logout = async () => {
      await authStore.logout()
      Cookies.remove('token')
      notify.success('Logged Out')

      setTimeout(() => {
        router.push('login')
      }, 3000)
    }

    return {
      // Modals and Toggles
      isCreateTaskModalOpen,
      isUpdateTaskModalOpen,
      isTaskTagsModalOpen,
      isStoreTaskAttachmentModalOpen,
      toggleCreateTask, // Specifically returned
      toggleUpdateTask,
      toggleCreateTaskTag,
      toggleTaskAttachment,

      // Task Data and Actions
      tasks,
      taskToUpdate,
      taskId,
      tags,
      noOfPages,
      currentPage,
      goToNextPage,
      goToPrevPage,
      goToPage,
      markTask,
      archiveTask,
      deleteTask,

      //sort and order by
      sortBy,
      orderBy,
      sort,
      resetArrangement,
      fromDate,
      toDate,
      search,

      //filter by
      filterBy,
      taskPriority,
      filter,

      // Tag Parsing
      parseTags,

      // Logout
      logout
    }
  }
})
