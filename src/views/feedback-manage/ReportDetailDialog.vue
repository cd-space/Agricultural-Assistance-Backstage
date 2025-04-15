<template>
  <el-dialog :visible.sync="isVisible" width="60%" :title="`举报详情 - ${report.id}`">
    <div v-if="report">
      <el-row>
        <el-col :span="8">
          <el-avatar :src="report.reporterAvatar" size="large" />
          <div class="user-info">
            <div>举报人: {{ report.reporterName }}</div>
            <div>ID: {{ report.reporterId }}</div>
            <div>注册时间: {{ report.reporterRegisterTime }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="report-details">
            <div>举报类型: {{ report.type }}</div>
            <div>举报时间: {{ report.time }}</div>
            <div>状态: <el-tag :type="statusTagType(report.status)">{{ report.status }}</el-tag></div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-avatar :src="report.reportedAvatar" size="large" />
          <div class="user-info">
            <div>被举报人: {{ report.reportedName }}</div>
            <div>ID: {{ report.reportedId }}</div>
            <div>注册时间: {{ report.reportedRegisterTime }}</div>
          </div>
        </el-col>
      </el-row>

      <el-divider></el-divider>

      <div v-if="report.images.length">
        <div>举报截图:</div>
        <el-image v-for="(img, index) in report.images" :key="index" :src="img" fit="contain" style="max-width: 100%; margin: 10px 0;" />
      </div>

      <div v-if="report.source.length">
        <div>举报来源:</div>
        <ul>
          <li v-for="(source, index) in report.source" :key="index">{{ source }}</li>
        </ul>
      </div>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeModal">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { ElDialog, ElButton, ElRow, ElCol, ElAvatar, ElTag, ElImage, ElDivider } from 'element-plus'

// 定义从父组件传递的 prop
const props = defineProps({
  report: Object,
  isVisible: Boolean,
})

// 本地状态，控制弹窗显示与否
const closeModal = () => {
  props.isVisible = false
}

// 标签类型判断函数
const statusTagType = (status: string) => {
  switch (status) {
    case '待处理': return 'danger'
    case '已处理': return 'success'
    case '已忽略': return 'info'
    default: return ''
  }
}
</script>

<style scoped>
.user-info {
  margin-top: 10px;
  font-size: 14px;
}
.report-details {
  margin-top: 10px;
}
.dialog-footer {
  text-align: right;
}
</style>
