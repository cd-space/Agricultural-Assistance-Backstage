<template>
  <el-dialog
    v-model="visible"
    title="举报详情"
    width="600px"
    :before-close="handleClose"
  >
    <div v-if="report" class="report-detail">
      <el-descriptions column="1" border>
        <el-descriptions-item label="举报编号">{{ report.id }}</el-descriptions-item>
        <el-descriptions-item label="举报类型">{{ report.type }}</el-descriptions-item>
        <el-descriptions-item label="举报时间">{{ report.time }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagType(report.status)">
            {{ report.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="来源">{{ report.source.join(' / ') }}</el-descriptions-item>
      </el-descriptions>

      <div class="section-title">举报人</div>
      <div class="user-info">
        <el-avatar :src="report.reporterAvatar" />
        <div>
          <div>{{ report.reporterName }}</div>
          <div>ID：{{ report.reporterId }}</div>
        </div>
      </div>

      <div class="section-title">被举报人</div>
      <div class="user-info">
        <el-avatar :src="report.reportedAvatar" />
        <div>
          <div>{{ report.reportedName }}</div>
          <div>ID：{{ report.reportedId }}</div>
        </div>
      </div>

      <div v-if="report.images?.length" class="section-title">举报图片</div>
      <div class="image-list" v-if="report.images?.length">
        <el-image
          v-for="(img, index) in report.images"
          :key="index"
          :src="img"
          style="width: 100px; height: 100px; margin-right: 10px"
          :preview-src-list="report.images"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  visible: boolean
  report: any
}>()

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const handleClose = () => {
  visible.value = false
}

const statusTagType = (status: string) => {
  switch (status) {
    case '待处理':
      return 'danger'
    case '已处理':
      return 'success'
    case '已忽略':
      return 'info'
    default:
      return ''
  }
}
</script>

<style scoped>
.report-detail {
  margin-top: 10px;
}
.section-title {
  font-weight: bold;
  margin: 20px 0 10px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
