<template>
  <div class="card">
    <div style="display: flex; margin-bottom: 15px;">
      <div style="color:#1890ff;display: flex; justify-content: center; align-items: center;">Banner列表</div>
      <button @click="onAdd" class="addbutton">添加Banner</button>
    </div>
    <table>
      <thead>
        <tr style="height: 60px;">
          <th style="width: 6%;">ID</th>
          <th style="width: 20%;">图片</th>
          <th style="width: 20%;">名称</th>
          <th style="width: 40%;">状态</th>
          <th style="width: 14%;">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(banner, index) in pagedBanners" :key="banner.id" :style="index % 2 === 0 ? { backgroundColor: '#f0f0f0' } : {}">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>
            <img :src="banner.image" alt="Banner" style="width: 50px; height: 50px;" />
          </td>
          <td>{{ banner.name }}</td>
          <td>{{ banner.status ? '显示' : '隐藏' }}</td>
          <td>
            <button @click="viewBanner(banner)" style="border: 1px solid #2563EB; padding: 2px 12px; color: #2563EB; background-color: white;margin: 4px;">
              查看</button>
            <button @click="onDelete(banner.id)" style="border: 1px solid #DC2626; padding: 2px 12px; color: #DC2626; background-color: white;margin: 4px;">
              删除</button>
          </td>
        </tr>

      </tbody>
    </table>
    <Pagination v-model:currentPage="currentPage" :totalPages="totalPages" />

  </div>
</template>

<script setup>
import { ref, computed,onMounted  } from 'vue'
import { useBannerStore } from '@/store/bannerStore'
import { storeToRefs } from 'pinia'
import router from '@/router'
import Pagination from '@/components/Pagination.vue'


const bannerStore = useBannerStore()
const { banners } = storeToRefs(bannerStore)

// 分页逻辑
const currentPage = ref(1)
const pageSize = 10

const pagedBanners = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return banners.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(banners.value.length / pageSize))

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// 添加 / 删除 / 查看 / 更新
const onAdd = () => {
  router.push({ name: 'carousel-add' })
}

const onDelete = (id) => {
  bannerStore.deleteBanner(id)
}

const viewBanner = (banner) => {
  // console.log('查看 Banner:', banner)
  router.push({ name: 'carousel-view', params: { id: banner.id } })
}

const onUpdate = (id) => {
  bannerStore.updateBanner(id, { name: '更新后的名称', status: false })
}

onMounted(() => {
  // 在组件挂载时获取数据
  bannerStore.getBannerList()
})
</script>

<style scoped>
.card{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

th {
  border-bottom: 1px solid #ddd;
  background-color: white;
  padding: 8px;
  text-align: left;
}

td {
  border: none;
  padding: 8px;
  text-align: left;
}

button {
  margin-right: 5px;
}


.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 4px 10px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.addbutton{
  margin-left: 20px;
  padding: 4px 10px;
  box-sizing: border-box;
  border: 1px solid #2563EB;
  color: #2563EB;
}
</style>
