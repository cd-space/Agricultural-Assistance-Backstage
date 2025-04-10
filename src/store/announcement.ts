// 公告store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref([
    {
      id: 1,
      title: '系统维护通知',
      image: '/src/assets/OIP.jpg',
      content: '系统将于今晚进行维护，请提前保存工作。',
      date: '2024-01-15 14:30',
    },
    {
      id: 2,
      title: '功能更新公告',
      image: '/src/assets/OIP.jpg',
      content: '我们对公告模块进行了优化，欢迎体验。',
      date: '2024-01-14 09:15',
    },
  ])


  const addAnnouncement = (announcement: {
    title: string
    image: string
    content: string
    date: string
  }) => {
    const newId = Date.now()
    announcements.value.push({ id: newId, ...announcement })
  }

  const fetchAnnouncements = () => {
    announcements.value = [
      {
        id: 1,
        title: '系统维护通知',
        image: '/src/assets/OIP.jpg',
        content: '系统将于今晚进行维护，请提前保存工作。',
        date: '2024-01-15 14:30',
      },
      {
        id: 2,
        title: '功能更新公告',
        image: '/src/assets/OIP.jpg',
        content: '我们对公告模块进行了优化，欢迎体验。',
        date: '2024-01-14 09:15',
      },
    ]
  }

  return {
    announcements,
    addAnnouncement,
    fetchAnnouncements,
  }
})
