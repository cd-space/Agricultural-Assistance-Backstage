// stores/userList.ts
import { defineStore } from 'pinia'

export interface UserTag {
  text: string
  color: string
}

export type DemandStatus = '待审核' | '已通过' | '已驳回'

export interface DemandComment {
  commenterId: string
  content: string
  time: string
}

export interface Demand {
  id: string
  title: string
  description: string
  publishTime: string
  status: DemandStatus
  images: string[]
  comments: DemandComment[]
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
  reportCount: number
  freezeCount: number
  // 新增字段
  authRole?: string
  demands?: Demand[]
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
          postCount: 2,
          reportCount: 0,
          freezeCount: 0,
          authRole: '实名认证',
          demands: [
            {
              id: 'd1',
              title: '我想找兼职',
              description: '希望周末能找到家教兼职',
              publishTime: '2024-04-01 10:00',
              status: '已通过',
              images: ['https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', '/src/assets/OIP.jpg'],
              comments: [
                {
                  commenterId: '100233',
                  content: '可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1可以考虑我们机构！1',
                  time: '2024-04-02 08:00'
                },
                {
                  commenterId: '100233',
                  content: '可以考虑我们机构！2',
                  time: '2024-04-02 08:00'
                },
              ]
            },
            {
              id: 'd2',
              title: '我想找兼职2',
              description: '希望周末能找到家教兼职',
              publishTime: '2024-04-01 10:00',
              status: '已通过',
              images: ['https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', '/src/assets/OIP.jpg'],
              comments: [
              ]
            },
            {
              id: 'd2',
              title: '我想找兼职2',
              description: '希望周末能找到家教兼职',
              publishTime: '2024-04-01 10:00',
              status: '已通过',
              images: ['https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', 'https://i.pravatar.cc/100?img=3', '/src/assets/OIP.jpg'],
              comments: [
              ]
            }
          ]
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
          tags: ['诚信'],
          postCount: 2,
          reportCount: 1,
          freezeCount: 1,
          authRole: '农业认证',
          demands: [
            {
              id: 'd2',
              title: '求购化肥',
              description: '需要大量优质复合肥，长期合作',
              publishTime: '2024-03-25 14:30',
              status: '已通过',
              images: ['/images/fertilizer.jpg'],
              comments: []
            },
            {
              id: 'd3',
              title: '农机维修求助',
              description: '收割机坏了，想请人维修',
              publishTime: '2024-03-28 09:00',
              status: '待审核',
              images: ['/images/machine.jpg', '/images/machine2.jpg'],
              comments: [
                {
                  commenterId: '100231',
                  content: '我有认识的维修师傅，可以帮忙联系。',
                  time: '2024-03-28 12:00'
                }
              ]
            }
          ]
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
          freezeCount: 0,
          authRole: '企业认证',
          demands: [
            {
              id: 'd4',
              title: '批量销售土鸡蛋',
              description: '绿色无添加，欢迎联系合作',
              publishTime: '2024-04-05 11:20',
              status: '已通过',
              images: ['/images/eggs1.jpg', '/images/eggs2.jpg'],
              comments: []
            },
            {
              id: 'd5',
              title: '求仓储空间',
              description: '急需临时仓储200平米，位置不限',
              publishTime: '2024-04-02 17:45',
              status: '已驳回',
              images: ['/images/warehouse.jpg'],
              comments: [
                {
                  commenterId: '100232',
                  content: '我有一个小库房可以用！',
                  time: '2024-04-03 08:00'
                }
              ]
            }
          ]
        }
      ]
    
      this.filteredUsers = this.users
    },
    

    searchUser(keyword: string) {
      const lowerKeyword = keyword.toLowerCase()
      this.filteredUsers = this.users.filter(user =>
        user.id.includes(keyword) ||
        user.name.toLowerCase().includes(lowerKeyword) ||
        user.phone.includes(keyword)
      )
    },

    getUserById(userId: string): User | undefined {
      return this.users.find(user => user.id === userId)
    },
    

    filterUsersByRoleOrStatus(role?: string, status?: string) {
      this.filteredUsers = this.users.filter(user => {
        const matchRole = role ? user.role === role : true
        const matchStatus = status ? user.status === status : true
        return matchRole && matchStatus
      })
    },

    resetFilters() {
      this.filteredUsers = this.users
    },

    // 删除某用户的某一个需求
    deleteDemand(userId: string, demandId: string) {
      const user = this.users.find(u => u.id === userId)
      if (user?.demands) {
        user.demands = user.demands.filter(d => d.id !== demandId)
      }
    },

    // 修改某个需求状态为已通过
    approveDemand(userId: string, demandId: string) {
      const user = this.users.find(u => u.id === userId)
      const demand = user?.demands?.find(d => d.id === demandId)
      if (demand) demand.status = '已通过'
    },

    // 修改某个需求状态为已驳回
    rejectDemand(userId: string, demandId: string) {
      const user = this.users.find(u => u.id === userId)
      const demand = user?.demands?.find(d => d.id === demandId)
      if (demand) demand.status = '已驳回'
    },

    // 删除某一条评论
    deleteDemandComment(userId: string, demandId: string, commentIndex: number) {
      const user = this.users.find(u => u.id === userId)
      const demand = user?.demands?.find(d => d.id === demandId)
      if (demand?.comments && commentIndex >= 0 && commentIndex < demand.comments.length) {
        demand.comments.splice(commentIndex, 1)
      }
    },

    // 获取所有用户的需求，按发布时间排序（新到旧）
    getAllDemandsSorted(): (Demand & {
      publisherId: string
      publisherName: string
      publisherPhone: string
      publisherAvatar?: string
    })[] {
      const allDemands = this.users
        .flatMap(user => {
          return (user.demands || []).map(demand => ({
            ...demand,
            publisherId: user.id,
            publisherName: user.name,
            publisherPhone: user.phone,
            publisherAvatar: user.avatar,
            publisherauthRole: user.authRole
          }))
        })
        .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
    
      return allDemands
    }
    
  }
})
