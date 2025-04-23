// src/api/lodmin/index.ts
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