<template>
  <div class="card">
    <div class="header">
      <el-input v-model="searchKeyword" placeholder="搜索导师姓名、电话、邮箱..." @input="onSearch" clearable
        class="search-input" />
      <el-button type="primary" @click="onAddMentor">+ 新增导师</el-button>
    </div>

    <el-table :data="pagedMentors" style="width: 100%; margin-bottom: 20px">
      <el-table-column label="是否置顶" width="80">
        <template #default="{ row }">
          <el-button type="text" size="small" :style="{ color: row.isFeatured ? '#F56C6C' : '' }"
            @click="onToggleFeatured(row.id)">
            {{ row.isFeatured ? '取消' : '置顶' }}
          </el-button>
        </template>
      </el-table-column>


      <el-table-column label="导师信息" width="120">
        <template #default="{ row }">
          <div class="info">
            <img :src="row.avatar" class="avatar" />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" width="190">
        <template #default="{ row }">
          <div>{{ row.phone }}</div>
          <div>{{ row.email }}</div>
        </template>
      </el-table-column>

      <el-table-column label="专业标签" width="200">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag" type="info" size="small"
            style="margin-right: 6px; margin-bottom: 4px">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="简介">
        <template #default="{ row }">
          <div class="intro">{{ row.intro }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="onEdit(row.id)"><svg-icon name="edit" style="width: 16px ; height: 16px;"/></el-button>
          <el-button type="text" size="small" @click="onDelete(row.id)"><svg-icon name="delete" style="width: 18px ; height: 20px; color:#9CA3AF ;" /></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer">
      <span class="record-count">共 {{ mentorStore.filteredMentors.length }} 条记录</span>
      <el-pagination layout="prev, pager, next" :total="mentorStore.filteredMentors.length" :page-size="pageSize"
        v-model:current-page="currentPage" @current-change="goToPage" />
    </div>

    <MentorDialog v-model:visible="showDialog" :mentorId="editMentorId" />

  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMentorListStore } from '../../store/supervisorStore'
import MentorDialog from './MentorDialog.vue'


const mentorStore = useMentorListStore()
const searchKeyword = ref('')

const currentPage = ref(1)
const pageSize = 8

const showDialog = ref(false)
const editMentorId = ref<string | undefined>(undefined)


const pagedMentors = computed(() => {
  const sorted = [...mentorStore.filteredMentors].sort((a, b) => {
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
  })
  const start = (currentPage.value - 1) * pageSize
  return sorted.slice(start, start + pageSize)
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

const onToggleFeatured = (id: string) => {
  mentorStore.toggleIsFeatured(id)
}


onMounted(() => {
  mentorStore.fetchMentors()
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

  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制最多两行 */
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
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
