import { defineStore } from 'pinia'
import {
  getMentorListApi,
  getMentorDetailApi,
  addMentorApi,
  updateMentorDisplayApi,
  deleteMentorApi 
} from '@/api/supervisoeLibrary'

export interface Mentor {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  intro: string
  tags: Array<any>
  isFeatured: boolean
  applyCount?: number
}
export interface MentorDetail {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  intro: string
  tags: Array<any>
  
}

interface State {
  mentorDetail: MentorDetail | null
  mentors: Mentor[]
  filteredMentors: Mentor[]
}

export const useMentorListStore = defineStore("mentorList", {
  state: (): State => ({
    mentorDetail: null,
    mentors: [],
    filteredMentors: [],
  }),

  actions: {
    /**
     * 获取导师列表
     */
    async fetchMentors() {
      try {
        const res = await getMentorListApi();
        this.mentors = res.data || [];
        this.filteredMentors = this.mentors;
      } catch (error) {
        console.error("获取导师列表失败", error);
      }
    },

    /**
     * 获取导师详情
     * @param id 导师ID
     */
    async fetchMentorDetail(id: string): Promise<Mentor> {
      const res = await getMentorDetailApi(id)
      return res.data
    },

    /**
     * 添加导师
     * @param formData 包含导师信息的 FormData 对象
     */
    async addMentor(formData: FormData) {
      try {
        await addMentorApi(formData);
        // 添加成功后刷新导师列表
        await this.fetchMentors();
        console.log(this.filteredMentors)
      } catch (error) {
        console.error("添加导师失败", error);
      }
    },

    /**
     * 根据关键词搜索导师
     */
    searchMentor(keyword: string) {
      const lower = keyword.toLowerCase();
      this.filteredMentors = this.mentors.filter(
        (m) =>
          m.name.toLowerCase().includes(lower) ||
          m.phone.includes(keyword) ||
          m.email.toLowerCase().includes(lower)
      );
    },

    /**
     * 根据ID搜索导师
     */
    searchMentorById(id: string) {
      this.filteredMentors = this.mentors.filter((m) => m.id === id);
    },

    /**
     * 重置筛选
     */
    resetFilter() {
      this.filteredMentors = this.mentors;
    },

    /**
     * 切换导师首页置顶状态
     */
    async toggleIsFeatured(id: string) {
      const mentor = this.mentors.find((mentor) => mentor.id === id);

      if (!mentor) return;

      const featuredCount = this.mentors.filter((m) => m.isFeatured).length;

      // 如果是想设置置顶，但已达上限10个
      if (!mentor.isFeatured && featuredCount >= 10) {
        alert("最多只能有10个导师被设置为置顶！");
        return;
      }

      try {
        const newFeaturedStatus = !mentor.isFeatured;
        await updateMentorDisplayApi(id, newFeaturedStatus);
        // 接口请求成功后再改本地
        mentor.isFeatured = newFeaturedStatus;
      } catch (error) {
        console.error("更新导师置顶状态失败", error);
      }
    },
    
    /**
     * 删除导师
     * @param id 导师ID
     */
    async deleteMentor(id: string) {
      try {
        await deleteMentorApi(id)
        // 删除成功后刷新列表
        await this.fetchMentors()
      } catch (error) {
        console.error('删除导师失败', error)
      }
    },


  },
});