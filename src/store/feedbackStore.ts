// stores/feedbackStore.ts
import { defineStore } from 'pinia'
import { getFeedbackListApi, getFeedbackDetailApi, updateFeedbackStatusApi } from '@/api/feedbackManage/UsersFeedback'

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbackList: [] as any[]
  }),

  getters: {
    // 通过状态筛选
    filterByStatus: (state) => {
      return (status: string) => {
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
    /**
     * 获取用户反馈列表
     */
    async fetchFeedbackList() {
      try {
        const res = await getFeedbackListApi();
        this.feedbackList = res.data || [];
      } catch (error) {
        console.error('获取反馈列表失败:', error);
        throw error;
      }
    },

    /**
     * 获取单条用户反馈详情
     * @param id 反馈ID
     */
    async fetchFeedbackDetail(id: string) {
      try {
        const res = await getFeedbackDetailApi(id);
        return res.data;
      } catch (error) {
        console.error('获取反馈详情失败:', error);
        throw error;
      }
    },

    /**
     * 修改反馈状态
     * @param id 反馈ID
     * @param status 新状态
     */
    async updateFeedbackStatus(id: string, status: string) {
      try {
        await updateFeedbackStatusApi(id, status);
        await this.fetchFeedbackList();
      } catch (error) {
        console.error('更新反馈状态失败:', error);
        throw error;
      }
    }
  }
})
