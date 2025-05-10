// stores/userDetail.ts
import { defineStore } from 'pinia';
import { getUserDetailApi,addUserTagApi,deleteUserTagApi } from '@/api/usersManage';

interface UserDetail {
  id: string;
  uuid: string
  avatar: string;
  name: string;
  gender: string
  birthday: string;
  role: string;
  phone: string;
  registerTime: string;
  lastLoginTime: string;
  warningCount: number;
  status: string
  tags: Array<any>;
  postCount: number;
  reportCount: number;
  freezeCount: number;
  freezeTime?: string;
  authRole?: string;
}

interface State {
  userDetail: UserDetail | null;
}

export const useUserDetailStore = defineStore('userDetail', {
  state: (): State => ({
    userDetail: null,
  }),
  actions: {
    async fetchUserDetail(id: string) {
      const res = await getUserDetailApi(id);
      this.userDetail = res.data;
      // console.log(this.userDetail)

    },

    async addUserTag(tagContent: string) {
      if (!this.userDetail) return
      const userId = this.userDetail.uuid
      await addUserTagApi(userId, tagContent)
      
    },

    async deleteUserTag(tagId: string) {
      if (!this.userDetail) return
      const userId = this.userDetail.uuid
      await deleteUserTagApi(userId, tagId)
      this.userDetail.tags = this.userDetail.tags.filter(tag => tag.id !== tagId)
    }
    
  },
});
