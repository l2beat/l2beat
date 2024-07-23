'use client'

import { createContext, useContext } from 'react'
import { type CollectionEntry } from '~/content/get-collection'

type GlossaryContextValue = {
  terms: CollectionEntry<'glossary'>[]
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

interface Props {
  value: GlossaryContextValue
  children: React.ReactNode
}

export function GlossaryContextProvider({ children, value }: Props) {
  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function useGlossaryContext() {
  const context = useContext(GlossaryContext)
  if (!context) {
    throw new Error('useChartContext must be used within a Chart')
  }
  return context
}
