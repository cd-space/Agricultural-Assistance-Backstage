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

export const useMentorListStore = defineStore('mentorList', {
  state: (): State => ({
    mentors: [],
    filteredMentors: []
  }),

  actions: {
    setMentors(mentorList: Mentor[]) {
      this.mentors = mentorList
      this.filteredMentors = mentorList
    },

    addMentor(newMentor: Mentor) {
      this.mentors.push(newMentor)
      this.filteredMentors = this.mentors
    },

    deleteMentor(id: string) {
      this.mentors = this.mentors.filter(m => m.id !== id)
      this.filteredMentors = this.mentors
    },

    updateMentor(updated: Mentor) {
      const index = this.mentors.findIndex(m => m.id === updated.id)
      if (index !== -1) {
        this.mentors[index] = { ...updated }
        this.filteredMentors = this.mentors
      }
    },

    searchMentor(keyword: string) {
      const lower = keyword.toLowerCase()
      this.filteredMentors = this.mentors.filter(m =>
        m.name.toLowerCase().includes(lower) ||
        m.phone.includes(keyword) ||
        m.email.toLowerCase().includes(lower)
      )
    },

    searchMentorById(id: string) {
      this.filteredMentors = this.mentors.filter(m => m.id === id)
    },

    resetFilter() {
      this.filteredMentors = this.mentors
    }
  }
})
