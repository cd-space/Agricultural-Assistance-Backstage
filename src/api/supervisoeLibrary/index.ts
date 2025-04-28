// src/api/supervisoeLibrary/index.ts
import request from '@/utils/request2'

/**
 * 获取导师列表
 */
export function getMentorListApi() {
  return request.get('/console/mentor')
}



/**
 * 获取导师详情
 * @param id 导师ID
 */
export function getMentorDetailApi(id: string) {
  return request.get(`/console/mentor/${id}`)
}


/**
 * 添加导师
 * @param formData 包含导师信息的 FormData 对象
 */
export function addMentorApi(formData: FormData) {
  return request.post('/console/mentor', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}


/**
 * 给导师添加标签
 * @param id 导师的ID
 * @param tag 要添加的标签内容
 */
export function addMentorTagApi(id: string, tag: string) {
  return request.post(`/console/mentor/tag/${id}`, {
    tag,
  });
}
