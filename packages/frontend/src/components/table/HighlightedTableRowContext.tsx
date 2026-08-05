import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { useQueryParam } from '~/hooks/useQueryParam'
import { parseHighlightedIds } from './utils/parseHighlightedIds'

interface HighlightedTableRowContextType {
  highlightedIds: string[]
}

const HighlightedTableRowContext = createContext<
  HighlightedTableRowContextType | undefined
>(undefined)

export function HighlightedTableRowProvider({
  children,
}: {
  children: ReactNode
}) {
  const [highlight] = useQueryParam('highlight', '')
  const value = useMemo(
    () => ({ highlightedIds: parseHighlightedIds(highlight) }),
    [highlight],
  )

  return (
    <HighlightedTableRowContext.Provider value={value}>
      {children}
    </HighlightedTableRowContext.Provider>
  )
}

export function useHighlightedTableRowContext() {
  const context = useContext(HighlightedTableRowContext)
  if (!context) {
    throw new Error(
      'useHighlightedTableRowContext must be used within a HighlightedTableRowProvider',
    )
  }
  return context
}
