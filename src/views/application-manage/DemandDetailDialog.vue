<template>
  <el-dialog v-model="visible" width="850px" :show-close="false" class="demand-dialog">
    <template #header="{ close }">
      <div class="dialog-header">
        <div class="title">已通过的需求 - 查看详情</div>
        <el-icon @click="close" class="close-icon"><Close /></el-icon>
      </div>
    </template>

    <div class="detail-title">
      <div class="text">{{ demand.title }}</div>
      <el-tag type="success">已通过</el-tag>
    </div>
    <div class="meta">
      <span>发布时间：{{ demand.publishTime }}</span>
    </div>

    <div class="publisher">
      <el-avatar :src="demand.publisherAvatar" size="large" />
      <div class="info">
        <div class="name">{{ demand.publisherName }}</div>
        <div class="phone">{{ demand.publisherauthRole }} · {{ demand.publisherPhone }}</div>
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
        fit="cover"
        :preview-src-list="demand.images"
        :initial-index="index"
      />
    </div>

    <div class="section" v-if="demand.status === '已通过'">
      <div class="section-title">评论记录</div>
      <div class="comment" v-for="(comment, index) in fullComments" :key="index">
        <el-avatar :src="comment.avatar" size="default" />
        <div class="comment-info">
          <div class="name-role">
            <span class="name">{{ comment.name }}</span>
            <span class="role">{{ comment.role }}</span>
          </div>
          <div class="text">{{ comment.content }}</div>
          <div class="time">{{ comment.time }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" type="danger">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useUserListStore } from '../../store/userList'

const visible = defineModel<boolean>()
const props = defineProps<{
  demand: any
}>()

const userListStore = useUserListStore()

const fullComments = computed(() => {
  return props.demand.comments.map((comment: any) => {
    const user = userListStore.users.find(u => u.id === comment.commenterId)
    console.log(user,'user')
    return {
      ...comment,
      avatar: user?.avatar || '',
      name: user?.name || '未知用户',
      role: user?.authRole || '未认证'
    }
  })
})
console.log(fullComments,'fullComments')
</script>

<style scoped>
.demand-dialog :deep(.el-dialog__body) {
  max-height: 75vh;
  overflow-y: auto;
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
  color: #999;
  margin-bottom: 20px;
}
.publisher {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}
.publisher .info .name {
  font-weight: bold;
}
.publisher .info .phone {
  color: #999;
}
.section {
  margin-bottom: 20px;
}
.section-title {
  font-weight: 600;
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
  margin-bottom: 16px;
}
.comment-info {
  margin-left: 10px;
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
