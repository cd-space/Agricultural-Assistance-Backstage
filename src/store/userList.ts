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
  tags: UserTag[]
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
    setUsers(userList: User[]) {
      this.users = userList
      this.filteredUsers = userList
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
