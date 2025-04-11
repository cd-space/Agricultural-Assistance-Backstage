import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [
      {
        id: 1,
        title: '人工智能在医疗领域取得重大突破',
        publishDate: '2024-01-15',
        repostDate: '2024-01-16',
        source: '科技日报',
        views: 12458,
        visible: false,
        selected: true,
        url: 'https://www.bilibili.com/',  
      },
      {
        id: 2,
        title: '全球气候变化会议达成重要共识',
        publishDate: '2024-01-14',
        repostDate: '2024-01-15',
        source: '环球时报',
        views: 8923,
        visible: true,
        selected: false,
        url: 'https://www.bilibili.com/',
      },
      {
        id: 3,
        title: '新能源汽车产业发展现状分析',
        publishDate: '2024-01-13',
        repostDate: '2024-01-14',
        source: '经济观察报',
        views: 6734,
        visible: true,
        selected: false,
        url: 'https://www.bilibili.com/',
      },
      {
        id: 4,
        title: '数字经济发展趋势报告发布',
        publishDate: '2024-01-12',
        repostDate: '2024-01-13',
        source: '中国经济网',
        views: 5289,
        visible: true,
        selected: false,
        url: 'https://www.bilibili.com/',
      },
      {
        id: 5,
        title: '5G 技术在工业互联网中的应用',
        publishDate: '2025-01-11',
        repostDate: '2024-01-12',
        source: '工业和信息化部',
        views: 3167,
        visible: true,
        selected: false,
        url: 'https://www.bilibili.com/',
      },
    ],
    searchKeyword: '',
    sortBy: 'views',
  }),

  getters: {
    filteredNews(state) {
      let list = state.newsList

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

    deleteNews(id: number) {
      this.newsList = this.newsList.filter(i => i.id !== id)
    },

    addNews(news: { url: string; source: string }) {
      const newItem = {
        id: Date.now(),
        title: '未命名标题',
        publishDate: '',
        repostDate: new Date().toISOString().split('T')[0],
        source: news.source || '未知来源',
        views: 0,
        visible: true,
        selected: false,
        url: news.url
      }
  
      this.newsList.unshift(newItem) // 添加到最前面
    }

   
  },
})
