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
      <!-- <div class="user-avatar-box">
        <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="user.avatar" :src="user.avatar" class="avatar" />
          <div class="avatar-overlay">
            <el-icon>
              <CameraFilled />
            </el-icon>
          </div>
        </el-upload>
      </div> -->

      <div class="form-section">
        <div class="form-inner">
          <el-form label-position="top" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.account" suffix-icon="Edit"  disabled/>
            </el-form-item>
            <!-- <el-form-item label="用户 ID">
              <el-input v-model="user.id" disabled />
            </el-form-item> -->
          </el-form>
        </div>
      </div>

      <div class="form-section">
        <h4>修改密码</h4>
        <div class="form-inner">
          <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="当前密码" prop="password">
            <el-input v-model="form.password" show-password suffix-icon="Check" />
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input v-model="form.new_password" show-password suffix-icon="Close" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="renew_password">
            <el-input v-model="form.renew_password" show-password />
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
import { changePassword } from '@/api/login/index'
import { useLayoutRoute } from "./hooks";


import store from "@/store";
const userInfo = store.user.info;


const { router } = useLayoutRoute();
const visible = ref(true)

const form = reactive({
  username: userInfo.account,
  password: '',
  new_password: '',
  renew_password: '',
})

const rules = {
  password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  new_password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  renew_password: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      // validator(rule, value, callback) {
      //   if (value !== form.new_password) {
      //     callback(new Error('两次输入密码不一致'));
      //   } else {
      //     callback();
      //   }
      // },
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

function onLogout() {
  store.user.reset();
  router.push("/login").then(() => {
    layoutInfo.tagList = [];
    removeRoutes();
  });
}


const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    if (form.new_password !== form.renew_password) {
      ElMessage.error("两次输入的新密码不一致");
      return;
    }

    try {
      await changePassword({
        username: form.username,
        password: form.password,
        new_password: form.new_password,
        renew_password: form.renew_password
      });

      ElMessage.success("密码修改成功");
      visible.value = false;
      onLogout()
    } catch (err) {
      ElMessage.error("密码修改失败，请检查原密码是否正确");
      console.error(err);
    }
  });
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
