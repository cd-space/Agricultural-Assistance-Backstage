//utils/request2.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getCookie } from "@/utils/cookie";

const cacheName = "ModuleUser";

function getTokenFromCookie(): string {
  const cookieValue = getCookie("ModuleUser");
  if (!cookieValue) return "";
  try {
    const { token } = JSON.parse(cookieValue);
    return token || "";
  } catch {
    return "";
  }
}


// 创建 axios 实例
const service = axios.create({
  // baseURL:'https://argi.liteyuki.org/', 
  baseURL: 'https://www.gryhkj.top/api',
  // baseURL: '/api', // 可根据环境变量来配置
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 统一添加 token
    const token = getTokenFromCookie()
    // console.log(token)
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
    // ElMessage.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
