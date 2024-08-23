import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const notify = {
  error: (message) => {
    toast.error(message, {
      theme: toast.THEME.DARK,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    })
  },

  success: (message) => {
    toast.info(message, {
      theme: toast.THEME.DARK,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    })
  }
}

export default notify
