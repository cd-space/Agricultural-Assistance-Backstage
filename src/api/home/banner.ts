// api/home/banner.ts
import request from '@/utils/request2'

export function getBannerListApi() {
  return request('/console/homepage/banner', 'GET') 
}

export function addBanner(data: any) {
  return request('/console/homepage/banner', 'POST', data) 
}