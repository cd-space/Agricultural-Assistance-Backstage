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
          <img v-if="form.imagePreview" :src="form.imagePreview" class="upload-preview" />
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

    <div v-if="showConfirmModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-close" @click="showConfirmModal = false">×</div>
    <p style="font-size: 16px; font-weight: bold; text-align: center;">是否确认发布？</p>
    <p style="text-align: center;">发布后将不可修改或删除！<br />发布前请务必仔细核对！</p>
    <div style="text-align: center; margin-top: 16px;">
      <label style="font-size: 12px; color: #888;">
        <input type="checkbox" v-model="doNotShowAgain" />
        不再弹出该发布提示
      </label>
    </div>
    <div class="modal-buttons">
      <button @click="showConfirmModal = false">取消</button>
      <button class="primary" @click="confirmPublish">发布</button>
    </div>
  </div>
</div>




  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAnnouncementStore } from '/src/store/announcement'
import { uploadAnnouncementApi } from '@/api/home/announcement'

const route = useRoute()
const router = useRouter()
const announcementStore = useAnnouncementStore()

const form = ref({
  title: '',
  image: '', 
  imagePreview: '', 
  content: ''
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
      form.value = { ...announcement, imagePreview: announcement.image }
    }
  } else {
    const draft = localStorage.getItem('announcementDraft')
    if (draft) {
      const parsed = JSON.parse(draft)
      form.value = { ...parsed, imagePreview: parsed.imagePreview || '' }
    }
  }
})


const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.size <= 20 * 1024 * 1024) {
    form.value.image = file

    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.imagePreview = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    alert('图片大小不能超过20MB')
  }
}


const showConfirmModal = ref(false)
const doNotShowAgain = ref(false)

const publish = () => {
  const skipConfirm = localStorage.getItem('skipPublishConfirm')
  if (skipConfirm === 'true') {
    doPublish()
    return
  }

  showConfirmModal.value = true
}

const doPublish = async () => {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    formData.append('date', new Date().toISOString().slice(0, 16).replace('T', ' '))

    if (form.value.image instanceof File) {
      formData.append('image', form.value.image)
    }
    //  else {
    //   alert('请上传图片')
    //   return
    // }

    await uploadAnnouncementApi(formData)
    // alert('发布成功')
    localStorage.removeItem('announcementDraft')
    router.back()
  } catch (error) {
    console.error('上传失败', error)
    // alert('发布失败，请稍后再试')
  }
}

const confirmPublish = () => {
  if (doNotShowAgain.value) {
    localStorage.setItem('skipPublishConfirm', 'true')
  }
  showConfirmModal.value = false
  doPublish()
}




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


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  position: relative;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.modal-buttons .primary {
  background-color: #1890ff;
  color: white;
}

.modal-buttons button:not(.primary) {
  background-color: #f0f0f0;
  color: #333;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 18px;
  cursor: pointer;
}

</style>