import axios from 'axios'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

const prefix = 'api/auth'

export const useAuthStore = defineStore({
  id: prefix,
  state: () => ({
    isValidated: false,
    error: null
  }),

  actions: {
    async login(payload) {
      try {
        const response = await axios.post(`${prefix}/login`, payload)
        Cookies.set('token', response.data.token)
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data.error : error.message
      }
    },

    async validateToken() {
      try {
        const response = await axios.get(`${prefix}/validate-token`)
        this.isValidated = response.data.validated
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message
      }
    },

    async register(payload) {
      try {
        const response = await axios.post(`${prefix}/register`, payload)
        Cookies.set('token', response.data.token)
        this.error = null
      } catch (error) {
        this.error = error.response ? error.response.data.message : error.message
      }
    }
  },

  getters: {
    getIsValidated: (state) => state.isValidated,
    getError: (state) => state.error
  }
})
