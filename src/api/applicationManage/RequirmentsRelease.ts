// api/applicationManage/RequirmentsRelease.ts
import request from '@/utils/request2'

/**
 * 获取需求发布列表
 * @param params 查询参数（可选，比如分页、筛选条件）
 */
export function getDemandReviewListApi() {
  return request.get('/console/review/demand')
}

/**
 * 获取用户单个需求详情
 * @param userId 用户ID
 * @param demandId 需求ID
 */
export function getDemandDetailApi(userId: string, demandId: string) {
  return request.get(`/console/account/demand/${userId}`, {
    params: {
      id: demandId
    }
  });
}


/**
 * 删除需求发布
 * @param id 需求发布的ID
 */
export function deleteDemandReviewApi(id: number) {
  return request.delete(`/console/review/demand/${id}`)
}


/**
 * 修改需求发布状态
 * @param id 用户ID
 * @param postId 帖子ID
 * @param status 新状态
 */
export function updateDemandStatusApi(id: string, postId: string, status: string) {
  return request.put(`/console/review/demand/${id}`, { status }, {
    params: {
      postId
    }
  })
}