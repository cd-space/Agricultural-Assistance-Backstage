// src/api/usersManage/index.ts
import request from '@/utils/request2'

export interface UserItem {
  id: string
  uuid: string
  avatar: string
  name: string
  role: string
  phone: string
  registerTime: string
  lastLoginTime: string
  warningCount: number
  status: string
}

export interface UserListResponse {
  message: string
  data: UserItem[]
}

/**
 * 获取用户列表接口
 * @returns 
 */
export function getUserListApi(): Promise<UserListResponse> {
  return request.get('/console/account')
}






export interface UserDetail {
  id: string;
  uuid: string
  avatar: string
  name: string
  gender: string
  birthday: string
  role: string
  phone: string
  registerTime: string
  lastLoginTime: string
  warningCount: number
  status: string
  postCount: number
  reportCount: number
  freezeCount: number
  tags: Array<any>
}


export interface UserDetailResponse {
  message: string
  data: UserDetail
}

/**
 * 获取用户详情接口
 * @param id 用户ID
 */
// 获取用户详情接口
export function getUserDetailApi(id: string): Promise<UserDetailResponse> {
  // console.log(id)
  return request.get(`/console/account/${id}`)
}


/**
 * 获取用户发布的需求列表
 * @param id 用户ID
 */
export function getUserDemandsApi(id: number) {
  return request({
    url: `/console/account/demands/${id}`,
    method: 'GET',
  });
}


/**
 * 获取用户单个需求详情
 * @param userId 用户ID
 * @param demandId 需求ID
 */
export function getUserDemandDetailApi(userId: number, demandId: number) {
  return request({
    url: `/console/account/demand/${userId}`,
    method: 'GET',
    params: { id: demandId }
  });
}