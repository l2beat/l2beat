import { createContext, useContext } from 'react'

const ChangelogEntriesContext = createContext<string[] | null>(null)

interface Props {
  recentChangelogEntriesIds: string[]
  children: React.ReactNode
}

export function ChangelogEntriesContextProvider({
  children,
  recentChangelogEntriesIds,
}: Props) {
  return (
    <ChangelogEntriesContext.Provider value={recentChangelogEntriesIds}>
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
