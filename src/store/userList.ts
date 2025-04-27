// stores/userList.ts
import { defineStore } from 'pinia';
import { getUserListApi,freezeAccountApi,unfreezeAccountApi } from '@/api/usersManage';

interface UserList {
  id: string;
  uuid: string
  avatar: string;
  name: string;
  phone: string;
  role: string;
  status: string;
  warningCount: number;
  registerTime: string
  lastLoginTime: string
}

interface State {
  users: UserList[];
  filteredUsers: UserList[];
}

export const useUserListStore = defineStore('userList', {
  state: (): State => ({
    users: [],
    filteredUsers: [],
  }),

  actions: {
    async fetchUserList() {
      const res = await getUserListApi();
      this.users = res.data;
      this.filteredUsers = res.data;
    },

    searchUser(keyword: string) {
      const lowerKeyword = keyword.toLowerCase();
      this.filteredUsers = this.users.filter(
        user =>
          user.id.includes(keyword) ||
          user.name.toLowerCase().includes(lowerKeyword) ||
          user.phone.includes(keyword)
      );
    },

    filterUsersByRoleOrStatus(role?: string, status?: string) {
      this.filteredUsers = this.users.filter(user => {
        const matchRole = role ? user.role === role : true;
        const matchStatus = status ? user.status === status : true;
        return matchRole && matchStatus;
      });
    },

    resetFilters() {
      this.filteredUsers = this.users;
    },

    // 冻结账号
    async freezeUser(userId: string,role?: string, status?: string) {
      try {
        await freezeAccountApi(userId);
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = '已冻结';
        }
        this.filterUsersByRoleOrStatus(role, status);
      } catch (error) {
        console.error('冻结账号失败', error);
      }
    },

    // 解冻账号
    async unfreezeUser(userId: string,role?: string, status?: string) {
      try {
        await unfreezeAccountApi(userId);
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = '正常';
        }
        this.filterUsersByRoleOrStatus(role, status);
      } catch (error) {
        console.error('解冻账号失败', error);
      }
    },
  },
});
