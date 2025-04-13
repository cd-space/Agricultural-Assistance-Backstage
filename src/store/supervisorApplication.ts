// src/stores/supervisorApplication.ts
import { defineStore } from 'pinia'

export interface Application {
  id: number
  applicantId: number
  applicantName: string
  applicantPhone: string
  supervisorName: string
  supervisorId: number
  applyTime: string
  status: '待审核' | '已通过' | '已驳回'
}

export const useSupervisorApplicationStore = defineStore('supervisorApplication', {
  state: () => ({
    applications: [] as Application[],
  }),

  getters: {
    // 筛选：待审核
    pendingApplications: (state) =>
      state.applications.filter(item => item.status === '待审核'),

    // 筛选：已通过
    approvedApplications: (state) =>
      state.applications.filter(item => item.status === '已通过'),

    // 筛选：已驳回
    rejectedApplications: (state) =>
      state.applications.filter(item => item.status === '已驳回'),
  },

  actions: {
    // 添加假数据或接口返回的数据用这个
    setApplications(data?: Application[]) {
      if (data) {
        this.applications = data
      } else {
        this.applications = [
          {
            id: 1,
            applicantId: 101,
            applicantName: '张三',
            applicantPhone: '13800138000',
            supervisorName: '李教授',
            supervisorId: 201,
            applyTime: '2025-04-10 14:30:00',
            status: '待审核'
          },
          {
            id: 2,
            applicantId: 102,
            applicantName: '李四',
            applicantPhone: '13800138001',
            supervisorName: '王教授',
            supervisorId: 202,
            applyTime: '2025-04-11 09:15:00',
            status: '已通过'
          },
          {
            id: 3,
            applicantId: 103,
            applicantName: '王五',
            applicantPhone: '13800138002',
            supervisorName: '李教授',
            supervisorId: 201,
            applyTime: '2025-04-12 16:45:00',
            status: '已驳回'
          },
          {
            id: 4,
            applicantId: 104,
            applicantName: '赵六',
            applicantPhone: '13800138003',
            supervisorName: '周教授',
            supervisorId: 203,
            applyTime: '2025-04-13 10:00:00',
            status: '待审核'
          }
        ]
      }
    },
    

    // 1. 按申请人名字 / 电话 / 导师名字 搜索
    searchByNameOrPhoneOrSupervisor(keyword: string): Application[] {
      const lowerKeyword = keyword.toLowerCase()
      return this.applications.filter(item =>
        item.applicantName.toLowerCase().includes(lowerKeyword) ||
        item.applicantPhone.includes(keyword) ||
        item.supervisorName.toLowerCase().includes(lowerKeyword)
      )
    },

    // 2. 通过 id 搜索
    getById(id: number): Application | undefined {
      return this.applications.find(item => item.id === id)
    },

    // 6. 根据 id 将申请状态变为已通过
    approveById(id: number) {
      const target = this.applications.find(item => item.id === id)
      if (target && target.status === '待审核') {
        target.status = '已通过'
      }
    },

    // 7. 根据 id 将申请状态变为已驳回
    rejectById(id: number) {
      const target = this.applications.find(item => item.id === id)
      if (target && target.status === '待审核') {
        target.status = '已驳回'
      }
    }
  }
})
