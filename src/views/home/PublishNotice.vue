<template>
  <div class="card">
    <div class="announcement-header">
      <img src="/src/assets/back.png" alt="back" @click="goBack"class="back-arrow">
      <h2>{{ isViewMode ? '查看公告' : '发布公告' }}</h2>
    </div>
    <div style="width: 100%; border-bottom: 1px solid #D1D5DB;"></div>

    <div class="form-item">
      <label style="font-size: 14px;">公告标题</label>
      <input v-model="form.title" :disabled="isViewMode" placeholder="请输入公告标题"
      style="border: 1px solid #D1D5DB;border-radius: 8px; width: 100%;padding: 8px 16px;" />
    </div>

    <div class="form-item">
      <label style="font-size: 14px;">封面图片</label>
      <div class="upload-wrapper" v-if="!isViewMode">
        <div class="upload-box">
          <input type="file" @change="onFileChange" />
          <img v-if="!form.image" src="/src/assets/upload.svg" class="upload-preview" />
          <div class="upload-tip" v-if="!form.image">点击或拖拽上传</div>
          <img v-if="form.image" :src="form.image" class="upload-preview" />
        </div>
        <div class="upload-info">
          支持格式：PNG、JPG、JPEG<br />建议尺寸：1200x600px<br />大小限制：20MB以内
        </div>
      </div>
      <img v-if="form.image && isViewMode" :src="form.image" class="preview-image" />
    </div>

    <div class="form-item">
      <label style="font-size: 14px;">公告内容</label>
      <textarea v-model="form.content" :disabled="isViewMode" placeholder="请输入公告内容..."></textarea>
    </div>

    <div v-if="!isViewMode" class="footer-buttons">
      <button class="primary" @click="publish">发布公告</button>
      <button @click="saveDraft">保存草稿</button>
    </div>
  </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnnouncementStore } from '/src/store/announcement'

const route = useRoute()
const router = useRouter()
const announcementStore = useAnnouncementStore()

const form = ref({
  title: '',
  image: '',
  content: '',
})

const isViewMode = computed(() => !!route.params.id)

const goBack = () => {
  router.back()
}

onMounted(() => {
  const id = Number(route.params.id)
  if (isViewMode.value && id) {
    const announcement = announcementStore.announcements.find(a => a.id === id)
    if (announcement) {
      form.value = { ...announcement }
    }
  } else {
    const draft = localStorage.getItem('announcementDraft')
    if (draft) {
      form.value = JSON.parse(draft)
    }
  }
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.size <= 20 * 1024 * 1024) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    alert('图片大小不能超过20MB')
  }
}


const publish = () => {
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ')
  announcementStore.addAnnouncement({ ...form.value, date })
  localStorage.removeItem('announcementDraft')
  alert('公告发布成功！')
}

// 


const saveDraft = () => {
  localStorage.setItem('announcementDraft', JSON.stringify(form.value))
  alert('草稿已保存')
}
</script>

<style scoped>
.card{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}

.announcement-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.back-arrow {
  width: 20px;
  height: 20px;
  margin-right: 25px;
  cursor: pointer;
}

.form-item {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  resize: none;
  outline: none;
}

textarea:focus {
  border: 1px solid #d9d9d9;
  box-shadow: none;
}

.upload-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
}

.upload-box {
  width: 192px;
  height: 128px;
  border: 1px dashed #d9d9d9;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload-box input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.upload-tip {
  text-align: center;
  color: #999;
  font-size: 14px;
}
.upload-info {
  font-size: 12px;
  color: #999;
}
.upload-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.preview-image {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 6px;
}
.footer-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 20px;
}
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
button.primary {
  background-color: #1890ff;
  color: white;
}
button:not(.primary) {
  background-color: #f0f0f0;
  color: #333;
}


</style>