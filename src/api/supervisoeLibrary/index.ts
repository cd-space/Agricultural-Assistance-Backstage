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


/**
 * 删除导师标签
 * @param userId 导师ID
 * @param tagId 标签ID
 */
export function deleteMentorTagApi(userId: string, tagId: number) {
  return request.delete(`/console/mentor/tag/${userId}`, {
    params: { id: tagId }
  })
}



/**
 * 修改导师首页展示可见性
 * @param id 导师ID
 * @param isFeatured 是否首页展示 true/false
 */
export function updateMentorDisplayApi(id: string, isFeatured?: boolean) {
  return request.put(`/console/mentor/display/${id}`, null, {
    params: {
      isFeatured,
    },
  });
}

/**
 * 删除导师
 * @param id 导师的ID
 */
export function deleteMentorApi(id: string) {
  return request.delete(`/console/mentor/${id}`);
}



/**
 * 修改导师信息
 * @param id 导师ID
 * @param formData 包含修改信息name，phone,email,image,intro的FormData对象
 */
export function updateMentorApi(id: string, formData: FormData) {
  return request.put(`/console/mentor/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}