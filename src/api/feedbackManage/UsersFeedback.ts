// api/feedbackManage/UsersFeedback.ts
import request from '@/utils/request2'
/**
 * 获取用户反馈列表
 */
export function getFeedbackListApi() {
  return request.get('/console/feedback');
}


/**
 * 获取用户反馈详情
 * @param id 反馈ID
 */
export function getFeedbackDetailApi(id: number | string) {
  return request.get(`/console/feedback/${id}`);
}


/**
 * 修改用户反馈状态
 * @param id 反馈ID
 * @param status 新状态
 */
export function updateFeedbackStatusApi(id: number | string, status: string) {
  return request.put(`/console/feedback/update/${id}`, { status });
}