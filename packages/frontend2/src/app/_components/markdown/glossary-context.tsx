'use client'

import { createContext, useContext } from 'react'
import { type CollectionEntry } from '~/content/get-collection'

const GlossaryContext = createContext<CollectionEntry<'glossary'>[] | null>(
  null,
)

interface Props {
  terms: CollectionEntry<'glossary'>[]
  children: React.ReactNode
}

export function GlossaryContextProvider({ children, terms }: Props) {
  return (
    <GlossaryContext.Provider value={terms}>
      {children}
    </GlossaryContext.Provider>
  )
}

export function useGlossaryContext() {
  const context = useContext(GlossaryContext)
  if (!context) {
    throw new Error(
      'useGlossaryContext must be used within a GlossaryContextProvider',
    )
  }
  return context
}
