<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>

    <button
      v-for="page in pageList"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
      :disabled="page === '...'">
      {{ page }}
    </button>

    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">下一页</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
})
const emit = defineEmits(['update:currentPage'])

const changePage = (page) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const pageList = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.pagination button {
  padding: 4px 12px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination .active {
  background-color: #2d8cf0;
  color: white;
  border-color: #2d8cf0;
}
</style>
