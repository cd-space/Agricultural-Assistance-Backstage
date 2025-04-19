// api/home/announcement.ts
import request from '@/utils/request2'

// 定义公告接口返回的数据类型
interface Announcement {
  id: number
  title: string
  image: string
  content: string
  date: string
}

interface AnnouncementListResponse {
  data: Announcement[]
  message: string
}

// 获取公告列表
export function getAnnouncementListApi(): Promise<AnnouncementListResponse> {
  return request.get('/console/homepage/announcement')
}

// 上传公告接口（用于添加新公告）
export function uploadAnnouncementApi(formData: FormData) {
  return request.post('/console/homepage/announcement', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
