import axios from 'axios'
import { defineStore } from 'pinia'
import { useTaskStore } from './task'

const prefix = 'api/task-attachment'

export const useTaskAttachmentStore = defineStore({
  id: prefix,
  state: () => ({
    error: null
  }),

  actions: {
    async store(payload) {
      try {
        await axios.post(`${prefix}/upload`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const taskStore = useTaskStore()
        await taskStore.index()
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message
      }
    }
  },

  getters: {
    getError: (state) => state.error
  }
})
