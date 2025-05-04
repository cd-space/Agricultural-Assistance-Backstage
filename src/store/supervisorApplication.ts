// src/stores/supervisorApplication.ts
import { defineStore } from 'pinia'
import {
  getSupervisorApplyListApi,
  getSupervisorApplyDetailApi,
  updateSupervisorApplyStatusApi,
} from '@/api/applicationManage/SupervisorApplication'

export const useSupervisorApplicationStore = defineStore('supervisorApplication', {
  state: () => ({
    applications: [] as any[],
  }),

  getters: {
    pendingApplications: (state) =>
      state.applications.filter(item => item.status === '待审核'),

    approvedApplications: (state) =>
      state.applications.filter(item => item.status === '已通过'),

    rejectedApplications: (state) =>
      state.applications.filter(item => item.status === '已驳回'),
  },

  actions: {
    searchByNameOrPhoneOrSupervisor(keyword: string) {
      const lowerKeyword = keyword.toLowerCase()
      return this.applications.filter(item =>
        item.applicantName.toLowerCase().includes(lowerKeyword) ||
        item.applicantPhone.includes(keyword) ||
        item.supervisorName.toLowerCase().includes(lowerKeyword)
      )
    },

    getById(id: number) {
      return this.applications.find(item => item.id === id)
    },

    async fetchApplications() {
      const res = await getSupervisorApplyListApi()
      this.applications = res.data || []
    },

    async fetchApplicationDetail(id: number) {
      const res = await getSupervisorApplyDetailApi(id)
      return res.data
    },

    async approveById(id: number) {
      await updateSupervisorApplyStatusApi(id, { status: '已通过' })
      await this.fetchApplications()
    },
    
    async rejectById(id: number) {
      await updateSupervisorApplyStatusApi(id, { status: '已驳回' })
      await this.fetchApplications()
    }
  }
})
