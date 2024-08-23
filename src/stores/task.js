import axios from 'axios'
import { defineStore } from 'pinia'

const prefix = 'api/task'

export const useTaskStore = defineStore({
  id: prefix,
  state: () => ({
    tasks: '',
    error: '',
    noOfPages: '',
    sortColumn: '',
    sortDirection: '',
    search: '',
    from: '',
    to: '',
    priority: '',
    filterBy: ''
  }),

  actions: {
    async index() {
      try {
        const response = await axios.get(`${prefix}/index`)
        this.tasks = response.data.tasks.data
        this.noOfPages = response.data.tasks.last_page || ''
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async filter({ filter_by, search, priority, from, to }) {
      const payload = { filter_by, search, priority, from, to }
      try {
        const response = await axios.get(`${prefix}/filter`, { params: payload })
        this.tasks = response.data.tasks.data
        this.filterBy = filter_by
        this.noOfPages = response.data.tasks.last_page || ''

        if (filter_by === 'search') {
          this.search = search
        } else if (filter_by === 'priority') {
          this.priority = priority
        } else {
          this.from = from
          this.to = to
        }

        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async sort({ sort_column, sort_direction }) {
      try {
        const response = await axios.get(`${prefix}/sort`, {
          params: { sort_column, sort_direction }
        })
        this.tasks = response.data.tasks.data
        this.sortColumn = sort_column
        this.sortDirection = sort_direction
        this.error = null
        this.noOfPages = response.data.tasks.last_page || ''
      } catch (error) {
        this.handleError(error)
      }
    },

    async showNextPage(pageNumber, route) {
      const payload = { page: pageNumber }

      if (route === 'sort') {
        payload.sort_column = this.sortColumn
        payload.sort_direction = this.sortDirection
      } else if (route === 'filter') {
        payload.filter_by = this.filterBy
        if (this.filterBy === 'search') {
          payload.search = this.search
        } else if (this.filterBy === 'priority') {
          payload.priority = this.priority
        } else {
          payload.from = this.from
          payload.to = this.to
        }
      }

      try {
        const response = await axios.get(`${prefix}/${route}`, { params: payload })
        this.tasks = response.data.tasks.data
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async store(payload) {
      try {
        await axios.post(`${prefix}/store`, payload)
        this.noOfPages ? this.index() : this.showNextPage(this.noOfPages)
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async update(payload) {
      try {
        await axios.put(`${prefix}/update`, payload)
        this.noOfPages ? this.index() : this.showNextPage(this.noOfPages)
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async markTask(payload) {
      try {
        await axios.put(`${prefix}/mark-task`, payload)
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async archiveTask(payload) {
      try {
        await axios.put(`${prefix}/archive-task`, payload)
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    async deleteTask(taskId) {
      try {
        await axios.delete(`${prefix}/delete/${taskId}`)
        this.error = null
      } catch (error) {
        this.handleError(error)
      }
    },

    handleError(error) {
      this.error = error.response?.data?.error || error.response?.data?.message || 'An error occurred'
    }
  },

  getters: {
    getTasks: (state) => state.tasks,
    getError: (state) => state.error,
    getNoOfPages: (state) => state.noOfPages
  }
})
