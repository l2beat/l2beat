import { createContext, useContext } from 'react'
import type { BadgeWithParams } from './ProjectBadge'

// Scaling tables list the same few dozen badges for hundreds of projects, so
// pages send each badge once and entries reference them by id.
export type BadgeDictionary = Record<string, Omit<BadgeWithParams, 'href'>>

const BadgeDictionaryContext = createContext<BadgeDictionary>({})

export function BadgeDictionaryContextProvider({
  badges,
  children,
}: {
  badges: BadgeDictionary
  children: React.ReactNode
}) {
  return (
    <BadgeDictionaryContext.Provider value={badges}>
      {children}
    </BadgeDictionaryContext.Provider>
  )
}

export function useBadgeDictionary() {
  return useContext(BadgeDictionaryContext)
}
