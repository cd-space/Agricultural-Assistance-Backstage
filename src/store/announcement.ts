// 公告store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAnnouncementListApi, uploadAnnouncementApi } from '@/api/home/announcement'

interface Announcement {
  id: number
  title: string
  image: string
  content: string
  date: string
}

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref<Announcement[]>([])  // 公告列表
  const isLoading = ref<boolean>(false)  // 加载状态
  const error = ref<string | null>(null)  // 错误信息

  // 获取所有公告
  const fetchAnnouncements = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getAnnouncementListApi()
      announcements.value = response.data 
      // console.log('announcements', announcements.value)
    } catch (err) {
      console.error('获取公告失败:', err)
      error.value = '获取公告失败，请稍后再试'
    } finally {
      isLoading.value = false
    }
  }

  // 添加公告
  const addAnnouncement = async (formData: FormData) => {
    try {
      await uploadAnnouncementApi(formData)
      // 调用获取公告列表接口来刷新数据
      await fetchAnnouncements()
    } catch (err) {
      console.error('添加公告失败:', err)
      error.value = '添加公告失败，请稍后再试'
    }
  }

  return {
    announcements,
    isLoading,
    error,
    fetchAnnouncements,
    addAnnouncement,
  }
})
