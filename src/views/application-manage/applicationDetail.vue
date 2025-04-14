<template>
    <div class="card">
      <div class="card-title">
        <div style="display: flex; gap: 25px;">
          <span style="font-size: 18px; color: #111827;font-weight: 700;">申请详情</span>
          <el-tag :type="statusTagType(application?.status)" effect="light">
            {{ application?.status }}
          </el-tag>
        </div>
      </div>

      <el-divider />

      <!-- 申请人信息 -->
      <div class="section">
        <div class="person-info-1" @click="showuser(application?.applicantId)">
          <el-avatar :size="64" :src="application?.avatar" />
          <div class="text">
            <div class="name">{{ application?.applicantName }}</div>
            <div class="phone">{{ application?.applicantPhone }}</div>
            <div class="time">申请时间：{{ application?.applyTime }}</div>
          </div>
        </div>
      </div>

      <!-- 导师信息 -->
      <div class="section">
        <div style="font-size: 16px; color: #111827;font-weight: 700; margin-bottom: 15px;">申请导师</div>
        <div class="person-info">
          <!-- TODO：没有关联到导师头像 -->
          <el-avatar :size="64" src="https://placehold.co/64x64" />
          <div class="text">
            <div class="name">{{ application?.supervisorName }}</div>
            <el-link type="primary" @click="showSupervisor(application.supervisorId)">点击查看</el-link>
          </div>
        </div>
      </div>

      <!-- 申请理由 -->
      <div class="section">
        <div style="font-size: 16px; color: #111827;font-weight: 700; margin-bottom: 15px;">申请理由</div>
        <div class="reason-box">{{ application?.reason }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="danger" @click="reject">驳回</el-button>
        <el-button type="primary" @click="approve">通过</el-button>
      </div>

      <MentorDialog
  v-model:visible="showDialog"
  :mentorId="editMentorId"
/>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useSupervisorApplicationStore } from '../../store/supervisorApplication'
import MentorDialog from '../supervisoe-library/MentorDialog.vue'

const route = useRoute()
const router = useRouter()
const store = useSupervisorApplicationStore()

const application = ref()

const showDialog = ref(false)
const editMentorId = ref<string | undefined>(undefined)

onMounted(() => {
  const id = Number(route.params.id)
  application.value = store.getById(id)
  console.log(application.value)
})

function statusTagType(status?: string) {
  switch (status) {
    case '待审核': return 'warning'
    case '已通过': return 'success'
    case '已驳回': return 'danger'
    default: return ''
  }
}

function approve() {
  if (application.value) {
    store.approveById(application.value.id)
    application.value = store.getById(application.value.id)
  }
}

function reject() {
  if (application.value) {
    store.rejectById(application.value.id)
    application.value = store.getById(application.value.id)
  }
}

function goBack() {
  router.back()
}

function showuser(userId: string){
  router.push({ name: 'user-details', params: { id: userId} })
}
function showSupervisor( id: Number) {
  editMentorId.value = id.toString()
  showDialog.value = true
}

</script>

<style scoped>
.application-detail {
  padding: 24px;
  background-color: #f8f9fa;
}
.card {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section {
  margin-top: 24px;
}
.person-info {
  margin-top: 24px;
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.person-info-1 {
  margin-top: 24px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  cursor: pointer;
}
.person-info{
  margin-top: 24px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  cursor: pointer;
  background: #F9FAFB;
  border-radius: 15px;
  padding: 15px 10px;
}


.text {
  margin-left: 16px;
}

.name {
  font-weight: bold;
  font-size: 18px;
  color: #111827;
}

.phone, .time {
  color: #6B7280;
  font-size: 14px;
  margin-top: 4px;
}
.reason-box {
  background: #F9FAFB;
  color: #4B5563;
  padding: 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
}
.footer {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-tag) {
  transition: none !important;
  animation: none !important;

}
</style>
