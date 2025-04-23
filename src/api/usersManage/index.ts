// src/api/usersManage/index.ts
import request from '@/utils/request2'

export interface UserItem {
  id: number
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

// 获取用户列表
export function getUserListApi(): Promise<UserListResponse> {
  return request.get('/console/account')
}






export interface UserDetail {
  avatar: string
  name: string
  gender: '男' | '女' | '未知'
  birthday: string
  role: string
  phone: string
  registerTime: string
  lastLoginTime: string
  warningCount: number
  status: '正常' | '已冻结' | '注销'
  postCount: number
  reportCount: number
  freezeCount: number
}


export interface UserDetailResponse {
  message: string
  data: UserDetail
}

// 获取用户详情接口
export function getUserDetailApi(id: string): Promise<UserDetailResponse> {
  console.log(id)
  return request.get(`/console/account/${id}`)
}