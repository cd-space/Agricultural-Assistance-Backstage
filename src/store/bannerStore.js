import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBannerStore = defineStore('banner', () => {
  // Banner 数据
  const banners = ref([
    { id: 1, name: '首页轮播1', image: 'path/to/image1.jpg', product: '商品A', status: true },
    { id: 2, name: '首页轮播2', image: 'path/to/image2.jpg', product: '商品B', status: false },
  ])

  // 添加 Banner
  const addBanner = (banner) => {
    const newId = banners.value.length ? banners.value[banners.value.length - 1].id + 1 : 1
    banners.value.push({ id: newId, ...banner })
  }

  // 删除 Banner
  const deleteBanner = (id) => {
    banners.value = banners.value.filter(item => item.id !== id)
  }

  // 更新 Banner
  const updateBanner = (id, newData) => {
    const index = banners.value.findIndex(item => item.id === id)
    if (index !== -1) {
      banners.value[index] = { ...banners.value[index], ...newData }
    }
  }

  return {
    banners,
    addBanner,
    deleteBanner,
    updateBanner,
  }
})
