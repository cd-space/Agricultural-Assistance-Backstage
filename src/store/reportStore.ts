import { defineStore } from 'pinia'
import { useUserListStore } from './userList'
import { 
  getUserReportListApi, 
  getUserReportDetailApi, 
  ignoreUserReportApi, 
  handleUserReportWarningApi 
} from '@/api/feedbackManage/UsersReport'

export interface ReportItem {
  id: string
  type: string
  reporterId: string
  reportedId: string
  status: '待处理' | '已处理' | '已忽略'
  time: string
  description: string
  images: string[]
  source: string[] //如果是举报评论，则返回发布需求者id和需求id
  
  // 补充信息
  reporterName?: string
  reporterAvatar?: string
  reporterRegisterTime?: string
  reportedName?: string
  reportedAvatar?: string
  reportedRegisterTime?: string
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


     /**
   * 获取举报列表
   */
  async fetchReportList() {
    try {
      const res = await getUserReportListApi()
      this.reportList = res.data || []
      this.filteredList = [...this.reportList]
      this.currentPage = 1
      console.log('reportStore.reportList',this.reportList)
      
    } catch (error) {
      console.error('获取举报列表失败', error)
    }
  },

  /**
   * 获取举报详情
   */
  async fetchReportDetail(id: number) {
    try {
      const res = await getUserReportDetailApi(id)
      return res.data
    } catch (error) {
      console.error('获取举报详情失败', error)
      return null
    }
  },

  /**
   * 忽略举报
   */
  async ignoreReport(id: number) {
    try {
      await ignoreUserReportApi(id)
      this.markAsIgnored(id.toString())
    } catch (error) {
      console.error('忽略举报失败', error)
    }
  },

  /**
   * 处理举报警告
   */
  async handleReportWarning(id: number, data: { status: string; title: string; content: string }) {
    try {
      await handleUserReportWarningApi(id, data)
      this.markAsResolved(id.toString())
    } catch (error) {
      console.error('处理举报警告失败', error)
    }
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

