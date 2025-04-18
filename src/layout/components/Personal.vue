<template>
  <el-dialog v-model="visible" width="600px" class="user-edit-dialog" :show-close="false" :close-on-click-modal="false">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>个人中心</span>
        <el-icon style="cursor: pointer;" @click="visible = false">
          <Close />
        </el-icon>
      </div>
    </template>
    <div class="user-edit-wrapper">
      <div class="user-avatar-box">
        <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="user.avatar" :src="user.avatar" class="avatar" />
          <div class="avatar-overlay">
            <el-icon>
              <CameraFilled />
            </el-icon>
          </div>
        </el-upload>
      </div>

      <div class="form-section">
        <div class="form-inner">
          <el-form label-position="top" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="user.name" suffix-icon="Edit" />
            </el-form-item>
            <el-form-item label="用户 ID">
              <el-input v-model="user.id" disabled />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="form-section">
        <h4>修改密码</h4>
        <div class="form-inner">
          <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input v-model="form.currentPassword" show-password suffix-icon="Check" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" show-password suffix-icon="Close" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" show-password />
          </el-form-item>
        </el-form>
        </div>
        <div style="display: flex; justify-content: end;">
          <el-button type="primary" class="submit-btn" @click="submit">确认修改</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { CameraFilled, Edit, Check, Close } from '@element-plus/icons-vue'

const visible = ref(true)

const user = reactive({
  avatar: '/src/assets/logo.png', // 替换为实际图片地址
  name: '陈志远',
  id: 'USER_8675309',
})

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        if (value !== form.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const formRef = ref()

const handleAvatarSuccess = () => {
  // 上传成功逻辑
}

const beforeAvatarUpload = () => {
  // 限制文件类型和大小
}

const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      ElMessage.success('密码修改成功')
    }
  })
}
</script>

<style scoped>
.user-edit-dialog .el-dialog__body {
  padding: 20px 30px;
}

.user-avatar-box {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-section {
  margin-bottom: 20px;
}

.submit-btn{
  margin-right: 85px;
}

.form-inner {
  max-width: 400px;
  margin: 0 auto;
}


</style>
