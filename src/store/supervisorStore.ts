import { defineStore } from 'pinia'

export interface Mentor {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  intro: string
  tags: string[]
  applyCount: number
  isFeatured: boolean
}

interface State {
  mentors: Mentor[]
  filteredMentors: Mentor[]
}

export const useMentorListStore = defineStore("mentorList", {
  state: (): State => ({
    mentors: [],
    filteredMentors: [],
  }),

  actions: {
    setMentors(mentorList?: Mentor[]) {
      if (mentorList) {
        this.mentors = mentorList;
        this.filteredMentors = mentorList;
      } else {
        this.mentors = [
          {
            id: "1",
            name: "赵志远",
            phone: "13888888888",
            email: "zhaozhy@example.com",
            avatar: "https://i.pravatar.cc/100?img=1",
            intro:
              "资深用户体验设计师，拥有 15 年行业经验。专注于企业级产品设计与用户研究，曾主导多个大型项目的设计工作。",
            tags: ["UI设计", "用户研究", "设计管理"],
            applyCount: 12,
            isFeatured: true,
          },
          {
            id: "2",
            name: "林晓华",
            phone: "13999999999",
            email: "linxh@example.com",
            avatar: "https://i.pravatar.cc/100?img=2",
            intro:
              "产品设计专家，擅长用户研究与交互设计。曾在多家知名科技公司担任设计负责人，带领团队完成多个重要项目。",
            tags: ["产品设计", "交互设计", "用户研究"],
            applyCount: 8,
            isFeatured: false,
          },
          {
            id: "3",
            name: "王建国",
            phone: "13777777777",
            email: "wangjg@example.com",
            avatar: "https://i.pravatar.cc/100?img=3",
            intro:
              "资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。",
            tags: ["前端开发", "性能优化", "工程化"],
            applyCount: 20,
            isFeatured: true,
          },
          {
            id: "4",
            name: "王建国",
            phone: "13777777777",
            email: "wangjg@example.com",
            avatar: "https://i.pravatar.cc/100?img=3",
            intro:
              "资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。",
            tags: ["前端开发", "性能优化", "工程化"],
            applyCount: 20,
            isFeatured: true,
          },
          {
            id: "5",
            name: "王建国",
            phone: "13777777777",
            email: "wangjg@example.com",
            avatar: "https://i.pravatar.cc/100?img=3",
            intro:
              "资深前端开发工程师，精通现代前端技术栈。在大型互联网公司有丰富的开发经验，擅长性能优化与工程化实践。",
            tags: ["前端开发", "性能优化", "工程化"],
            applyCount: 20,
            isFeatured: true,
          },
        ];
        this.filteredMentors = this.mentors;
      }
    },

    addMentor(newMentor: Mentor) {
      this.mentors.push(newMentor);
      this.filteredMentors = this.mentors;
    },

    deleteMentor(id: string) {
      this.mentors = this.mentors.filter((m) => m.id !== id);
      this.filteredMentors = this.mentors;
    },

    updateMentor(updated: Mentor) {
      const index = this.mentors.findIndex((m) => m.id === updated.id);
      if (index !== -1) {
        this.mentors[index] = { ...updated };
        this.filteredMentors = this.mentors;
      }
    },

    searchMentor(keyword: string) {
      const lower = keyword.toLowerCase();
      this.filteredMentors = this.mentors.filter(
        (m) =>
          m.name.toLowerCase().includes(lower) ||
          m.phone.includes(keyword) ||
          m.email.toLowerCase().includes(lower)
      );
    },

    searchMentorById(id: string) {
      this.filteredMentors = this.mentors.filter((m) => m.id === id);
    },

    resetFilter() {
      this.filteredMentors = this.mentors;
    },

    toggleIsFeatured(id: string) {
      const mentor = this.mentors.find((mentor) => mentor.id === id);

      if (mentor) {
        // 获取当前置顶的导师数量
        const featuredCount = this.mentors.filter((m) => m.isFeatured).length;

        // 如果导师当前是未置顶，且已经有10个导师置顶，则不能再设置为置顶
        if (!mentor.isFeatured && featuredCount >= 10) {
          alert("最多只能有10个导师被设置为置顶！");
          return;
        }

        // 切换导师的置顶状态
        mentor.isFeatured = !mentor.isFeatured;
      }
    },
  },
});
