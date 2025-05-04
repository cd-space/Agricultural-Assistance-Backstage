<template>
  <div class="card">
    <div class="toolbar">
      <!-- 搜索框 -->
      <el-input v-model="searchKeyword" placeholder="搜索举报人 / 被举报人 / ID" clearable style="width: 230px"
        @input="handleSearch" />

      <div>
        <el-select v-model="selectedType" placeholder="举报类型" clearable style="width: 150px; margin-left: 12px"
          @change="handleFilter">
          <el-option label="全部" value="" />
          <el-option v-for="type in reportTypes" :key="type" :label="type" :value="type" />
        </el-select>

        <el-select v-model="selectedStatus" placeholder="处理状态" clearable style="width: 150px; margin-left: 12px"
          @change="handleFilter">
          <el-option label="全部" value="" />
          <el-option label="待处理" value="待处理" />
          <el-option label="已处理" value="已处理" />
          <el-option label="已忽略" value="已忽略" />
        </el-select>
      </div>
    </div>

    <el-table :data="reportStore.paginatedList" style="width: 100%">
      <el-table-column prop="id" label="举报编号" min-width="80" />
      <el-table-column prop="type" label="举报类型" min-width="100" />
      <el-table-column label="举报人" min-width="250">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :src="row.reporterAvatar" size="default" style="margin-right: 8px" />
            <div>
              <div>{{ row.reporterName }}</div>
              <div>ID：{{ row.reportId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="被举报人" min-width="250">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :src="row.reportedAvatar" size="default" style="margin-right: 8px" />
            <div>
              <div>{{ row.reportedName }}</div>
              <div>ID：{{ row.reportedId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="举报时间" min-width="200" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-link type="primary" @click="handleDetail(row)">查看详情</el-link>
          <el-divider direction="vertical" />
          <el-link type="warning" @click="markIgnored(row.id)" :disabled="row.status !== '待处理'"
            :class="{ 'disabled-link': row.status !== '待处理' }" :underline="false">
            忽略
          </el-link>
          <el-divider direction="vertical" />
          <el-link type="danger" @click="warnUser(row.reportedId, row.id)" :disabled="row.status !== '待处理'"
            :class="{ 'disabled-link': row.status !== '待处理' }" :underline="false">
            警告
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination">
      <div class="pagination-info">
        显示 {{ reportStore.startIndex + 1 }} 到 {{ reportStore.endIndex }} 条，共 {{ reportStore.total }} 条记录
      </div>
      <el-pagination layout="prev, pager, next" :current-page="reportStore.currentPage"
        :page-size="reportStore.pageSize" :total="reportStore.total" @current-change="handlePageChange" />
    </div>

    <report-detail-dialog
    v-if="selectedReportId"
  v-model="dialogVisible"
  :reportId="selectedReportId"
  @ignore="markIgnored"
  @warn="warnUser"
/>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportStore } from '@/store/reportStore'
import { useUserListStore } from '@/store/userList'
import type { ReportItem } from '@/store/reportStore'
import ReportDetailDialog from './ReportDetailDialog.vue'



const reportStore = useReportStore()
const userStore = useUserListStore()

const selectedType = ref('')
const selectedStatus = ref('')
const searchKeyword = ref('')

const reportTypes = ['违规内容', '虚假信息', '权益侵犯', '垃圾信息', '其他违规']


// 处理过滤
const handleFilter = () => {
  reportStore.filterByTypeAndStatus(selectedType.value, selectedStatus.value)
}

// 搜索操作
const handleSearch = () => {
  reportStore.searchByUserKeyword(searchKeyword.value)
}

// 标签类型
const statusTagType = (status: string) => {
  switch (status) {
    case '待处理': return 'danger'
    case '已处理': return 'success'
    case '已忽略': return 'info'
    default: return ''
  }
}

// 分页变更处理
const handlePageChange = (page: number) => {
  reportStore.setCurrentPage(page)
}


const dialogVisible = ref(false)
const selectedReportId = ref<string>()
const handleDetail = (row: ReportItem) => {
  selectedReportId.value = row.id
  console.log(selectedReportId.value)
  // dialogVisible.value = true
}



const markIgnored = (id: string) => {
  reportStore.markAsIgnored(id)
}

const warnUser = (reportedId: string, reportId: string) => {
  // userStore.warnUserById(reportedId)
  reportStore.markAsResolved(reportId)
}

// 获取补全后的举报数据
onMounted(() => {
  reportStore.fetchReportList()

})

</script>


<style scoped>
.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.disabled-link {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  pointer-events: none;
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
