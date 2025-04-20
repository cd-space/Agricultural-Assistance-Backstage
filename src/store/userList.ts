// stores/userList.ts
import { defineStore } from "pinia";
import { getUserListApi,getUserDetailApi } from '@/api/usersManage/index'


export interface DemandComment {
  commenterId: string;
  content: string;
  time: string;
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  publishTime: string;
  status: "待审核" | "已通过" | "已驳回";
  images: string[];
  comments: DemandComment[];
}

export interface User {
  id: string;
  avatar: string;
  name: string;
  gender: "男" | "女" | "未知";
  birthday: string;
  role: string;
  phone: string;
  registerTime: string;
  lastLoginTime: string;
  warningCount: number;
  status: "正常" | "已冻结" | "注销";
  tags: Array<any>;
  postCount: number;
  reportCount: number;
  freezeCount: number;
  freezeTime?: string;
  authRole?: string;
  demands?: Demand[];
}

interface State {
  users: User[];
  filteredUsers: User[];
}

export const useUserListStore = defineStore("userList", {
  state: (): State => ({
    users: [],
    filteredUsers: [],
  }),

  actions: {
    async fetchUsers() {
      try {
        // 第一步：获取用户基础列表（包含 id）
        const listRes = await getUserListApi()
        const basicList = listRes.data
    
        // 第二步：并发请求每个用户的详情
        const detailPromises = basicList.map(user => getUserDetailApi(String(user.id)))
        const detailResponses = await Promise.all(detailPromises)
    
        // 第三步：整合用户信息，转换成你 store 中的 User 类型
        this.users = detailResponses.map((res, index) => {
          const detail = res.data
          const basic = basicList[index]
    
          const user: User = {
            id: String(basic.id),
            avatar: detail.avatar,
            name: detail.name,
            gender: detail.gender,
            birthday: detail.birthday,
            role: detail.role,
            phone: detail.phone,
            registerTime: detail.registerTime,
            lastLoginTime: detail.lastLoginTime,
            warningCount: detail.warningCount,
            status: detail.status,
            tags: [], // 默认空数组，或根据实际情况填充
            postCount: detail.postCount,
            reportCount: detail.reportCount,
            freezeCount: detail.freezeCount,
            freezeTime: '', // 根据需求填充
            authRole: '',   // 根据需求填充
            demands: []     // 根据需求填充
          }
    
          return user
        })
    
        // 同步 filteredUsers
        this.filteredUsers = this.users
      } catch (err) {
        console.error('获取用户数据失败：', err)
      }
    },
    
    // async fetchUsers() {
    //   fetch('https://argi.liteyuki.icu/console/account/1', {
    //     method: 'GET',
    //     headers: {
    //       Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU0NzAzNzksImlhdCI6MTc0NDg2NTU3OSwidXNlcl9pZCI6MSwic2NvcGUiOiJtcCJ9.NbOvaqy4PobP6ChzSBc7UFf9-0wyCWMSNFbAgTkQMc4'
    //     }
    //   })
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    //     .catch(err => console.error('出错了', err))
      
    // },

    searchUser(keyword: string) {
      const lowerKeyword = keyword.toLowerCase();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.id.includes(keyword) ||
          user.name.toLowerCase().includes(lowerKeyword) ||
          user.phone.includes(keyword)
      );
    },

    getUserById(userId: string): User | undefined {
      return this.users.find((user) => user.id === userId);
    },

    filterUsersByRoleOrStatus(role?: string, status?: string) {
      this.filteredUsers = this.users.filter((user) => {
        const matchRole = role ? user.role === role : true;
        const matchStatus = status ? user.status === status : true;
        return matchRole && matchStatus;
      });
    },

    resetFilters() {
      this.filteredUsers = this.users;
    },

    // 删除某用户的某一个需求
    deleteDemand(userId: string, demandId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (user?.demands) {
        user.demands = user.demands.filter((d) => d.id !== demandId);
      }
    },

    // 修改某个需求状态为已通过
    approveDemand(userId: string, demandId: string) {
      const user = this.users.find((u) => u.id === userId);
      const demand = user?.demands?.find((d) => d.id === demandId);
      if (demand) demand.status = "已通过";
    },

    // 修改某个需求状态为已驳回
    rejectDemand(userId: string, demandId: string) {
      const user = this.users.find((u) => u.id === userId);
      const demand = user?.demands?.find((d) => d.id === demandId);
      if (demand) demand.status = "已驳回";
    },

    // 删除某一条评论
    deleteDemandComment(
      userId: string,
      demandId: string,
      commentIndex: number
    ) {
      const user = this.users.find((u) => u.id === userId);
      const demand = user?.demands?.find((d) => d.id === demandId);
      if (
        demand?.comments &&
        commentIndex >= 0 &&
        commentIndex < demand.comments.length
      ) {
        demand.comments.splice(commentIndex, 1);
      }
    },

    // 警告用户：警告次数 +1，如果满3次则冻结用户（记录冻结时间并冻结次数+1）
    warnUserById(userId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.warningCount += 1;
        if (user.warningCount >= 3 && user.status !== "已冻结") {
          user.status = "已冻结";
          user.freezeCount += 1;
          user.freezeTime = new Date().toISOString();
        }
      }
    },

    // 冻结用户：状态设为“已冻结”，冻结次数 +1（不记录冻结时间）
    freezeUserById(userId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (user && user.status !== "已冻结") {
        user.status = "已冻结";
        user.freezeCount += 1;
      }
    },

    // 解冻用户：状态设为“正常”，警告次数清零
    unfreezeUserById(userId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (user && user.status === "已冻结") {
        user.status = "正常";
        user.warningCount = 0;
        user.freezeTime = undefined;
      }
    },

    // 获取所有用户的需求，按发布时间排序（新到旧）
    getAllDemandsSorted(): (Demand & {
      publisherId: string;
      publisherName: string;
      publisherPhone: string;
      publisherAvatar?: string;
    })[] {
      const allDemands = this.users
        .flatMap((user) => {
          return (user.demands || []).map((demand) => ({
            ...demand,
            publisherId: user.id,
            publisherName: user.name,
            publisherPhone: user.phone,
            publisherAvatar: user.avatar,
            publisherauthRole: user.authRole,
          }));
        })
        .sort(
          (a, b) =>
            new Date(b.publishTime).getTime() -
            new Date(a.publishTime).getTime()
        );

      return allDemands;
    },
    getDemandDetail(userId: string, demandId: string): (Demand & {
      publisherId: string;
      publisherName: string;
      publisherPhone: string;
      publisherAvatar?: string;
      publisherauthRole?: string;
    }) | undefined {
      const user = this.users.find((u) => u.id === userId);
      const demand = user?.demands?.find((d) => d.id === demandId);
      if (user && demand) {
        return {
          ...demand,
          publisherId: user.id,
          publisherName: user.name,
          publisherPhone: user.phone,
          publisherAvatar: user.avatar,
          publisherauthRole: user.authRole,
        };
      }
      return undefined;
    },
    
  },
});
