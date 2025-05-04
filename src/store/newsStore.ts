import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { 
  getNewsListApi,
  addNewsApi,
  deleteNewsApi,
  updateNewsApi  } from '@/api/home/news'


export interface NewsItem {
  id: number
  title: string
  publishDate: string
  repostDate: string
  source: string
  views: number
  visible: boolean
  selected: boolean
  url: string
}
export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [] as NewsItem[],
    searchKeyword: '',
    sortBy: 'publishDate',
  }),

  getters: {
    filteredNews(state) {
      let list = state.newsList ?? []
    
      if (state.searchKeyword) {
        list = list.filter(item =>
          item.title.includes(state.searchKeyword) || item.source.includes(state.searchKeyword)
        )
      }
    
      if (state.sortBy === 'views') {
        list = list.slice().sort((a, b) => b.views - a.views)
      } else if (state.sortBy === 'publishDate') {
        list = list.slice().sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
      }
    
      return list
    },
    

    selectedNews(state) {
      return state.newsList.filter(item => item.selected)
    }
  },

  actions: {

    async fetchNewsList() {
      try {
        const res = await getNewsListApi()
        console.log(res)
        this.newsList = res.data
      } catch (err) {
        console.error('获取新闻列表失败：', err)
      }
    },

    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    },

    setSortBy(sortKey: string) {
      this.sortBy = sortKey
    },

    toggleVisibility: async function (id: number) {
      const item = this.newsList.find(i => i.id === id)
      if (!item) return
    
      const newVisible = !item.visible
    
      try {
        await updateNewsApi(id, newVisible, undefined)
        item.visible = newVisible
      } catch (err) {
        ElMessage.error('更新展示状态失败')
        console.error('更新展示状态失败：', err)
      }
    },
    // 置顶/取消置顶
    toggleSelected: async function (id: number, selected?: boolean) {
      const item = this.newsList.find(i => i.id === id)
      if (!item) return
    
      // 计算当前已置顶数量（不包括当前项）
      const currentSelectedCount = this.newsList.filter(i => i.selected && i.id !== id).length
      const willSelect = typeof selected === 'boolean' ? selected : !item.selected
    
      // 置顶达上限
      if (willSelect && currentSelectedCount >= 3) {
        ElMessage.warning('最多只能置顶三个新闻')
        return
      }
    
      try {
        // 请求后端更新
        await updateNewsApi(id, undefined, willSelect)
    
        // 成功后更新本地状态
        item.selected = willSelect
      } catch (err) {
        ElMessage.error('更新置顶状态失败')
        console.error('更新置顶状态失败：', err)
      }
    },
    
    

    async deleteNews(id: number) {
      try {
        await deleteNewsApi(id)
        await this.fetchNewsList()  
      } catch (err) {
        ElMessage.error('删除新闻失败')
        console.error('删除新闻失败：', err)
      }
    },

    addNews: async function (news: { url: string; source: string }) {
      try {
        await addNewsApi(news)
        await this.fetchNewsList() 
      } catch (err) {
        ElMessage.error('添加新闻失败')
        console.error('添加新闻失败：', err)
      }
    }

   
  },
})
