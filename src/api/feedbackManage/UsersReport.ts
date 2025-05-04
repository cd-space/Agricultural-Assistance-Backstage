// api/feedbackManage/UsersReport.ts
import request from '@/utils/request2'


/**
 * 获取用户举报列表
 */
export function getUserReportListApi() {
  return request.get('/console/feedback/report');
}


/**
 * 获取举报详情
 * @param id 举报贴ID
 */
export function getUserReportDetailApi(id: number) {
  return request.get(`/console/feedback/report/${id}`);
}


/**
 * 忽略举报
 * @param id 举报贴ID
 */
export function ignoreUserReportApi(id: number) {
  return request.put(`/console/feedback/report/update/${id}`);
}


/**
 * 处理举报警告
 * @param id 举报ID
 * @param data 包含修改后的状态、文案标题和警告文案
 */
export function handleUserReportWarningApi(id: number, data: { status: string; title: string; content: string }) {
  return request.post(`/console/feedback/report/${id}`, data);
}
