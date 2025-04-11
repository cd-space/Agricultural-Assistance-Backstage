<template>
  <div class="user-list">
    
    <!-- 搜索和筛选 -->
    <div class="header">
      <el-input
        v-model="keyword"
        placeholder="搜索用户 ID/昵称/手机号"
        clearable
        @clear="onSearch"
        @keyup.enter.native="onSearch"
        class="search-input"
      >
      </el-input>

      <el-select
        v-model="selectedRole"
        placeholder="筛选角色"
        clearable
        @change="onFilter"
        class="select-filter"
      >
        <el-option label="大学生" value="大学生" />
        <el-option label="农户" value="农户" />
        <el-option label="商家" value="商家" />
      </el-select>

      <el-select
        v-model="selectedStatus"
        placeholder="筛选状态"
        clearable
        @change="onFilter"
        class="select-filter"
      >
        <el-option label="正常" value="正常" />
        <el-option label="已冻结" value="已冻结" />
      </el-select>

      <el-button type="primary" icon="el-icon-download" class="export-btn">导出用户</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="paginatedUsers" border style="width: 100%">
      <el-table-column label="用户信息" width="200">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :src="row.avatar" size="small" class="user-avatar" />
            <div class="user-meta">
              <div class="user-name">{{ row.name }}</div>
              <div class="user-id">ID: {{ row.id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="账号角色" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.role }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="registerTime" label="注册时间" width="120" />
      <el-table-column prop="lastLoginTime" label="最后登录" width="160" />

      <el-table-column label="警告次数" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.warningCount > 2 ? 'danger' : row.warningCount === 0 ? 'info' : 'warning'"
            effect="light"
          >
            {{ row.warningCount }} 次
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="账号状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : row.status === '已冻结' ? 'danger' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" link>查看详情</el-button>
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
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserListStore } from '../../store/userList'

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
  const user = store.users.find(u => u.id === userId)
  if (user) user.status = '已冻结'
  store.filterUsersByRoleOrStatus(selectedRole.value, selectedStatus.value)
}

function onUnfreeze(userId: string) {
  const user = store.users.find(u => u.id === userId)
  if (user) user.status = '正常'
  store.filterUsersByRoleOrStatus(selectedRole.value, selectedStatus.value)
}

onMounted(() => {
  store.setUsers([
    {
      id: '100231',
      avatar: '',
      name: '赵雅芝',
      gender: '女',
      birthday: '1990-01-01',
      role: '大学生',
      phone: '13812345678',
      registerTime: '2023-06-15',
      lastLoginTime: '2024-01-15 15:30',
      warningCount: 1,
      status: '正常',
      tags: [],
      postCount: 5,
      reportCount: 0,
      freezeCount: 0
    },
    {
      id: '100232',
      avatar: '',
      name: '刘德华',
      gender: '男',
      birthday: '1985-03-20',
      role: '农户',
      phone: '15912341234',
      registerTime: '2023-08-20',
      lastLoginTime: '2024-01-14 09:15',
      warningCount: 3,
      status: '已冻结',
      tags: [],
      postCount: 2,
      reportCount: 1,
      freezeCount: 1
    },
    {
      id: '100233',
      avatar: '',
      name: '林玉玲',
      gender: '女',
      birthday: '1992-12-12',
      role: '商家',
      phone: '13612349012',
      registerTime: '2023-09-01',
      lastLoginTime: '2024-01-13 18:45',
      warningCount: 0,
      status: '正常',
      tags: [],
      postCount: 3,
      reportCount: 0,
      freezeCount: 0
    }
  ])
})
</script>

<style scoped>
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
</style>
