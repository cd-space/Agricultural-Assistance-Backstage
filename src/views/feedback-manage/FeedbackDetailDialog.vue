<template>
  <el-dialog v-model="visible" width="700px" title="用户反馈详情" :close-on-click-modal="false" :show-close="false">
    <div style="border-bottom: 1px solid #D1D5DB ; margin-bottom: 10px;"></div>
    <div class="detail-wrapper">
      <!-- 用户信息 -->
      <div class="user-info">
        <el-avatar :size="50" :src="data.avatar" />
        <div class="user-text">
          <div class="username">{{ data.username }}</div>
          <div class="uid">UID: {{ data.userId }}</div>
        </div>
        <el-tag
          class="status-tag"
          :type="statusType(data.status)"
          disable-transitions
        >
          {{ data.status }}
        </el-tag>
      </div>

      <!-- 时间 / 类型 -->
      <div class="info-row">
        <div><span class="label">反馈时间：</span>{{ data.time }}</div>
      </div>
      <div class="info-row">
        <div>
          <span class="label">反馈类型：</span>
          <el-tag type="info" size="small" effect="light"
          style="background-color: #DBEAFE; color: #1E40AF; border-color: #DBEAFE;">
            {{ data.type }}
          </el-tag>
        </div>
      </div>

      <!-- 内容 -->
      <div class="info-row">
        <div class="label">反馈内容：</div>
        <div class="content">{{ data.content }}</div>
      </div>

      <!-- 图片 -->
      <div v-if="data.images?.length" class="image-list">
        <div class="label">附件图片：</div>
        <div class="images">
          <el-image
            v-for="(img, index) in data.images"
            :key="index"
            :src="img"
            fit="cover"
            style="width: 160px; height: 90px; margin-right: 10px; border-radius: 6px"
            :preview-src-list="data.images"
            :initial-index="index"
          />
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
  <div class="footer-btns">
    <el-button
      v-if="data.status === '未处理'"
      type="warning"
      @click="$emit('markProcessing', data.id)"
    >
      标记为处理中
    </el-button>
    <el-button
      v-else-if="data.status === '处理中'"
      type="success"
      @click="$emit('markResolved', data.id)"
    >
      标记为已处理
    </el-button>
    <el-button @click="visible = false">关闭</el-button>
  </div>
</template>

  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  data: {
    id: string
    username: string
    userId: string
    avatar: string
    time: string
    type: string
    content: string
    status: string
    images: string[]
  }
}>()

const emit = defineEmits(['update:modelValue', 'markResolved', 'markProcessing'])


const visible = ref(props.modelValue)

watch(() => props.modelValue, val => {
  visible.value = val
})
watch(visible, val => {
  emit('update:modelValue', val)
})

const statusType = (status: string) => {
  if (status === '未处理') return 'danger'
  if (status === '处理中') return 'warning'
  if (status === '已处理') return 'success'
  return ''
}
</script>

<style scoped>
.detail-wrapper {
  padding: 10px 0;
  font-size: 14px;
  color: #333;
}
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.user-text {
  margin-left: 12px;
  flex: 1;
}
.username {
  font-weight: bold;
  font-size: 16px;
}
.uid {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}
.status-tag {
  margin-left: auto;
}
.info-row {
  margin-bottom: 20px;
}
.label {
  font-weight: bold;
  margin-right: 5px;
}
.content {
  margin-top: 6px;
  white-space: pre-wrap;
  line-height: 1.6;
}
.image-list {
  margin-top: 10px;
}
.images {
  display: flex;
  margin-top: 8px;
}
.footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
