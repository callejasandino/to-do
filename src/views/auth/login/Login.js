import { useAuthStore } from '@/stores/auth'
import { computed, defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import notify from '@/helpers/notifications'

export default defineComponent({
  components: {},

  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const error = computed(() => authStore.getError)

    const credentials = reactive({
      email: '',
      password: ''
    })

    const login = async () => {
      if (!credentials.email || !credentials.password) {
        notify.error('Email and Password must not be empty.')
        return
      }

      await authStore.login(credentials)

      if (error.value) {
        notify.error(error.value)
        return
      }

      notify.success('Login Success')

      setTimeout(() => {
        router.push({ name: 'task' })
      }, 3000)

      return
    }

    const goToRegisterPage = async () => {
      router.push({ name: 'register' })
    }

    return {
      credentials,
      login,
      goToRegisterPage
    }
  }
})
