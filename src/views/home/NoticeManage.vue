<template>
  <div class="announcement-list">
    <div class="header">
      <div>公告信息管理</div>
      <el-button type="primary" @click="handleAdd">+ 发布公告</el-button>
    </div>
    <div style="border-bottom: 1px solid #D1D5DB;margin-bottom: 20px;"></div>
    <el-input v-model="searchKeyword" placeholder="搜索公告" clearable class="search-input" />

    <el-table :data="filteredList" class="announcement-table">
  <el-table-column label="序号" type="index" width="60" />
  <el-table-column label="公告图片预览" width="150">
    <template #default="{ row }">
      <el-image
      v-if="row.image"
        :src="row.image"
        fit="contain"
        style="width: 100px; height: 60px"
        :preview-src-list="[row.image]"
      />
    </template>
  </el-table-column>
  <el-table-column label="公告文字预览">
    <template #default="{ row }">
      <div class="text-preview">
        {{ row.content }}
      </div>
    </template>
  </el-table-column>
  <el-table-column label="发布时间" prop="date" width="180" />
  <el-table-column label="操作" width="100">
    <template #default="{ row }">
      <el-button type="text" @click="handleView(row)">查看</el-button>
    </template>
  </el-table-column>
</el-table>

    <div class="footer">
      <span class="record-info">
        显示 {{ pageStart + 1 }} 到 {{ pageEnd }} 条，共 {{ total }} 条记录
      </span>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAnnouncementStore } from '/src/store/announcement'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 10

const store = useAnnouncementStore()
const announcements = computed(() => store.announcements)
const total = computed(() => announcements.value.length)


const filteredList = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  const filtered = announcements.value.filter(a =>
    a.title.toLowerCase().includes(keyword)
  )
  return filtered.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
})

const pageStart = computed(() => (currentPage.value - 1) * pageSize)
const pageEnd = computed(() => Math.min(currentPage.value * pageSize, total.value))

const handleAdd = () => {
  router.push({ name: 'publish-announcement' })
}

const handleView = row => {
  router.push({ name: 'view-announcement', params: { id: row.id } })
}
// onMounted(() => {
  
// store.fetchAnnouncements()
  
// })


</script>

<style scoped>
::v-deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  color: #6B7280;
  font-weight: 600;
  font-size: 14px;
}
.announcement-list {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Helvetica', 'Arial', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 220px;
  margin-bottom: 15px;
}

.announcement-table {
  width: 100%;
}

.text-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  line-clamp: 2;
  box-orient: vertical;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.record-info {
  margin-right: 12px;
  font-family: Roboto;
font-size: 14px;
color: #666;
}
</style>
