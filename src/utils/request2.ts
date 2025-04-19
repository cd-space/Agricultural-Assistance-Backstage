// utils/request.ts
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  (response: AxiosResponse) => response, 
  error => {
    ElMessage.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

// 泛型请求函数封装（核心）
function request<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return service.request({
    url,
    method,
    [method === 'GET' ? 'params' : 'data']: data,
    ...config,
  })
}

export default request
