import axios from 'axios'
import { defineStore } from 'pinia'
import { useTaskStore } from './task'

const prefix = 'api/tag'

export const useTagStore = defineStore({
  id: prefix,
  state: () => ({
    error: null
  }),

  actions: {
    async store(payload) {
      try {
        await axios.post(`${prefix}/store`, payload)
        const taskStore = useTaskStore()
        await taskStore.index()
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data.error : error.message
      }
    }
  },

  getters: {
    getError: (state) => state.error
  }
})
