// api/home/banner.ts
import request from '@/utils/request2'

//获取banner列表
interface Banner {
  id: number
  name: string
  image: string
  status: boolean
}
interface BannerListResponse {
  bannerList: Banner[]
  message: string
}

export function getBannerListApi(): Promise<BannerListResponse> {
  return request.get('/console/homepage/banner') 
}

// 上传 banner 的接口

export function uploadBannerApi(formData: FormData) {
  return request.post('/console/homepage/banner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}



// 更新 banner 的接口（根据 id 修改）
export function updateBannerApi(id: number | string, formData: FormData) {
  return request({
    url: `/console/homepage/banner/${id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
}



// 删除 banner 的接口
export function deleteBannerApi(id: number) {
  return request.delete(`/console/homepage/banner/${id}`)
}
