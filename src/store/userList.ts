// stores/userList.ts
import { defineStore } from 'pinia';
import { getUserListApi } from '@/api/usersManage';

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
      // console.log(res)
      this.users = res.data;
      this.filteredUsers = res.data;
    },
    searchUser(keyword: string) {
      const lowerKeyword = keyword.toLowerCase();
      this.filteredUsers = this.users.filter(
        user =>  user.id.includes(keyword) || user.name.toLowerCase().includes(lowerKeyword) || user.phone.includes(keyword)
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
  },
});
