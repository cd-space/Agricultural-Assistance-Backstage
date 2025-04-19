// src/api/home/news.ts
import request from '@/utils/request2'

// 新闻项的类型定义
export interface NewsItem {
  id: number
  title: string
  publishDate: string
  repostDate: string
  source: string
  views: number
  visible: boolean
  selected: boolean
  url: string
}


export interface NewsListResponse {
  data: NewsItem[]
  message: string
}

// 获取新闻列表
export function getNewsListApi(): Promise<NewsListResponse> {
  return request.get('/console/homepage/news')
}



// 定义添加新闻所需的参数类型
export interface AddNewsPayload {
  url: string
  source: string
}


// 添加新闻的接口方法
export function addNewsApi(data: AddNewsPayload){
  return request.post('/console/homepage/news', data)
}


// 删除新闻的接口方法

export function deleteNewsApi(id: number){
  return request.delete(`/console/homepage/news/${id}`)
}