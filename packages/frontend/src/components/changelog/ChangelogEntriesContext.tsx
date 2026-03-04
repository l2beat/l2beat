import { createContext, useContext } from 'react'

const ChangelogContext = createContext<{ unreadCount: number } | null>(null)

interface Props {
  unreadChangelogCount: number
  children: React.ReactNode
}

export function ChangelogContextProvider({
  children,
  unreadChangelogCount,
}: Props) {
  return (
    <ChangelogContext.Provider value={{ unreadCount: unreadChangelogCount }}>
      {children}
    </ChangelogContext.Provider>
  )
}

export function useChangelogContext() {
  const context = useContext(ChangelogContext)
  if (context === null) {
    throw new Error(
      'useChangelogContext must be used within a ChangelogContextProvider',
    )
  }
  return context
}
