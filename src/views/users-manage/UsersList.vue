<template>
  <div class="card">
    
    <!-- 搜索和筛选 -->
    <div class="header">
      <el-input
        v-model="keyword"
        placeholder="搜索用户 ID/昵称/手机号"
        clearable
        @clear="onSearch"
        @keyup.enter.native="onSearch"
        style="width: 300px;"
      >
      </el-input>

      <el-select
        v-model="selectedRole"
        placeholder="角色"
        clearable
        @change="onFilter"
        class="select-filter"
      >
        <el-option label="全部" value="" />
        <el-option label="大学生" value="大学生" />
        <el-option label="农户" value="农户" />
        <el-option label="商家" value="商家" />
      </el-select>

      <el-select
        v-model="selectedStatus"
        placeholder="账号状态"
        clearable
        @change="onFilter"
        class="select-filter"
      >
      <el-option label="全部" value="" />
        <el-option label="正常" value="正常" />
        <el-option label="已冻结" value="已冻结" />
      </el-select>

      <el-button type="primary" class="export-btn" @click="exportToExcel">
  <img src="/src/assets/download.png" class="export-icon" />
  导出用户
</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="paginatedUsers" style="width: 100%" >
  <el-table-column label="用户信息" :min-width="140" >
    <template #default="{ row }">
      <div class="user-info">
        <el-avatar :src="row.avatar" size="default" class="user-avatar" />
        <div class="user-meta">
          <div class="user-name">{{ row.name }}</div>
          <div class="user-id">ID: {{ row.id }}</div>
        </div>
      </div>
    </template>
  </el-table-column>

  <el-table-column label="账号角色">
  <template #default="{ row }">
    <el-tag
      :style="getRoleTagStyle(row.role)"
      effect="light"
    >
      {{ row.role }}
    </el-tag>
  </template>
</el-table-column>



  <el-table-column prop="phone" label="手机号" />
  <el-table-column prop="registerTime" label="注册时间" />
  <el-table-column prop="lastLoginTime" label="最后登录" />

  <el-table-column label="警告次数">
    <template #default="{ row }">
      <el-tag
        :type="row.warningCount > 2 ? 'danger' : row.warningCount === 0 ? 'info' : 'warning'"
        effect="light"
      >
        {{ row.warningCount }} 次
      </el-tag>
    </template>
  </el-table-column>

  <el-table-column label="账号状态">
    <template #default="{ row }">
      <el-tag :type="row.status === '正常' ? 'success' : row.status === '已冻结' ? 'danger' : 'info'">
        {{ row.status }}
      </el-tag>
    </template>
  </el-table-column>

  <el-table-column label="操作" min-width="160" cell-class-name="action-column" >
    <template #default="{ row }">
      <el-button type="primary" link @click="viewuser(row.id)">查看详情</el-button>
      <el-button
        v-if="row.status === '正常'"
        type="danger"
        link
        @click="onFreeze(row.id)"
      >
        冻结账号
      </el-button>
      <el-button
        v-if="row.status === '已冻结'"
        type="success"
        link
        @click="onUnfreeze(row.id)"
      >
        解冻账号
      </el-button>
    </template>
  </el-table-column>
</el-table>


    <!-- 分页 -->
    <div class="footer">
      <span class="record-count">共 {{ filteredUsers.length }} 条记录</span>
      <el-pagination
        layout="prev, pager, next"
        :total="filteredUsers.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserListStore } from '../../store/userList'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import router from '@/router'

const store = useUserListStore()
const keyword = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = 10

const filteredUsers = computed(() => store.filteredUsers)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

function onSearch() {
  store.searchUser(keyword.value)
}

function onFilter() {
  store.filterUsersByRoleOrStatus(selectedRole.value, selectedStatus.value)
}

function onFreeze(userId: string) {
  store.freezeUserById(userId)
  store.filterUsersByRoleOrStatus(selectedRole.value, selectedStatus.value)
}

function onUnfreeze(userId: string) {
  store.unfreezeUserById(userId)
  store.filterUsersByRoleOrStatus(selectedRole.value, selectedStatus.value)
}

function viewuser(userId: string) {
  router.push({ name: 'user-details', params: { id: userId} })
}

function getRoleTagStyle(role: string) {
  switch (role) {
    case '大学生':
      return { backgroundColor: '#DBEAFE', color: '#1E40AF',borderColor: '#DBEAFE'  }
    case '农户':
      return { backgroundColor: '#F3F4F6', color: '#1F2937', borderColor: '#F3F4F6' }
    case '商家':
      return { backgroundColor: '#F3E8FF', color: '#6B21A8', borderColor: '#F3E8FF' }
    default:
      return { backgroundColor: '#F3E8FF', color: '#6B21A8', borderColor: '#F3E8FF' }
  }
}


function exportToExcel() {
  const data = store.filteredUsers.map(user => ({
    用户ID: user.id,
    昵称: user.name,
    性别: user.gender,
    手机号: user.phone,
    账号角色: user.role,
    标签: user.tags.map(t => t).join(', '),
    注册时间: user.registerTime,
    最后登录时间: user.lastLoginTime,
    警告次数: user.warningCount,
    状态: user.status,
    被举报次数: user.reportCount,
    冻结次数: user.freezeCount
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '用户列表')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, `用户列表_${new Date().toLocaleDateString()}.xlsx`)
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
.user-list {
  padding: 20px;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  min-width: 400px;
}

.select-filter {
  width: 150px;
}

.export-btn {
  margin-left: auto;
}
.export-icon {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 10px;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
}

.user-id {
  font-size: 12px;
  color: #999;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.record-count {
  font-size: 14px;
  color: #666;
}

::v-deep(.el-table .el-table__cell) {
  padding-top: 14px;
  padding-bottom: 14px;
}

::v-deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  color: #6B7280;
  font-weight: 600;
  font-size: 14px;
}

:deep(.el-tag) {
  transition: none !important;
  animation: none !important;

}
</style>
