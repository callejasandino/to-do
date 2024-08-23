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
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })

    const register = async () => {
      if (!credentials.email || !credentials.password || !credentials.name) {
        notify.error('Fullname, Email and Password must not be empty.')
        return
      }

      if (credentials.password !== credentials.password_confirmation) {
        notify.error('Password did not match')
        return
      }

      await authStore.register(credentials)

      if (error.value) {
        notify.error(error.value)
        return
      }

      notify.success('Registration Success')

      setTimeout(() => {
        router.push({ name: 'task' })
      }, 3000)

      return
    }

    const goToLoginPage = async () => {
      router.push({ name: 'login' })
    }

    return {
      credentials,
      register,
      goToLoginPage
    }
  }
})
