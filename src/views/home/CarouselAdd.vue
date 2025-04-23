<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBannerStore } from '@/store/bannerStore'
import { useRoute, useRouter } from 'vue-router'

const name = ref('')
const image = ref('')
const product = ref('')
const status = ref(false)
const imageFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)


const bannerStore = useBannerStore()
const route = useRoute()
const router = useRouter()

const isEdit = ref(false)
const bannerId = ref<number | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  if (id) {
    const banner = bannerStore.banners.find(b => b.id === id)
    if (banner) {
      isEdit.value = true
      bannerId.value = id
      name.value = banner.name
      image.value = banner.image
      status.value = banner.status
    }
  }
})


const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    return alert('请上传图片格式文件')
  }

  if (file.size > 2 * 1024 * 1024) {
    return alert('图片大小不能超过 2MB')
  }

  imageFile.value = file
  image.value = URL.createObjectURL(file)
}

const clearImage = () => {
  imageFile.value = null
  image.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}



const resetForm = () => {
  name.value = ''
  image.value = ''
  status.value = false
}

const handleSubmit = async () => {
  if (!name.value || !imageFile.value) {
    console.log(name.value)
    console.log(imageFile.value)
    return alert('请填写完整信息')
  }

  try {
    if (isEdit.value && bannerId.value !== null) {
      // 如果你后面 update 也要改成接口调用的话，这里可以改
      await bannerStore.updateBanner(bannerId.value, {
        name: name.value,
        image: imageFile.value, // 这里也需要是 File 类型
        status: status.value
      })
    } else {
      await bannerStore.addBanner({
        name: name.value,
        image: imageFile.value,
        status: status.value
      })
    }

    router.push('/carousel-manage')
  } catch (err) {
    console.error('提交失败', err)
    alert('提交失败，请重试')
  }
}

</script>

<template>
  <div class="container">
    <div class="header">
      <div style="color: #3176FF;">{{ isEdit ? '更新Banner' : '新增Banner' }}</div>
      <button @click="router.back()" class="back-button">↩ 返回</button>
    </div>

    <div class="form-group">
      <div class="form-item" style="display: flex; align-items: center; ">
        <label style="width: 80px;text-align: right;"> <span class="required">*</span>名称</label>
        <div style="display: flex;margin-left: 15px;">
          <input v-model="name" maxlength="10" placeholder="请填写名称" class="input" style="width: 250px;" />
          <div class="text-counter">{{ name.length }}/10</div>
        </div>
      </div>

      <div class="form-item" style="display: flex;">
        <label style="width: 80px;text-align: right;"><span class="required">*</span>图片 </label>

        <div class="image-uploader">
          <label class="upload-label">
            <input type="file" accept="image/*" @change="handleImageUpload" ref="fileInputRef" hidden />

            <div class="upload-placeholder" v-if="!image">
              <div class="plus-sign">＋</div>
              <div class="upload-info">
                宽度无限制<br />高度无限制<br />文件大小 ≤ 2Mb<br />不允许上传动图
              </div>
            </div>
            <img v-else :src="image" class="preview-image" />
          </label>
        </div>
      </div>

      <div class="form-item" style="display: flex; align-items: center; justify-content: space-between; width: 220px;">
        <label><span class="required">*</span>是否显示</label>
        <div class="switch-row">
          <span :class="{ activeLabel: !status }">隐藏</span>
          <div class="switch-toggle" :class="{ active: status }" @click="status = !status">
            <div class="toggle-handle"></div>
          </div>
          <span :class="{ activeLabel: status }">显示</span>
        </div>
      </div>


      <div class="button-group">
        <button @click="handleSubmit" class="submit-btn">
          {{ isEdit ? '更新' : '保存' }}
        </button>
        <button @click="resetForm" class="reset-btn">重置</button>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: #deeef5 solid 2px;
}

.header h2 {
  font-size: 20px;
  font-weight: bold;
}

.back-button {
  color: #3b82f6;
  text-decoration: none;
  cursor: pointer;
}

.back-button:hover {
  text-decoration: underline;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-item label {
  font-weight: 500;
  color: #374151;
  /* display: block; */
  /* margin-bottom: 4px; */
}

.required {
  color: #ef4444;
  margin-right: 4px;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
  font-size: 14px;
}

.text-counter {
  font-size: 12px;
  color: #9ca3af;
  margin-left: -40px;
  display: flex;
  justify-content: center;
  align-items: center;

}

.image-uploader {
  width: 160px;
  height: 160px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  color: #6B7280;
  cursor: pointer;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  text-align: center;
}

.plus-sign {
  font-size: 32px;
  font-weight: normal;
}

.upload-info {
  font-size: 12px;
  margin-top: 8px;
  line-height: 1.4;
}

.image-path {
  font-size: 13px;
  color: #10b981;
  margin-top: 6px;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.radio-group>span {
  font-weight: 500;
  color: #374151;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.button-group {
  padding-top: 16px;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.reset-btn {
  margin-left: 16px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.reset-btn:hover {
  background-color: #f3f4f6;
}

input[type="radio"]:checked+span {
  font-weight: bold;
}

.upload-label {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.preview-image {
  max-height: 80%;
  max-width: 80%;
  object-fit: contain;
  border-radius: 4px;
}

.clear-btn {
  margin-left: 8px;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover {
  text-decoration: underline;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.activeLabel {
  color: #3b82f6 !important; 
}

.switch-row span {
  font-size: 15px;
  color: #9ca3af; 
  transition: color 0.3s, font-weight 0.3s;
  font-weight: 500;
}



.switch-toggle {
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch-toggle.active {
  background-color: #3b82f6;
}

.toggle-handle {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.3s;
}

.switch-toggle.active .toggle-handle {
  left: 22px;
}

</style>