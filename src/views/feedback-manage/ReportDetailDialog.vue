<template>
  <el-dialog v-model="visible" title="举报详情" width="800px" class="report-dialog" :close-on-click-modal="false">
    <div style="border-bottom: 1px solid #E5E7EB; margin-bottom: 25px;"></div>
    <div class="detail-container">
      <!-- 举报信息 -->
      <div class="section">
        <div class="left">
          <div class="info-item">
            <span class="label">举报类型</span>
            <div style="margin-top: 5px;">
              <el-tag>{{ report.type }}</el-tag>
            </div>
          </div>
          <div class="info-item">
            <span class="label">举报时间</span>
            <div style="margin-top: 5px;">{{ report.time }}</div>
          </div>
          <div class="info-item">
            <span class="label">状态</span>
            <div style="margin-top: 5px;">
              <el-tag :type="statusTagType(report.status)">{{ report.status }}</el-tag>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="info-item">
            <span class="label">举报描述</span>
            <div class="desc">
              {{ report.description }}
              <!-- <el-link type="primary" v-if="report.source.length > 0" style="margin-left: 6px" :underline="true"
                @click="openDemandDetailDialog">
                前往删评
              </el-link> -->
            </div>
          </div>
          <div class="info-item" v-if="report.images?.length">
            <span class="label">附件截图</span>
            <div class="images">
              <el-image v-for="(img, idx) in report.images" :key="idx" :src="img" :preview-src-list="report.images"
                fit="cover" />
            </div>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 举报人 & 被举报人 -->
      <div class="user-section">
        <div class="user-card">
          <div class="title">举报人信息</div>
          <div class="user-info" @click="viewuser(report.reporterId)">
            <el-avatar :src="report.reporterAvatar" size="large" />
            <div class="meta">
              <div>{{ report.reporterName }}</div>
              <div class="id">ID: {{ report.reporterId }}</div>
              <!-- <div class="time">注册时间：{{ report.reporterRegisterTime }}</div> -->
            </div>
          </div>
        </div>
        <div class="user-card">
          <div class="title">被举报人信息</div>
          <div class="user-info" @click="viewuser(report.reportedId)">
            <el-avatar :src="report.reportedAvatar" size="large" />
            <div class="meta">
              <div>{{ report.reportedName }}</div>
              <div class="id">ID: {{ report.reportedId }}</div>
              <!-- <div class="time">注册时间：{{ report.reportedRegisterTime }}</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button v-if="report.status === '待处理'" @click="onIgnore" type="info">忽略举报</el-button>
      <el-button v-if="report.status === '待处理'" @click="onWarn" type="danger">警告处理</el-button>
    </template>

    <DemandDetailDialog
  v-if="demandDialogVisible"
  v-model="demandDialogVisible"
  :user-id="dialogUserId"
  :demand-id="dialogDemandId"
/>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useReportStore } from '@/store/reportStore'
import DemandDetailDialog from '@/views/application-manage/DemandDetailDialog.vue' 
import router from '@/router'

interface Props {
  modelValue: boolean
  reportId: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'ignore', 'warn'])
const reportStore = useReportStore()
const report = ref({
  id: props.reportId,
  type: '举报类型',
  time: '举报时间',
  status: '待处理',
  description: '举报描述',
  images: [],
  reporterId: '举报人ID',
  reportedId: '被举报人ID',
  reporterName: '举报人姓名',
  reportedName: '被举报人姓名',
  reporterAvatar: '举报人头像',
  reportedAvatar: '被举报人头像',
})

const visible = ref(props.modelValue)

watch(() => props.modelValue, val => visible.value = val)
watch(visible, val => emit('update:modelValue', val))

const close = () => {
  visible.value = false
}

const onIgnore = () => {
  emit('ignore', report.value.id)
  close()
}

const onWarn = () => {
  // emit('warn', props.report.reportedId, props.report.id)
  close()
}

const statusTagType = (status: string) => {
  switch (status) {
    case '待处理': return 'warning'
    case '已处理': return 'success'
    case '已忽略': return 'info'
    default: return ''
  }
}


const demandDialogVisible = ref(false)
const dialogUserId = ref('')
const dialogDemandId = ref('')


//前往删评
const openDemandDetailDialog = () => {
  // if (props.report.source.length >= 2) {
  //   dialogUserId.value = props.report.source[0]
  //   dialogDemandId.value = props.report.source[1]
  //   demandDialogVisible.value = true
  // }
}

function viewuser(userId: string) {
  router.push({ name: 'user-details', params: { id: userId} })
}
</script>

<style scoped>
.report-dialog ::v-deep(.el-dialog__body) {
  padding-top: 0;
}

.detail-container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #333;
}

.section {
  display: flex;
  justify-content: space-between;
}

.left, .right {
  width: 48%;
}

.info-item {
  margin-bottom: 25px;
}

.label {
  font-weight: 500;
  margin-right: 8px;
  color: #666;
}

.desc {
  margin-top: 4px;
  line-height: 1.5;
}

.images {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.user-section {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.user-card {
  background: #F9FAFB;
  padding: 16px;
  border-radius: 8px;
  width: 48%;
}

.title {
  font-weight: bold;
  margin-bottom: 12px;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.meta {
  margin-left: 12px;
}

.id, .time {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
}
</style>
