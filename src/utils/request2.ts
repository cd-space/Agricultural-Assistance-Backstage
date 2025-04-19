//utils/request2.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 可根据环境变量来配置
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 统一添加 token
    // const token = localStorage.getItem('token')
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU0NzAzNzksImlhdCI6MTc0NDg2NTU3OSwidXNlcl9pZCI6MSwic2NvcGUiOiJtcCJ9.NbOvaqy4PobP6ChzSBc7UFf9-0wyCWMSNFbAgTkQMc4'// 使用 sessionStorage 存储 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    ElMessage.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
