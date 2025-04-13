<template>
  <div v-if="visible" class="dialog-backdrop">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>{{ isEdit ? '导师信息' : '新增导师' }}</h3>
        <span class="apply-count" v-if="isEdit">被申请次数：{{ mentor?.applyCount ?? 0 }} 次</span>
        <button class="close-btn" @click="emit('update:visible', false)">×</button>
      </div>
      <div style="width: 100%; border-bottom: 1px solid #D1D5DB; margin-bottom: 25px;"></div>

      <div class="dialog-body">
        <el-form :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入导师姓名" maxlength="20" />
          </el-form-item>

          <el-form-item label="手机号码">
            <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11"  />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱地址" />
          </el-form-item>

          <el-form-item label="导师标签">
            <div style="display: flex; gap: 10px">
              <el-input v-model="newTag" placeholder="请输入标签  (最多三个)" @keyup.enter.native="addTag" maxlength="10"  />
              <el-button @click="addTag" type="primary">添加</el-button>
            </div>
            <div style="margin-top : 10px ;gap: 10px; display: flex; flex-wrap: wrap ">
              <el-tag
                v-for="(tag, index) in form.tags"
                :key="index"
                closable
                @close="removeTag(index)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-form-item>

          <el-form-item label="头像">
            <div class="upload-box" @click="triggerFileInput">
              <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleUpload" />

              <img v-if="form.avatar" :src="form.avatar" class="avatar-preview" />
              <div v-else class="upload-placeholder">点击或拖拽图片上传<br>支持 jpg、png 格式</div>
            </div>
          </el-form-item>

          <el-form-item label="简介">
            <el-input v-model="form.intro" type="textarea" placeholder="请输入导师简介" />
          </el-form-item>
        </el-form>
      </div>

      <div class="dialog-footer">
        <el-button @click="emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="onConfirm" >{{ isEdit ? '保存修改' : '确认添加' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useMentorListStore } from '@/store/supervisorStore'
import type { Mentor } from '@/store/supervisorStore'


const props = defineProps<{
  visible: boolean
  mentorId?: string
}>()
const emit = defineEmits(['update:visible'])

const mentorStore = useMentorListStore()

const isEdit = computed(() => !!props.mentorId)
const mentor = computed(() =>
  props.mentorId ? mentorStore.mentors.find(m => m.id === props.mentorId) : undefined
)

const form = reactive<Mentor>({
  id: '',
  name: '',
  phone: '',
  email: '',
  avatar: '',
  intro: '',
  tags: [],
  applyCount: 0,
  isFeatured: false
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (isEdit.value && mentor.value) {
        Object.assign(form, { ...mentor.value })
      } else {
        Object.assign(form, {
          id: Date.now().toString(),
          name: '',
          phone: '',
          email: '',
          avatar: '',
          intro: '',
          tags: [],
          applyCount: 0,
          isFeatured: false
        })
      }
    }
  },
  { immediate: true }
)

const fileInput = ref<HTMLInputElement>()
const triggerFileInput = () => fileInput.value?.click()

const handleUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.avatar = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const newTag = ref('')
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && form.tags.length < 3 && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  newTag.value = ''
}
const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

const onConfirm = () => {
  if (isEdit.value) {
    mentorStore.updateMentor({ ...form })
  } else {
    mentorStore.addMentor({ ...form })
  }
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  position: relative;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.apply-count {
  margin-right: 50px;
  color: #666;
  font-size: 14px;

}

.close-btn {
  position: absolute;
  top: 13px;
  right: 20px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.upload-box {
  width: 160px;
  height: 160px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  text-align: center;
  color: #999;
  font-size: 14px;
  line-height: 20px;
  user-select: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 10px;
}
:deep(.el-textarea__inner) {
  padding: 12px 10px; 

}

</style>
