import { create } from 'zustand'

interface SearchState {
  opened: boolean
  searchTerm: string
  selectedIndex: number

  setOpen: (opened: boolean) => void
  setSearchTerm: (searchTerm: string) => void
  setSelectedIndex: (selectedIndex: number) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  opened: false,
  searchTerm: '',
  selectedIndex: 0,

  setOpen: (opened: boolean) => set(() => ({ opened })),
  setSearchTerm: (searchTerm: string) =>
    set(() => ({ searchTerm, selectedIndex: 0 })),
  setSelectedIndex: (selectedIndex: number) => set(() => ({ selectedIndex })),
}))
