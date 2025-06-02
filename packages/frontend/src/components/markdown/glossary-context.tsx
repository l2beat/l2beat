import { createContext, useContext } from 'react'

const GlossaryContext = createContext<GlossaryTermWithoutDescription[] | null>(
  null,
)

interface Props {
  terms: GlossaryTermWithoutDescription[]
  children: React.ReactNode
}

export interface GlossaryTermWithoutDescription {
  id: string
  matches: string[]
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
