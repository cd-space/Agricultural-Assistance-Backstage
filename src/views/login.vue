<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import store from "@/store";
import { login } from "@/api/common";
import { openNextPage } from "@/router/permission";
import { modifyData } from "@/utils";
import { message } from "@/utils/message";
import { generateCaptchaApi } from '@/api/login/index'



const cacheName = "login-info";
const tipList = ["admin"];
const info = store.projectInfo;

/** 表单数据 */
const formData = reactive({
  username: "",
  password: "",
  code_id: "", // 验证码ID
  answer: ""  // 添加验证码字段
});

const loading = ref(false);
// 验证码相关
const captchaImg = ref("");
const captchaAnswer = ref("");
const captchaId = ref("");
/** 获取验证码 */
async function fetchCaptcha() {
  try {
    const res = await generateCaptchaApi();
    captchaImg.value = res.b64s;
    captchaAnswer.value = res.answer;
    captchaId.value = res.id;
    formData.code_id = res.id; // 更新表单数据中的验证码ID
  } catch (err) {
    message.error("验证码获取失败");
    console.error(err);
  }
}



/** 
 * 点击登录 
 * @param adopt 是否不校验直接通过
 */
 function onLogin(adopt: boolean) {
  if (loading.value) return; // 防止重复提交

  if (!adopt) {
    if (!formData.username.trim()) return message.error("请输入账号");
    if (!formData.password.trim()) return message.error("请输入密码");
    if (!formData.answer.trim()) return message.error("请输入验证码");
    if (formData.answer.trim() !== captchaAnswer.value) {
      message.error("验证码错误");
      fetchCaptcha(); // 刷新验证码
      return;
    }
  }

  loginProcess();
}



async function loginProcess() {
  loading.value = true;
  try {
    const res = await login(formData);
    console.log(res)
    if (res.code === 1) {
      saveLoginInfo();
      openNextPage(); // 跳转
    } else {
      message.error(res.msg || "登录失败");
      fetchCaptcha(); // 登录失败也刷新验证码
    }
  } catch (err) {
    console.error(err);
    message.error("登录异常");
  } finally {
    loading.value = false;
  }
}







//  function onLogin(adopt: boolean) {
//   async function start() {
//     loading.value = true;

//     if (formData.captcha.trim() !== captchaAnswer.value) {
//       message.error("验证码错误");
//       loading.value = false;
//       fetchCaptcha(); // 验证码错误时刷新
//       return;
//     }

//     const res = await login(formData);
//     loading.value = false;
//     if (res.code === 1) {
//       saveLoginInfo();
//       openNextPage();
//     } else {
//       message.error(res.msg);
//       fetchCaptcha(); // 登录失败也刷新验证码
//     }
//   }

//   if (adopt) return start();

//   if (!formData.account) return message.error("请输入账号");
//   if (!formData.password) return message.error("请输入密码");
//   if (!formData.captcha) return message.error("请输入验证码");

//   start();
// }

/** 是否记住密码 */
const remember = ref(false);

function saveLoginInfo() {
  if (remember.value) {
    localStorage.setItem(cacheName, JSON.stringify({ remember: true, ...formData }));
  } else {
    localStorage.removeItem(cacheName);
  }
}

function getLoginInfo() {
  const value = localStorage.getItem(cacheName);
  if (value) {
    try {
      const info = JSON.parse(value);
      remember.value = !!info.remember;
      modifyData(formData, info);
    } catch (error) {
      console.warn(error);
    }
  }
}

getLoginInfo();
onMounted(() => {
  fetchCaptcha();
});
</script>

<template>
  <div class="login-page">
    <div class="content">
      <div class="form-box">
        <div class="login-form">
          <img src="/src/assets/logo.png" alt="" style="width: 120px; height: 120px; margin: 0 auto; display: block; ">
          <div class="login-title">{{ info.name }}</div>
          <input class="the-input mb-[20px]" type="text" v-model="formData.username" placeholder="请输入账号">
          <input class="the-input mb-[20px]" type="password" v-model="formData.password" placeholder="请输入密码">


          <div class="f-horizontal mb-[20px]" style="align-items: center; display: flex;">
            <input class="the-input f1" type="text" v-model="formData.answer" placeholder="请输入验证码" />
            <img :src="captchaImg" alt="验证码"
              style="width: 100px; height: 40px; margin-left: 10px; cursor: pointer; border-radius: 4px;"
              @click="fetchCaptcha" />
          </div>

          <button class="the-btn blue mb-[20px]" v-ripple style="width: 100%" @click="onLogin(false)"
            :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.login-page {
  width: 100%;
  min-height: 100vh;
  background-color: #2253dc;
  background-image: linear-gradient(45deg, #2253dc 0%, #4fb8f9 99%);
  position: relative;
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../assets/admin-login-bg.jpg");
    background-size: cover;
    background-position: center center;
    z-index: 2;
  }
  .content {
    position: absolute;
    z-index: 3;
    top: 50%;
    margin-top: -302px;
    right: 10%;
    width: 100%;
    max-width: 480px;
    .form-box {
      padding: 10px;
      width: 100%;
      margin-bottom: 40px;
      .login-form {
        background-color: #fff;
        border-radius: 10px;
        padding: 40px 40px 30px;
        box-shadow: 0px 8px 10px -6px rgba(0, 0, 0, 0.1),0px 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
      .login-title {
        font-size: 22px;
        line-height: 22px;
        color: var(--blue);
        margin-bottom: 30px;
        text-align: center;
      }
      .el-checkbox {
        color: #999;
      }
    }
    .title {
      text-align: center;
      font-size: 28px;
      color: #fff;
      margin-bottom: 24px;
      text-shadow: 4px 4px 4px #333;
      font-family: "宋体";
    }
    .bottom-text {
      width: 100%;
      max-width: 500px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      line-height: 22px;
      margin: 0 auto;
      text-align: center;
    }
  }
  .tips {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    .tips_text {
      margin: 0 16px;
    }
  }
}
@media screen and (max-width: 500px) {
  .login-page {
    .content {
      right: 0;
    }
  }
}
</style>
