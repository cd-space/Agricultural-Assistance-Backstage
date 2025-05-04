// api/applicationManage/SupervisorApplication.ts
import request from '@/utils/request2'


/**
 * 获取导师申请列表
 */
export function getSupervisorApplyListApi() {
  return request.get('/console/review/apply')
}


/**
 * 获取导师申请详情
 * @param id 导师申请 ID
 */
export function getSupervisorApplyDetailApi(id: number) {
  return request.get(`/console/review/apply/${id}`)
}


/**
 * 修改导师申请状态
 * @param id 申请 ID
 * @param data 请求体数据，包含需要更新的状态
 */
export function updateSupervisorApplyStatusApi(id: number, data: Record<string, any>) {
  return request.put(`/console/review/apply/update/${id}`, data)
}