<template>
  <el-dialog
    v-model="visible"
    width="800px"
    class="custom-dialog"
    :close-on-click-modal="false"
    :show-close="false" 
    append-to-body
  >
    <template #header>
      <div class="dialog-header">
        <span class="title">需求列表</span>
        <div @click="handleClose" class="close-btn">×</div>
      </div>
    </template>
    <div style="width: 100%; border-bottom: 1px solid #D1D5DB; margin-bottom: 15px;"></div>

    <el-table :data="demands" style="width: 100%" class="custom-table"
    max-height="600">
  <el-table-column label="需求标题" prop="title" />
  <el-table-column label="发布时间" prop="publishTime" width="180" />
  <el-table-column label="状态" width="100">
    <template #default="scope">
      <el-tag v-if="scope.row.status === '待审核'" type="warning">待审核</el-tag>
      <el-tag v-else-if="scope.row.status === '已通过'" type="success">已通过</el-tag>
      <el-tag v-else type="danger">已驳回</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="操作" width="120">
    <template #default="scope">
      <el-button @click="viewDetail(scope.row)"  type="primary" size="small">
        <img src="/src/assets/eye.png" alt="" style="width: 15.5px; height: 12px; margin: 1px 4px 0 0;">
        查看详情
      </el-button>
    </template>
  </el-table-column>
</el-table>

  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits,onMounted} from 'vue'
import { getUserDemandsApi } from '@/api/usersManage'
import { defineExpose } from 'vue'

const props = defineProps<{
  modelValue: boolean
  userid: string
}>()

const emits = defineEmits(['update:modelValue', 'view-detail']);

const demands = ref([])

const visible = ref(props.modelValue)
const selectedDemand = ref({})



watch(() => props.modelValue, (val) => {
  visible.value = val
})

const handleClose = () => {
  visible.value = false
  emits('update:modelValue', false)
}

// 点击“查看详情”按钮时触发
const viewDetail = (demand: any) => {
  // showdemend(demand.id)
  selectedDemand.value = {
    id:demand.id,
    publisherId: props.userid,

  }
  emits('view-detail', selectedDemand.value)
};

const refresh = async () => {
  try {
    const res = await getUserDemandsApi(props.userid);
    demands.value = res.data;
    console.table(res.data);
  } catch (error) {
    console.error('Failed to fetch demands:', error);
  }
};





watch(() => props.userid, (newUserid) => {
  console.log(newUserid)
  if (newUserid) {
    getUserDemandsApi(newUserid).then((res) => {
      demands.value = res.data;
    }).catch((error) => {
      console.error('Failed to fetch demands:', error);
    });
  }
});
onMounted(() => {
  getUserDemandsApi(props.userid).then((res) => {
    demands.value = res.data;
  }).catch((error) => {
    console.error('Failed to fetch demands:', error);
  });
});
defineExpose({
  refresh
})
</script>

<style scoped>
.custom-dialog {
  border-radius: 12px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  padding: 0 10px;
}

.close-btn {
  cursor: pointer;
  font-size: 22px;
  line-height: 22px;
}

:deep(.el-tag) {
  transition: none !important;
  animation: none !important;
}
.custom-table ::v-deep(.el-table__row td) {
  padding-top: 16px ;
  padding-bottom: 16px;
}

</style>
