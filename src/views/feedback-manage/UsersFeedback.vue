<template>
  <div class="card">
    <div class="toolbar">
      <div>
        <el-input v-model="searchKeyword" placeholder="搜索用户昵称/ID" clearable @input="handleFilter"
          style="width: 250px" />
        <el-select v-model="selectedStatus" :placeholder="`全部（${statusCount.all}）`"  @change="handleFilter" clearable
          style="width: 130px; margin-left: 15px;">
          <el-option :label="`全部（${statusCount.all}）`" value="" />
          <el-option :label="`未处理（${statusCount.untreated}）`" value="未处理" />
          <el-option :label="`处理中（${statusCount.processing}）`" value="处理中" />
          <el-option :label="`已处理（${statusCount.resolved}）`" value="已处理" />
        </el-select>

      </div>
      <div>
        <el-button type="primary" @click="exportExcel">
          <svg-icon name="file" style="margin-right: 5px;"/>
           导出数据</el-button>
        <el-button @click="batchMark('处理中')">
          <svg-icon name="time" style="margin-right: 5px;"/>
          标记为处理中</el-button>
        <el-button @click="batchMark('已处理')">
          <svg-icon name="right" style="margin-right: 5px;"/>
          标记为已处理</el-button>
      </div>
    </div>

    <el-table :data="paginatedData" style="width: 100%" @selection-change="handleSelection">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户昵称" width="100" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="time" label="反馈时间" width="180" />
      <el-table-column prop="type" label="反馈类型" width="120" />
      <el-table-column prop="content" label="反馈内容" />
      <el-table-column label="反馈图片" width="140">
        <template #default="{ row }">
          <el-image v-if="row.images.length" :src="row.images[0]" style="width: 80px; height: 80px; object-fit: cover"
            fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template #default="{ row }">
          <el-link type="primary" @click="showDetail(row)">详情</el-link>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="filteredList.length"
        v-model:current-page="currentPage" />
    </div>

    <feedback-detail-dialog
  v-model="detailDialogVisible"
  :data="selectedRow"
  @markResolved="handleMarkResolved"
  @markProcessing="handleMarkProcessing"
/>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFeedbackStore } from '@/store/feedbackStore'
import { useUserListStore } from '@/store/userList'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import FeedbackDetailDialog from './FeedbackDetailDialog.vue'


const userStore = useUserListStore()
const store = useFeedbackStore()
store.setFeedbackList()
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedRows = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 8

const handleSelection = (rows: any[]) => {
  selectedRows.value = rows
}

const handleFilter = () => {
  currentPage.value = 1
}

// 状态颜色
const statusTagType = (status: string) => {
  switch (status) {
    case '未处理': return 'danger'
    case '处理中': return 'warning'
    case '已处理': return 'success'
    default: return ''
  }
}

// 过滤后的列表
const filteredList = computed(() => {
  let list = store.feedbackList
  if (searchKeyword.value) {
    list = list.filter(item =>
      item.username.includes(searchKeyword.value) || item.userId.includes(searchKeyword.value)
    )
  }
  if (selectedStatus.value) {
    list = list.filter(item => item.status === selectedStatus.value)
  }
  return list
})

// 当前分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

// 批量操作
const batchMark = (status: '处理中' | '已处理') => {
  selectedRows.value.forEach(row => {
    if (status === '处理中') {
      store.markProcessing(row.id)
    } else {
      store.markResolved(row.id)
    }
  })
}

const statusCount = computed(() => {
  const all = store.feedbackList.length
  const untreated = store.feedbackList.filter(item => item.status === '未处理').length
  const processing = store.feedbackList.filter(item => item.status === '处理中').length
  const resolved = store.feedbackList.filter(item => item.status === '已处理').length
  return {
    all,
    untreated,
    processing,
    resolved
  }
})

const exportExcel = () => {
  // 表格数据
  const exportData = filteredList.value.map(item => ({
    用户昵称: item.username,
    用户ID: item.userId,
    反馈时间: item.time,
    反馈类型: item.type,
    反馈内容: item.content,
    处理状态: item.status,
  }))

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '反馈列表')

  // 导出为 blob 并下载
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, '反馈列表.xlsx')
}


const detailDialogVisible = ref(false)
const selectedRow = ref<any>({})

const showDetail = (row: any) => {
  const user = userStore.getUserById(row.userId)
  selectedRow.value = {
    ...row,
    avatar: user?.avatar || ''
  }
  detailDialogVisible.value = true
}

const handleMarkResolved = (id: string) => {
  store.markResolved(id)
  detailDialogVisible.value = false
}

const handleMarkProcessing = (id: string) => {
  store.markProcessing(id)
  detailDialogVisible.value = false
}


</script>

<style scoped>
.card{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
.feedback-page {
  padding: 20px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

::v-deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  color: #6B7280;
  font-weight: 600;
  font-size: 14px;
}
::v-deep(.el-table .el-table__cell) {
  padding-top: 15px;
  padding-bottom: 15px;
}
:deep(.el-tag) {
  transition: none !important;
  animation: none !important;
}
</style>
