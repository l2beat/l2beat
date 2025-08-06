import { createContext, useContext } from 'react'

const GlossaryContext = createContext<GlossaryTerm[] | null>(null)

interface Props {
  terms: GlossaryTerm[]
  children: React.ReactNode
}

export interface GlossaryTerm {
  id: string
  matches: string[]
  description: string
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
