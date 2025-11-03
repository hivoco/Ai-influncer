import { create } from 'zustand'

interface StoreState {
  data: {
    currentText: string
    postID: string
  } | null
  setData: (data: { currentText: string; postID: string }) => void
}

export const useStore = create<StoreState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
