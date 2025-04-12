<template>
  <div class="card">
    <div class="header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索导师姓名、电话、邮箱..."
        @input="onSearch"
        clearable
        class="search-input"
      />
      <el-button type="primary" @click="onAddMentor">+ 新增导师</el-button>
    </div>

    <el-table
      :data="pagedMentors"
      style="width: 100%; margin-bottom: 20px"
    >
    <!-- TODO：选择十个导师暂未做 -->
      <el-table-column type="selection" width="50" />

      <el-table-column label="导师信息" width="120">
        <template #default="{ row }">
          <div class="info">
            <img :src="row.avatar" class="avatar" />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="联系方式"  width="190">
        <template #default="{ row }">
          <div>{{ row.phone }}</div>
          <div>{{ row.email }}</div>
        </template>
      </el-table-column>

      <el-table-column label="专业标签" width="200">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            type="info"
            size="small"
            style="margin-right: 6px; margin-bottom: 4px"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="简介">
        <template #default="{ row }">
          <div class="intro">{{ row.intro }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作"  width="140">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="onEdit(row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="onDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer">
      <span class="record-count">共 {{ mentorStore.filteredMentors.length }} 条记录</span>
      <el-pagination
        layout="prev, pager, next"
        :total="mentorStore.filteredMentors.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="goToPage"
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
import { useMentorListStore } from '../../store/supervisorStore'
import MentorDialog from './MentorDialog.vue'

import router from '@/router'

const mentorStore = useMentorListStore()
const searchKeyword = ref('')

const currentPage = ref(1)
const pageSize = 3

const showDialog = ref(false)
const editMentorId = ref<string | undefined>(undefined)


const pagedMentors = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return mentorStore.filteredMentors.slice(start, start + pageSize)
})

const onSearch = () => {
  if (!searchKeyword.value) {
    mentorStore.resetFilter()
  } else {
    mentorStore.searchMentor(searchKeyword.value)
  }
  currentPage.value = 1
}

const onAddMentor = () => {
  editMentorId.value = undefined
  showDialog.value = true
}

const onEdit = (id: string) => {
  editMentorId.value = id
  showDialog.value = true
}


const onDelete = (id: string) => {
  mentorStore.deleteMentor(id)
}
const goToPage = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  mentorStore.setMentors([
    {
      id: '1',
      name: '赵志远',
      phone: '13888888888',
      email: 'zhaozhy@example.com',
      avatar: 'https://i.pravatar.cc/100?img=1',
      intro: '资深用户体验设计师，拥有 15 年行业经验。专注于企业级产品设计与用户研究，曾主导多个大型项目的设计工作。',
      tags: ['UI设计', '用户研究', '设计管理'],
      applyCount: 12,
      isFeatured: true
    },
    {
      id: '2',
      name: '林晓华',
      phone: '13999999999',
      email: 'linxh@example.com',
      avatar: 'https://i.pravatar.cc/100?img=2',
      intro: '产品设计专家，擅长用户研究与交互设计。曾在多家知名科技公司担任设计负责人，带领团队完成多个重要项目。',
      tags: ['产品设计', '交互设计', '用户研究'],
      applyCount: 8,
      isFeatured: false
    },
    {
      id: '3',
      name: '王建国',
      phone: '13777777777',
      email: 'wangjg@example.com',
      avatar: 'https://i.pravatar.cc/100?img=3',
      intro: '资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。',
      tags: ['前端开发', '性能优化', '工程化'],
      applyCount: 20,
      isFeatured: true
    },
    {
      id: '4',
      name: '王建国',
      phone: '13777777777',
      email: 'wangjg@example.com',
      avatar: 'https://i.pravatar.cc/100?img=3',
      intro: '资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。',
      tags: ['前端开发', '性能优化', '工程化'],
      applyCount: 20,
      isFeatured: true
    },
    {
      id: '5',
      name: '王建国',
      phone: '13777777777',
      email: 'wangjg@example.com',
      avatar: 'https://i.pravatar.cc/100?img=3',
      intro: '资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。',
      tags: ['前端开发', '性能优化', '工程化'],
      applyCount: 20,
      isFeatured: true
    }
  ])
})

</script>

<style scoped>
.card {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.search-input {
  width: 300px;
}
.info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.intro {
  font-size: 13px;
  color: #555;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
}
.record-count {
  color: #666;
  font-size: 14px;
}

::v-deep(.el-table .el-table__cell) {
  padding-top: 18px;
  padding-bottom: 18px;
}

::v-deep(.el-table__header-wrapper th) {
  background-color: #f5f7fa;
  color: #6B7280;
  font-weight: 600;
  font-size: 14px;
}

::v-deep(.el-table .el-table__header .el-checkbox) {
  display: none !important;
}

:deep(.el-tag) {
  transition: none !important;
  animation: none !important;
  background-color: #DBEAFE;
  border: #DBEAFE;
  color: #1E40AF;
}

</style>
