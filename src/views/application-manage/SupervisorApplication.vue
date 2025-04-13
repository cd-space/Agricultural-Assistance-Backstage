<template>
  <div class="card">
    <el-input
      v-model="keyword"
      placeholder="搜索申请人/导师/电话"
      class="search-input"
      clearable
      @input="handleSearch"
    />

    <div class="tabs">
      <el-button
        :type="currentTab === '待审核' ? 'primary' : 'default'"
        plain
        @click="filterByStatus('待审核')"
      >
        待审核 ({{ pendingCount }})
      </el-button>
      <el-button
        :type="currentTab === '已通过' ? 'primary' : 'default'"
        plain
        @click="filterByStatus('已通过')"
      >
        已通过 ({{ approvedCount }})
      </el-button>
      <el-button
        :type="currentTab === '已驳回' ? 'primary' : 'default'"
        plain
        @click="filterByStatus('已驳回')"
      >
        已驳回 ({{ rejectedCount }})
      </el-button>
      <el-button
        :type="currentTab === '全部' ? 'primary' : 'default'"
        plain
        @click="filterByStatus('全部')"
      >
        全部 ({{ totalCount }})
      </el-button>
    </div>

    <div class="action-bar">
      <div style="font-size: 14px; color: #6B7280;">已选择 {{ selectedIds.length }} 项</div>
      <div>
        <el-button type="primary" :disabled="!selectedIds.length" @click="batchApprove">通过</el-button>
        <el-button type="danger" :disabled="!selectedIds.length" @click="batchReject">拒绝</el-button>
      </div>
    </div>

    <el-table
      :data="pagedData"
      @selection-change="handleSelectionChange"
      style="margin-top: 10px"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="申请人信息" min-width="200">
        <template #default="{ row }">
          <div class="user-info" @click="showuser(row.applicantId)">
            <el-avatar :src="row.avatar || defaultAvatar" size="default" />
            <div class="user-text">
              <div>{{ row.applicantName }}</div>
              <div style="color: #999">{{ row.applicantPhone }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="申请导师" min-width="160">
        <template #default="{ row }">
          <div>
            <strong>{{ row.supervisorName }}</strong>
            <div style="color: #409EFF; cursor: pointer;" @click="showSupervisor(row.supervisorId)">点击查看</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="申请时间" prop="applyTime" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.status === '待审核'" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.status === '已通过'" type="success">已通过</el-tag>
          <el-tag v-else type="danger">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <a style="color: #409EFF; cursor: pointer;" @click="ApplicationDetail(row.id)">查看详情</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="filteredList.length"
        v-model:current-page="currentPage"
      />
    </div>

    <MentorDialog
  v-model:visible="showDialog"
  :mentorId="editMentorId"
/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupervisorApplicationStore } from '../../store/supervisorApplication'
import MentorDialog from '../supervisoe-library/MentorDialog.vue'
import router from '@/router'

const store = useSupervisorApplicationStore()

const keyword = ref('')
const currentTab = ref<'待审核' | '已通过' | '已驳回' | '全部'>('待审核')
const selectedIds = ref<number[]>([])

const currentPage = ref(1)
const pageSize = 10

const defaultAvatar = 'https://via.placeholder.com/40'

const showDialog = ref(false)
const editMentorId = ref<string | undefined>(undefined)

onMounted(() => {
  store.setApplications()
})

// 状态计数
const pendingCount = computed(() => store.pendingApplications.length)
const approvedCount = computed(() => store.approvedApplications.length)
const rejectedCount = computed(() => store.rejectedApplications.length)
const totalCount = computed(() => store.applications.length)

// 搜索与过滤
const filteredList = computed(() => {
  let list = store.applications

  if (keyword.value) {
    list = store.searchByNameOrPhoneOrSupervisor(keyword.value)
  }

  if (currentTab.value !== '全部') {
    list = list.filter(item => item.status === currentTab.value)
  }

  return list
})

// 分页
const pagedData = computed(() =>
  filteredList.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

function filterByStatus(status: typeof currentTab.value) {
  currentTab.value = status
  currentPage.value = 1
}

function handleSearch() {
  currentPage.value = 1
}

function handleSelectionChange(val: any[]) {
  selectedIds.value = val.map(v => v.id)
}

function batchApprove() {
  console.log(selectedIds.value)
  selectedIds.value.forEach(id => store.approveById(id))
  selectedIds.value = []
}

function batchReject() {
  console.log(selectedIds.value)
  selectedIds.value.forEach(id => store.rejectById(id))
  selectedIds.value = []
}

function showSupervisor( id: Number) {
  editMentorId.value = id.toString()
  showDialog.value = true
}

function showuser(userId: string){
  router.push({ name: 'user-details', params: { id: userId} })
}

function ApplicationDetail (id:number){
  router.push({ name: 'application-detail', params: { id: id} })
}

</script>

<style scoped>

.card {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}

.app-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.search-input {
  width: 300px;
  margin-bottom: 10px;
}
.tabs {
  margin-top: 10px;
  margin-bottom: 15px;
}
.tabs .el-button {
  margin-right: 10px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.user-info .user-text {
  margin-left: 10px;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: end;
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
