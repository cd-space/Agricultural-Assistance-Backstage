// stores/feedbackStore.ts
import { defineStore } from 'pinia'

export interface Feedback {
  id: string
  username: string
  userId: string
  time: string
  type: string
  content: string
  images: string[]
  status: '未处理' | '处理中' | '已处理'
}

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbackList: [] as Feedback[]
  }),

  getters: {
    // 通过状态筛选
    filterByStatus: (state) => {
      return (status: Feedback['status']) => {
        return state.feedbackList.filter(item => item.status === status)
      }
    },

    // 通过用户名或用户ID搜索
    searchByNameOrId: (state) => {
      return (keyword: string) => {
        return state.feedbackList.filter(item =>
          item.username.includes(keyword) || item.userId.includes(keyword)
        )
      }
    }
  },

  actions: {
    // 设置反馈列表（初始化或更新用）
    setFeedbackList(list ?: Feedback[]) {
      this.feedbackList = [
        {
          id: 'fb001',
          username: '张三',
          userId: '100231',
          time: '2025-04-10 10:15:00',
          type: '功能建议',
          content: '希望可以添加暗黑模式功能。',
          images: ['https://i.pravatar.cc/100?img=3'],
          status: '未处理'
        },
        {
          id: 'fb002',
          username: '李四',
          userId: '100232',
          time: '2025-04-11 09:30:00',
          type: '界面问题',
          content: '在手机端页面显示错位。',
          images: ['https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3'],
          status: '处理中'
        },
        {
          id: 'fb003',
          username: '王五',
          userId: '100233',
          time: '2025-04-12 14:20:00',
          type: '其他',
          content: '系统有时候会自动登出。',
          images: [],
          status: '未处理'
        },
        {
          id: 'fb004',
          username: '赵六',
          userId: 'u004',
          time: '2025-04-13 16:45:00',
          type: '功能建议',
          content: '建议支持微信登录。',
          images: ['https://example.com/img4.jpg'],
          status: '已处理'
        },
        {
          id: 'fb005',
          username: '孙七',
          userId: 'u005',
          time: '2025-04-14 11:10:00',
          type: 'BUG反馈',
          content: '点击“提交”按钮没有反应。',
          images: [],
          status: '未处理'
        }
      ]
    },

    // 根据 ID 把状态改为“处理中”
    markProcessing(id: string) {
      const target = this.feedbackList.find(item => item.id === id)
      if (target) {
        target.status = '处理中'
      }
    },

    // 根据 ID 把状态改为“已处理”
    markResolved(id: string) {
      const target = this.feedbackList.find(item => item.id === id)
      if (target) {
        target.status = '已处理'
      }
    }
  }
})
 