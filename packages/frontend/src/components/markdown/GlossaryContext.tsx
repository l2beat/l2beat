import { createContext, useContext } from 'react'

/** Turns the glossary terms in markdown into glossary links. */
export type LinkGlossaryTerms = (markdown: string) => string

const GlossaryContext = createContext<LinkGlossaryTerms | null>(null)

interface Props {
  linkTerms: LinkGlossaryTerms
  children: React.ReactNode
}

export function GlossaryContextProvider({ children, linkTerms }: Props) {
  return (
    <GlossaryContext.Provider value={linkTerms}>
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
