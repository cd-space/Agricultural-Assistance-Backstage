import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBannerListApi } from '@/api/home/banner'

// Banner 类型定义
export interface Banner {
  id: number
  name: string
  image: string
  status: boolean
}

export const useBannerStore = defineStore('banner', () => {
  const banners = ref<Banner[]>([])


  // const getBannerList = async () => {
  //   try {
  //     const res = await getBannerListApi()
  //     if (res.code === 200) {
  //       banners.value = res.data // 自己决定取什么字段
  //     } else {
  //       console.warn('获取轮播图失败：', res.message)
  //     }
  //   } catch (err) {
  //     console.error('请求出错：', err)
  //   }
  // }

  // 添加 Banner（本地添加）
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newId = banners.value.length ? banners.value[banners.value.length - 1].id + 1 : 1
    banners.value.push({ id: newId, ...banner })
  }

  // 删除 Banner
  const deleteBanner = (id: number) => {
    banners.value = banners.value.filter(item => item.id !== id)
  }

  // 更新 Banner
  const updateBanner = (id: number, newData: Partial<Banner>) => {
    const index = banners.value.findIndex(item => item.id === id)
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...newData }
    }
  }

  // 切换状态
  const toggleStatus = (id: number) => {
    const banner = banners.value.find(item => item.id === id)
    if (banner) {
      banner.status = !banner.status
    }
  }

  return {
    banners,
    // getBannerList,
    addBanner,
    deleteBanner,
    updateBanner,
    toggleStatus,
  }
})
