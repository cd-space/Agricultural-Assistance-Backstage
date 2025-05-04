// src/api/login/index.ts
import request from '@/utils/request2'

export interface CaptchaResponse {
  id: string
  b64s: string 
  answer: string
}

// 生成验证码接口
export function generateCaptchaApi(): Promise<CaptchaResponse> {
  return request.post('/console/code')
}

// 登录接口
interface LoginParams {
  username: string
  password: string
  code_id: string
  answer: string
}

interface LoginResponse {
  token: string
  message: string
}

export function adminLogin(params: LoginParams): Promise<LoginResponse> {
  return request.post('/console/login', params)
}



interface ChangePasswordParams {
  username: string;
  password: string;
  new_password: string;
  renew_password: string;
}

/**
 * 管理员修改密码
 */
export function changePassword(data: ChangePasswordParams) {
  return request.put("/console/account", data);
}