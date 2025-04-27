import { defineStore } from 'pinia'
import { getNewsListApi,addNewsApi,deleteNewsApi } from '@/api/home/news'


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
    sortBy: 'views',
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

    toggleVisibility(id: number) {
      const item = this.newsList.find(i => i.id === id)
      if (item) item.visible = !item.visible
    },
    toggleSelected(id: number, selected?: boolean) {
      const item = this.newsList.find(i => i.id === id)
      if (item) {
        if (typeof selected === 'boolean') {
          item.selected = selected
        } else {
          item.selected = !item.selected
        }
      }
    },
    
    

    async deleteNews(id: number) {
      try {
        await deleteNewsApi(id)
        await this.fetchNewsList()  
      } catch (err) {
        console.error('删除新闻失败：', err)
      }
    },

    addNews: async function (news: { url: string; source: string }) {
      try {
        await addNewsApi(news)
        await this.fetchNewsList() 
      } catch (err) {
        console.error('添加新闻失败：', err)
      }
    }

   
  },
})
