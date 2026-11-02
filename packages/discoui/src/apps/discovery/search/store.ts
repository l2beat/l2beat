import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SearchScope } from './scopes'

const RECENT_ADDRESSES_MAX = 20

interface SearchState {
  opened: boolean
  scope: SearchScope
  text: string
  codeInSelected: boolean
  recentAddresses: string[]

  setOpen: (opened: boolean) => void
  setScope: (scope: SearchScope) => void
  setText: (text: string) => void
  setCodeInSelected: (codeInSelected: boolean) => void
  pushRecentAddress: (address: string) => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      opened: false,
      scope: 'all',
      text: '',
      codeInSelected: false,
      recentAddresses: [],

      setOpen: (opened) => set(() => ({ opened })),
      setScope: (scope) => set(() => ({ scope })),
      setText: (text) => set(() => ({ text })),
      setCodeInSelected: (codeInSelected) => set(() => ({ codeInSelected })),
      pushRecentAddress: (address) =>
        set((state) => ({
          recentAddresses: [
            address,
            ...state.recentAddresses.filter((a) => a !== address),
          ].slice(0, RECENT_ADDRESSES_MAX),
        })),
    }),
    {
      name: 'discovery-search-store-v1',
      partialize: (state) => ({ recentAddresses: state.recentAddresses }),
    },
  ),
)
