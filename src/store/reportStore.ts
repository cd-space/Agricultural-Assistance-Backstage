import { defineStore } from 'pinia'
import { useUserListStore } from './userList'

interface ReportItem {
  id: string
  type: string
  reporterId: string
  reportedId: string
  status: '待处理' | '已处理' | '已忽略'
  time: string
  images: string[]
  source: string
  // 补充信息
  reporterName?: string
  reporterAvatar?: string
  reportedName?: string
  reportedAvatar?: string
}

interface ReportState {
  reportList: ReportItem[]
  filteredList: ReportItem[]

}

export const useReportStore = defineStore('reportStore', {
  state: (): ReportState & {
    currentPage: number
    pageSize: number
  } => ({
    reportList: [],
    filteredList: [],
    currentPage: 1,
    pageSize: 10,
  }),

  getters: {
    startIndex: (state) => (state.currentPage - 1) * state.pageSize,
    endIndex: (state) => Math.min((state.currentPage) * state.pageSize, state.filteredList.length),
    total: (state) => state.filteredList.length,
    paginatedList: (state): ReportItem[] => {
      return state.filteredList.slice(
        (state.currentPage - 1) * state.pageSize,
        state.currentPage * state.pageSize
      )
    },
  },

  actions: {
    async setReportList() {
      const res: ReportItem[] = [
        {
          id: 'R001',
          type: '违规内容',
          reporterId: '100232',
          reportedId: '100231',
          status: '待处理',
          time: '2025-04-12 09:00:00',
          images: ['/images/report1.jpg'],
          source: 'APP',
        },
        {
          id: 'R002',
          type: '垃圾信息',
          reporterId: '100233',
          reportedId: '100232',
          status: '已处理',
          time: '2025-04-13 11:45:00',
          images: [],
          source: 'Web',
        },
        {
          id: 'R003',
          type: '垃圾信息',
          reporterId: '100233',
          reportedId: '100232',
          status: '已忽略',
          time: '2025-04-13 11:45:00',
          images: [],
          source: 'Web',
        },
        {
          id: 'R004',
          type: '垃圾信息',
          reporterId: '100233',
          reportedId: '100231',
          status: '待处理',
          time: '2025-04-13 11:45:00',
          images: [],
          source: 'Web',
        },
        {
          id: 'R005',
          type: '垃圾信息',
          reporterId: '100233',
          reportedId: '100231',
          status: '待处理',
          time: '2025-04-13 11:45:00',
          images: [],
          source: 'Web',
        },
        // 可以加更多测试数据...
      ]

      const userListStore = useUserListStore()

      this.reportList = res.map((item) => {
        const reporter = userListStore.getUserById(item.reporterId)
        const reported = userListStore.getUserById(item.reportedId)

        return {
          ...item,
          reporterName: reporter?.name || '',
          reporterAvatar: reporter?.avatar || '',
          reportedName: reported?.name || '',
          reportedAvatar: reported?.avatar || '',
        }
      })

      this.filteredList = [...this.reportList]
    },

    filterByTypeAndStatus(type?: string, status?: string) {
      this.filteredList = this.reportList.filter(report => {
        const matchType = type ? report.type === type : true
        const matchStatus = status ? report.status === status : true
        return matchType && matchStatus
      })
      this.currentPage = 1 // 重置分页
    },

    searchByUserKeyword(keyword: string) {
      const lowerKeyword = keyword.toLowerCase()
      this.filteredList = this.reportList.filter(report => {
        return (
          report.reporterId.includes(keyword) ||
          report.reportedId.includes(keyword) ||
          (report.reporterName && report.reporterName.toLowerCase().includes(lowerKeyword)) ||
          (report.reportedName && report.reportedName.toLowerCase().includes(lowerKeyword))
        )
      })
      this.currentPage = 1 // 重置分页
    },

    markAsResolved(reportId: string) {
      const report = this.reportList.find(item => item.id === reportId)
      if (report) {
        report.status = '已处理'
        this.filteredList = [...this.reportList]
      }
    },

    markAsIgnored(reportId: string) {
      const report = this.reportList.find(item => item.id === reportId)
      if (report) {
        report.status = '已忽略'
        this.filteredList = [...this.reportList]
      }
    },

    setCurrentPage(page: number) {
      this.currentPage = page
    },
  },
})

