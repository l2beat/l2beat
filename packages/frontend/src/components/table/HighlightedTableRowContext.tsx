import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
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
  const [highlightedIds, setHighlightedIds] = useState<string[]>([])

  useEffect(() => {
    setHighlightedIds(parseHighlightedIds(window.location.search))
  }, [])

  return (
    <HighlightedTableRowContext.Provider value={{ highlightedIds }}>
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
