<template>
  <div class="card">

    <div class="toolbar">
      <el-input v-model="search" placeholder="搜索新闻标题、来源..." clearable @input="onSearch"
        style="width: 300px; margin-right: 16px" />
      <div>
        <el-button @click="setSort('publishDate')" :class="{ 'active': newsStore.sortBy === 'publishDate' }">
          按发布日期排序
        </el-button>
        <el-button @click="setSort('views')" :class="{ 'active': newsStore.sortBy === 'views' }">
          按访问量排序
        </el-button>
        <el-button type="primary" @click="dialogVisible = true">+ 转载新闻</el-button>
      </div>
    </div>


    <el-table :data="paginatedNews" style="width: 100%; margin-top: 20px" @select="onRowSelect "
      @selection-change="onSelectionChange" :row-key="row => row.id" ref="tableRef">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="title" label="新闻标题">
        <template #default="{ row }">
          <el-link :href="row.url" target="_blank">{{ row.title }}</el-link>
        </template>
      </el-table-column>

      <el-table-column prop="publishDate" label="发布日期" width="120" />
      <el-table-column prop="repostDate" label="转载日期" width="120" />
      <el-table-column prop="source" label="来源" width="140" />
      <el-table-column prop="views" label="访问量" width="100" />
      <el-table-column label="可见" width="80">
        <template #default="{ row }">
          <div @click="toggleVisible(row.id)" style="cursor: pointer; margin-left: 8px;">
            <el-icon v-if="row.visible" style="color: #409EFF">
              <View />
            </el-icon>
            <el-icon v-else style="color: #F56C6C">
              <Hide />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button @click="deleteNews(row.id)" style="border: none; margin-left: -8px;">
            <img src="/src/assets/delete.png" alt="删除" style=" width: 14px; height: 16px;">
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
      <span class="record-info">
        显示 {{ pageStart + 1 }} 到 {{ pageEnd }} 条，共 {{ total }} 条记录
      </span>
      <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
        @current-change="onPageChange" />

    </div>
  </div>


  <el-dialog v-model="dialogVisible" title="转载新闻" width="500px" :close-on-click-modal="false">
    <el-form :model="form" label-width="80px">
      <el-form-item label="转载链接">
        <el-input v-model="form.url" placeholder="请输入新闻链接" />
      </el-form-item>
      <el-form-item label="新闻出处">
        <el-input v-model="form.source" placeholder="请输入新闻出处" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>





<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNewsStore } from '/src/store/newsStore'
import { View, Hide} from '@element-plus/icons-vue'
import type { ElTable } from 'element-plus'


const newsStore = useNewsStore()

const search = ref(newsStore.searchKeyword)

// 组件本地分页参数
const currentPage = ref(1)
const pageSize = ref(10)

// 总条数：computed 来自筛选后的列表
const total = computed(() => newsStore.filteredNews.length)

const pageStart = computed(() => (currentPage.value - 1) * pageSize.value)
const pageEnd = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > total.value ? total.value : end
})
// 当前页的数据：手动分页逻辑
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return newsStore.filteredNews.slice(start, end)
})

const onSearch = () => {
  newsStore.setSearchKeyword(search.value)
  currentPage.value = 1 // 搜索后重置为第1页
}

const setSort = (key: string) => {
  newsStore.setSortBy(key)
}

const deleteNews = (id: number) => {
  newsStore.deleteNews(id)
}

const toggleVisible = (id: number) => {
  newsStore.toggleVisibility(id)
}

const onPageChange = (page: number) => {
  currentPage.value = page
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const selectedRows = ref<any[]>([])

const onRowSelect = (selection: any[], row: any) => {
  if (selection.length > 3) {
    // 超出限制，取消最新选中的这一项
    const index = selection.findIndex(item => item.id === row.id)
    if (index !== -1) {
      selection.splice(index, 1)
    }
    // 还原表格中的选中状态
    if (tableRef.value) {
      tableRef.value.toggleRowSelection(row, false)
    }
  } else {
    selectedRows.value = selection
  }
}

const onSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}



const dialogVisible = ref(false)

const form = ref({
  url: '',
  source: ''
})

const handleConfirm = () => {


  newsStore.addNews({
    url: form.value.url,
    source: form.value.source
  })

    form.value.url = ''
  form.value.source = ''
  // 关闭弹窗
  dialogVisible.value = false
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

.news-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.active {
  background-color: #4CAF50;
  color: white;
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

::v-deep(.el-table .el-table__cell) {
  padding-top: 16px;
  padding-bottom: 16px;
}

.record-info {
  margin-right: 12px;
  font-family: Roboto;
font-size: 14px;
color: #666;
}
</style>
