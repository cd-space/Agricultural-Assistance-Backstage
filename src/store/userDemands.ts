// stores/userDemands.ts
import { defineStore } from 'pinia';
import { getUserDemandsApi } from '@/api/usersManage';

export interface Demand {
  id: string;
  title: string;
  description: string;
  publishTime: string;
  status: "待审核" | "已通过" | "已驳回";
}

interface State {
  demands: Demand[];
}

export const useUserDemandsStore = defineStore('userDemands', {
  state: (): State => ({
    demands: [],
  }),
  actions: {
    async fetchUserDemands(userId: string) {
      // const res = await getUserDemandsApi(userId);
      // this.demands = res.data;
    },
  },
});
