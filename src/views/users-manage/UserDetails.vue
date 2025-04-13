<template>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
      <h2 class="title">{{ user.name }}</h2>
      <div @click="goBack" style="cursor: pointer;" >×</div>
    </div>
    
    <div style="border-bottom: 1px solid #E5E7EB;"></div>


    <div class="info-section">
      <img :src="user.avatar" alt="avatar" class="avatar" />
      <div class="info-grid">
        <div>性别：{{ user.gender }}</div>
        <div>账号状态：{{ user.status }}</div>
        <div>生日：{{ user.birthday }}</div>
        <div>警告次数：{{ user.warningCount }} 次</div>
        <div>手机号：{{ user.phone }}</div>
        <div>最后登录：{{ user.lastLoginTime }}</div>
        <div>账号角色：{{ user.role }}</div>
        <div>注册时间：{{ user.registerTime }}</div>
      </div>
    </div>

    <div class="tags-section">
      <div class="tags-title">用户标签</div>
      <div class="tag-list">
        <div class="tag" v-for="tag in user.tags" :key="tag">
          {{ tag }}
          <span class="tag-close" @click="removeTag(tag)">×</span>
        </div>
        <button class="add-tag-btn" @click="showTagInput = true">+ 添加标签</button>
      </div>

      <div v-if="showTagInput" class="tag-input-wrapper">
        <input v-model="newTag" class="tag-input" type="text" placeholder="请输入标签名" @keyup.enter="confirmAddTag" />
        <button class="confirm-btn" @click="confirmAddTag">确认</button>
        <button class="cancel-btn" @click="cancelAddTag">取消</button>
      </div>
    </div>
    <!-- TODO:需求列表 -->



    <div class="stats-section">
      <div class="tags-title">统计数据</div>
      <div class="stat-item">
        <div class="class1"> <img src="../../assets/write.png" alt="write" style="width: 16px; height: 16px;" />
          发帖数
        </div>
        <div class="class2">{{ user.postCount }}篇 > </div>
      </div>
      <div class="tags-title">举报与处罚记录</div>
      <div class="stat-item">
        <div class="class1"> <img src="../../assets/flag.png" alt="write" style="width: 14px; height: 16px;" />
          被举报记录
        </div>
        {{ user.reportCount }} 次
      </div>
      <div class="stat-item">
        <div class="class1"> <img src="../../assets/ban.png" alt="write" style="width: 14px; height: 16px;" />
          账号冻结历史
        </div>
        {{ user.freezeCount }} 次
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserListStore } from '@/store/userList'
import router from '@/router'


const route = useRoute()
const store = useUserListStore()
store.setUsers()
const user = ref<any>({})
  const showTagInput = ref(false)
  const newTag = ref('')

  const removeTag = (tag: string) => {
    const user = ref<{ tags: string[]; [key: string]: any }>({
  tags: [],
});
}


const confirmAddTag = () => {
  const trimmed = newTag.value.trim()
  if (trimmed && !user.value.tags.includes(trimmed)) {
    user.value.tags.push(trimmed)
  }
  newTag.value = ''
  showTagInput.value = false
}

const cancelAddTag = () => {
  newTag.value = ''
  showTagInput.value = false
}

const goBack= () => {
  router.back()
}


onMounted(() => {
  const userId = route.params.id as string
  store.searchUser(userId)
  if (store.filteredUsers.length) {
    user.value = store.filteredUsers[0]
  }
})
</script>

<style scoped>
.card {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
}

.avatar{
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 20px;
}
.user-detail {
  padding: 30px;
  background-color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  line-height: 20px;
}

.info-section {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
  margin-top: 30px;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 12px;

  column-gap: 60px;
}

.tags-section {
  margin-bottom: 30px;
}

.tag-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.stats-section {
  padding-top: 20px;
}

.stat-item {
  background-color: #F9FAFB;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 8px;
  color:#9CA3AF
}

.tags-title {
  font-size: 16px;
  margin-bottom: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tag {
  background-color: #DBEAFE;
  padding: 5px 15px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #1E40AF;
  cursor: default;
}

.tag-close {
  margin-left: 6px;
  cursor: pointer;
  font-weight: bold;
}

.add-tag-btn {
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #409eff;
  background-color: #fff;
  color: #409eff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-tag-btn:hover {
  background-color: #ecf5ff;
}

.tag-input-wrapper {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.tag-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.confirm-btn,
.cancel-btn {
  padding: 6px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  background-color: #409eff;
  color: #fff;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.class1 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
}

.class2:hover {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}
</style>
