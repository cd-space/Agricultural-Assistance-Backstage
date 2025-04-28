<template>
  <div class="card">
    <el-input
      v-model="keyword"
      placeholder="搜索发布人/手机号/标题"
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
        <el-button type="danger" :disabled="!selectedIds.length" @click="batchReject">驳回</el-button>
      </div>
    </div>

    <el-table
      :data="pagedData"
      @selection-change="handleSelectionChange"
      style="margin-top: 10px"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="发布人" min-width="240">
        <template #default="{ row }">
          <div class="user-info" @click="showUser(row.publisherId)">
            <el-avatar :src="row.publisherAvatar || defaultAvatar" size="default" />
            <div class="user-text">
              <div>{{ row.name }}</div>
              <div style="display: flex; gap: 10px;">
                <div style="color: #999">{{ row.publisherauthRole }} </div>
                <div style="color: #999">{{ row.phone }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="需求标题" prop="title" min-width="200" />
      <el-table-column label="发布时间" prop="publishTime" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.status === '待审核'" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.status === '已通过'" type="success">已通过</el-tag>
          <el-tag v-else type="danger">已驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template #default="{ row }">
  <div style="display: flex; gap: 12px;">
    <div style="color: #409EFF; cursor: pointer;" @click="viewDemandDetail(row.user_id,row.post_id)">查看详情</div>
    <div style="color: red; cursor: pointer;" @click="confirmDelete(row.user_id, row.post_id)">删除</div>
  </div>
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

    <el-dialog v-model="centerDialogVisible" title="" width="350" center top="20vh">
    <span style="padding: 20px;">
      确定要删除该条需求吗？此操作不可逆。
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="delDemand()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <DemandDetailDialog
  v-model="dialogVisible"
  :user-id="selectedUserId"
  :demand-id="selectedDemandId"
/>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserListStore } from '../../store/userList'
import { useRouter } from 'vue-router'
import DemandDetailDialog from './DemandDetailDialog.vue'
import { ElMessage } from 'element-plus'
import {
  getDemandReviewListApi,
  getDemandDetailApi,
  deleteDemandReviewApi,
  updateDemandStatusApi
}
  from '@/api/applicationManage/RequirmentsRelease'

const store = useUserListStore()
const router = useRouter()

const keyword = ref('')
const currentTab = ref<'待审核' | '已通过' | '已驳回' | '全部'>('待审核')
const selectedIds = ref<{ userId: string; postId: string }[]>([])


const currentPage = ref(1)
const pageSize = 10

const defaultAvatar = '/src/assets/avart.jpg'
const centerDialogVisible = ref(false)

const demandToDelete = ref<{ userId: string; demandId: string } | null>(null)

const dialogVisible = ref(false)
const selectedDemand = ref<any>(null)
const selectedUserId = ref('')
const selectedDemandId = ref('')

// const a=store.getDemandDetail("100231","d1")
// console.log(a)

 const allDemands = ref<any[]>([]) 
getDemandReviewListApi().then((res) => {
  allDemands.value = res.data
  console.log(res.data)
  return res.data
})

// const filteredList=[[]]
const filteredList = computed(() => {
  
  let list = allDemands.value

  if (keyword.value) {
    const key = keyword.value.toLowerCase()
    list = list.filter(item =>
      item.publisherName.toLowerCase().includes(key) ||
      item.publisherPhone.includes(key) ||
      item.title.toLowerCase().includes(key)
    )
  }

  if (currentTab.value !== '全部') {
    list = list.filter(item => item.status === currentTab.value)
  }

  return list
})

const pagedData = computed(() =>
  filteredList.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
)

const pendingCount = computed(() => allDemands.value.filter(d => d.status === '待审核').length)
const approvedCount = computed(() => allDemands.value.filter(d => d.status === '已通过').length)
const rejectedCount = computed(() => allDemands.value.filter(d => d.status === '已驳回').length)
const totalCount = computed(() => allDemands.value.length)

function filterByStatus(status: typeof currentTab.value) {
  currentTab.value = status
  currentPage.value = 1
}

function handleSearch() {
  currentPage.value = 1
}

function handleSelectionChange(val: any[]) {
  selectedIds.value = val.map(v => ({
    userId: v.user_id,  
    postId: v.post_id
  }))
}

async function batchApprove() {
  if (!selectedIds.value.length) return

  try {
    const promises = selectedIds.value.map(({ userId, postId }) => 
      updateDemandStatusApi(userId, postId, '已通过')
    )
    await Promise.all(promises)

    ElMessage.success('批量通过成功')
    selectedIds.value = []
    await refreshDemands()

  } catch (error) {
    console.error(error)
    ElMessage.error('批量通过失败，请稍后重试')
  }
}

async function batchReject() {
  if (!selectedIds.value.length) return

  try {
    const promises = selectedIds.value.map(({ userId, postId }) => 
      updateDemandStatusApi(userId, postId, '已驳回')
    )
    await Promise.all(promises)

    ElMessage.success('批量驳回成功')
    selectedIds.value = []
    await refreshDemands()

  } catch (error) {
    console.error(error)
    ElMessage.error('批量驳回失败，请稍后重试')
  }
}

async function refreshDemands() {
  const res = await getDemandReviewListApi()
  allDemands.value = res.data
}



function viewDemandDetail(userId: string, demandId: string) {

  selectedUserId.value = userId
  selectedDemandId.value = demandId
  dialogVisible.value = true

}


function showUser(userId: string) {
  router.push({ name: 'user-details', params: { id: userId } })
}

function confirmDelete(userId: string, demandId: string) {
  demandToDelete.value = { userId, demandId }
  centerDialogVisible.value = true
}


function delDemand() {
  if (demandToDelete.value) {
    // deleteDemandReviewApi(demandToDelete.value.userId, demandToDelete.value.demandId).then(() => {
      // allDemands.value = allDemands.value.filter(d => d.userId !== demandToDelete.value?.userId && d.demandId !== demandToDelete.value?.demandId)
      // store.deleteDemand(demandToDelete.value.userId, demandToDelete.value.demandId)
    // })
  //   store.deleteDemand(demandToDelete.value.userId, demandToDelete.value.demandId)
  //   demandToDelete.value = null
  }
  // centerDialogVisible.value = false
}



</script>

<style scoped>
.card {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
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
.user-text {
  margin-left: 10px;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
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
