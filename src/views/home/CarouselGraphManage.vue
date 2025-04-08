<template>
  <div>
    <button @click="addBanner">添加Banner</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>图片</th>
          <th>名称</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(banner, index) in banners" :key="banner.id">
          <td>{{ index + 1 }}</td>
          <td>
            <img :src="banner.image" alt="Banner" style="width: 50px; height: 50px;" />
          </td>
          <td>{{ banner.name }}</td>
          <td>{{ banner.status }}</td>
          <td>
            <button @click="viewBanner(banner)">查看</button>
            <button @click="deleteBanner(index)" style="color: red;">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup >
import { ref } from 'vue'

const banners = ref([
  { id: 1, image: 'path/to/image1.jpg', name: '首页', status: '显示' },
  { id: 2, image: 'path/to/image2.jpg', name: '首页', status: '显示' },
  { id: 3, image: 'path/to/image3.jpg', name: '首页', status: '显示' },
])

const addBanner = () => {
  // 示例添加一个新Banner
  const newId = banners.value.length + 1
  banners.value.push({
    id: newId,
    image: `path/to/image${newId}.jpg`,
    name: `新Banner${newId}`,
    status: '显示'
  })
  console.log('添加Banner')
}

const viewBanner = (banner) => {
  console.log('查看Banner:', banner)
}

const deleteBanner = (index) => {
  banners.value.splice(index, 1)
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  margin-right: 5px;
}
</style>
