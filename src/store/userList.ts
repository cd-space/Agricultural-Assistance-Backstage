// stores/userList.ts
import { defineStore } from 'pinia'

export interface UserTag {
  text: string
  color: string
}

export interface User {
  id: string
  avatar: string
  name: string
  gender: '男' | '女' | '未知'
  birthday: string
  role: string
  phone: string
  registerTime: string
  lastLoginTime: string
  warningCount: number
  status: '正常' | '已冻结' | '注销'
  tags: Array<any>
  postCount: number
  //被举报次数
  reportCount: number
  freezeCount: number
}

interface State {
  users: User[]
  filteredUsers: User[]
}

export const useUserListStore = defineStore('userList', {
  state: (): State => ({
    users: [],
    filteredUsers: []
  }),

  actions: {
    setUsers(userList?: User[]) {
      this.users = [
        {
          id: '100231',
          avatar: '/src/assets/logo.png',
          name: '赵雅芝',
          gender: '女',
          birthday: '1990-01-01',
          role: '大学生',
          phone: '13812345678',
          registerTime: '2023-06-15',
          lastLoginTime: '2024-01-15 15:30',
          warningCount: 1,
          status: '正常',
          tags: ['活跃', 'VIP'],
          postCount: 5,
          reportCount: 0,
          freezeCount: 0
        },
        {
          id: '100232',
          avatar: '',
          name: '刘德华',
          gender: '男',
          birthday: '1985-03-20',
          role: '农户',
          phone: '15912341234',
          registerTime: '2023-08-20',
          lastLoginTime: '2024-01-14 09:15',
          warningCount: 3,
          status: '已冻结',
          tags: [],
          postCount: 2,
          reportCount: 1,
          freezeCount: 1
        },
        {
          id: '100233',
          avatar: '',
          name: '林玉玲',
          gender: '女',
          birthday: '1992-12-12',
          role: '商家',
          phone: '13612349012',
          registerTime: '2023-09-01',
          lastLoginTime: '2024-01-13 18:45',
          warningCount: 0,
          status: '正常',
          tags: [],
          postCount: 3,
          reportCount: 0,
          freezeCount: 0
        }
      ]
      this.filteredUsers = this.users


      // this.users = userList
      // this.filteredUsers = userList
    },

    // 1. 通过 id / 名字 / 手机号 搜索
    searchUser(keyword: string) {
      const lowerKeyword = keyword.toLowerCase()
      this.filteredUsers = this.users.filter(user =>
        user.id.includes(keyword) ||
        user.name.toLowerCase().includes(lowerKeyword) ||
        user.phone.includes(keyword)
      )
    },

    // 2. 通过角色 或 账号状态 筛选
    filterUsersByRoleOrStatus(role?: string, status?: string) {
      this.filteredUsers = this.users.filter(user => {
        const matchRole = role ? user.role === role : true
        const matchStatus = status ? user.status === status : true
        return matchRole && matchStatus
      })
    },

    // 重置筛选
    resetFilters() {
      this.filteredUsers = this.users
    }
  }
})
