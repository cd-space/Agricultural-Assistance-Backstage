// stores/demandDetail.ts
import { defineStore } from 'pinia';
import { getUserDemandDetailApi } from '@/api/usersManage';

export interface DemandComment {
  commenterId: string;
  content: string;
  time: string;
}

export interface DemandDetail {
  id: string;
  title: string;
  description: string;
  publishTime: string;
  status: string;
  images: string[];
  comments: DemandComment[] | null;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface State {
  demandDetail: DemandDetail | null;
}

export const useDemandDetailStore = defineStore('demandDetail', {
  state: (): State => ({
    demandDetail: null,
  }),
  actions: {
    async fetchDemandDetail(userId: string, demandId: string) {
      // const res = await getUserDemandDetailApi(userId, demandId);
      // this.demandDetail = res.data;
    },
  },
});
