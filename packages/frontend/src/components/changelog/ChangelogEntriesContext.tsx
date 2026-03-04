import { createContext, useContext } from 'react'

const ChangelogEntriesContext = createContext<number[] | null>(null)

interface Props {
  publishedAtTimestamps: number[]
  children: React.ReactNode
}

export function ChangelogEntriesContextProvider({
  children,
  publishedAtTimestamps,
}: Props) {
  return (
    <ChangelogEntriesContext.Provider value={publishedAtTimestamps}>
      {children}
    </ChangelogEntriesContext.Provider>
  )
}

export function useChangelogEntriesContext() {
  const context = useContext(ChangelogEntriesContext)
  if (context === null) {
    throw new Error(
      'useChangelogEntriesContext must be used within a ChangelogEntriesContextProvider',
    )
  }
  return context
}
