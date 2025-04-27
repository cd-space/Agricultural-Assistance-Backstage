<template>
  <el-dialog v-model="visible" width="800px" :show-close="false" class="demand-dialog">
    <template #header="{ close }">
      <div class="dialog-header">
        <div class="title">需求详情</div>
        <el-icon @click="close" class="close-icon"><Close /></el-icon>
      </div>
    </template>
    <div v-if="loading" style="text-align: center; padding: 40px 0;">
      <el-icon><Loading /></el-icon>
    </div>
    <div v-else>
      <div style="border-bottom: 1px solid #D1D5DB; margin-bottom: 20px;"></div>

      <div class="detail-title">
        <div class="text" style="font-size: 20px; font-weight: 700;">{{ demand.title }}</div>
        <el-tag :type="statusTagType">{{ demand.status }}</el-tag>
      </div>
      <div class="meta">
        <span>发布时间：{{ demand.publishTime }}</span>
      </div>

      <div class="publisher">
        <div style="font-size: 14px; color: #6B7280; margin-bottom: 10px;">发布人信息</div>
        <div style="display: flex; gap: 20px;">
          <el-avatar :src="demand.author.avatar" size="large" />
          <div class="info">
            <div class="name">{{ demand.author.name }}</div>
            <div class="phone">{{ demand.author.role }} · {{ demand.author.phone }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">需求描述</div>
        <div class="content" v-html="demand.description"></div>
      </div>

      <div class="section">
        <div class="section-title">需求相关图片</div>
        <el-image
          v-for="(img, index) in demand.images"
          :key="index"
          :src="img"
          class="preview-image"
          fit="contain"
          :preview-src-list="demand.images"
          :initial-index="index"
        />
      </div>

      <div class="section" v-if="demand.status === '已通过'">
        <div class="section-title">评论记录</div>
        <div style="max-height: 200px; overflow: auto;">
          <div class="comment" v-for="(comment, index) in fullComments" :key="index">
            <el-avatar :src="comment.avatar" size="default" />
            <div class="comment-info">
              <div class="name-role">
                <span class="name">{{ comment.name }}</span>
                <span class="role">{{ comment.role }}</span>
              </div>
              <div class="text">{{ comment.content }}</div>
            </div>
            <div style="display: flex; position: absolute; right: 10px; top: 8px;">
              <div class="time">{{ comment.time }}</div>
              <button @click="deleteComment(index)">
                <img src="/src/assets/delete2.png" alt="删除" style="width: 12px; height: 14px; margin-left: 10px;" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <template #footer>
      <div class="dialog-footer" v-if="demand && demand.status === '待审核'">
        <el-button type="success" @click="handleApprove">通过</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
      </div>
    </template>
    
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,watch } from 'vue'
import { Close, Loading } from '@element-plus/icons-vue'
import { useUserListStore } from '../../store/userList'
import { getDemandDetailApi } from '@/api/usersManage'

const visible = defineModel<boolean>()
const props = defineProps<{
  userId: string
  demandId: string
}>()

const userListStore = useUserListStore()
const demand = ref<any>({
  title: '',
  status: '',
  publishTime: '',
  publisherAvatar: '',
  publisherName: '',
  publisherauthRole: '',
  publisherPhone: '',
  description: '',
  images: [],
  comments: []
})
const loading = ref(true)


const loadDemandDetail = () => {

  getDemandDetailApi(props.userId, props.demandId).then((data) => {
    if (!data) {
      console.warn('找不到对应的需求信息')
      demand.value = null
      return
    }
    demand.value = data.data
    loading.value = false
  }).catch(() => {
    console.error('获取需求详情失败')
    demand.value = null
    loading.value = false
  })
  loading.value = false
}


// 监听 props 变化
watch(() => [props.userId, props.demandId], () => {
  loading.value = true
  loadDemandDetail()
})
const fullComments = computed(() => {
  if (!demand.value) return []
  return demand.value.comments.map((comment: any) => {
    const user = userListStore.users.find(u => u.id === comment.commenterId)
    return {
      ...comment,
      avatar: user?.avatar || '',
      name: user?.name || '未知用户',
    }
  })
})

const statusTagType = computed(() => {
  switch (demand.value?.status) {
    case '已通过':
      return 'success'
    case '已驳回':
      return 'danger'
    case '待审核':
      return 'warning'
    default:
      return ''
  }
})


//TODO: 处理通过和驳回的逻辑
const handleApprove = () => {
  // userListStore.approveDemand(props.userId, props.demandId)
  // visible.value = false
}

const handleReject = () => {
  // userListStore.rejectDemand(props.userId, props.demandId)
  // visible.value = false
}

const deleteComment = (commentIndex: number) => {
  // userListStore.deleteDemandComment(props.userId, props.demandId, commentIndex)
  // demand.value.comments.splice(commentIndex, 1)
}
</script>


<style scoped>
.demand-dialog :deep(.el-dialog__body) {
  max-height: 30vh;
  overflow-y: auto;
  border-radius: 15px;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.close-icon {
  cursor: pointer;
}
.detail-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
  margin: 15px 0 5px;
}
.meta {
  color: #6B7280;
  margin-bottom: 20px;
  font-size: 14px;
}
.publisher {
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  background-color: #F9FAFB;
  padding: 16px 18px;
  border-radius: 16px;
}
.publisher .info .name {
  font-weight: bold;
  padding-top: 2px;
  color: #000000;
}
.publisher .info .phone {
  margin-top: 6px;
  color: #999;
}
.section {
  margin-bottom: 20px;
}
.section-comment{
  max-height: 200px;
  overflow: auto;
}
.section-title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 10px;
}
.content ul {
  padding-left: 18px;
}
.preview-image {
  width: 180px;
  height: 110px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
}
.comment {
  display: flex;
  position: relative;
  margin-bottom: 16px;
  background-color: #F9FAFB;
  border-radius: 16px;
  padding: 5px;
}
.comment-info {
  margin-left: 10px;
  width: 92%;
}
.name-role {
  font-weight: bold;
}
.name-role .role {
  color: #999;
  margin-left: 10px;
}
.text {
  margin: 6px 0;
}
.time {
  color: #999;
  font-size: 12px;
}
.dialog-footer {
  text-align: right;
}
</style>
