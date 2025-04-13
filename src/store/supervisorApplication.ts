// src/stores/supervisorApplication.ts
import { defineStore } from 'pinia'

export interface Application {
  id: number
  applicantId: number
  applicantName: string
  applicantPhone: string
  avatar: string
  supervisorName: string
  supervisorId: number
  applyTime: string
  status: '待审核' | '已通过' | '已驳回'
  reason: string // 新增字段：申请理由
}

export const useSupervisorApplicationStore = defineStore('supervisorApplication', {
  state: () => ({
    applications: [] as Application[],
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
    setApplications(data?: Application[]) {
      if (data) {
        this.applications = data
      } else {
        this.applications = [
          {
            id: 1,
            applicantId: 100231,
            applicantName: '张三',
            applicantPhone: '13800138000',
            avatar: 'https://i.pravatar.cc/100?img=1',
            supervisorName: '李教授',
            supervisorId: 1,
            applyTime: '2025-04-10 14:30:00',
            status: '待审核',
            reason: '我对人工智能研究非常感兴趣，希望跟随导师深入学习。'
          },
          {
            id: 2,
            applicantId: 100232,
            applicantName: '李四',
            applicantPhone: '13800138001',
            avatar: 'https://i.pravatar.cc/100?img=2',
            supervisorName: '王教授',
            supervisorId: 2,
            applyTime: '2025-04-11 09:15:00',
            status: '已通过',
            reason: '我曾在该方向参与多个项目，非常希望能加入导师团队。'
          },
          {
            id: 3,
            applicantId: 100233,
            applicantName: '王五',
            applicantPhone: '13800138002',
            avatar: 'https://i.pravatar.cc/100?img=3',
            supervisorName: '李教授',
            supervisorId: 1,
            applyTime: '2025-04-12 16:45:00',
            status: '已驳回',
            reason: '对导师研究领域有浓厚兴趣，计划发表相关论文。'
          },
          {
            id: 4,
            applicantId: 100234,
            applicantName: '赵六',
            applicantPhone: '13800138003',
            avatar: 'https://i.pravatar.cc/100?img=4',
            supervisorName: '周教授',
            supervisorId: 3,
            applyTime: '2025-04-13 10:00:00',
            status: '待审核',
            reason: '我具备相关背景知识，希望能进入导师实验室学习。'
          }
        ]
      }
    },

    searchByNameOrPhoneOrSupervisor(keyword: string): Application[] {
      const lowerKeyword = keyword.toLowerCase()
      return this.applications.filter(item =>
        item.applicantName.toLowerCase().includes(lowerKeyword) ||
        item.applicantPhone.includes(keyword) ||
        item.supervisorName.toLowerCase().includes(lowerKeyword)
      )
    },

    getById(id: number): Application | undefined {
      return this.applications.find(item => item.id === id)
    },

    approveById(id: number) {
      const target = this.applications.find(item => item.id === id)
      if (target && target.status === '待审核') {
        target.status = '已通过'
      }
    },

    rejectById(id: number) {
      const target = this.applications.find(item => item.id === id)
      if (target && target.status === '待审核') {
        target.status = '已驳回'
      }
    }
  }
})
