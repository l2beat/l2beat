import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface HighlightedTableRowContextType {
  highlightedSlug: string | undefined
}

const HighlightedTableRowContext = createContext<
  HighlightedTableRowContextType | undefined
>(undefined)

interface HighlightedTableRowProviderProps {
  children: ReactNode
  defaultValue?: string
}

export function HighlightedTableRowProvider({
  children,
  defaultValue,
}: HighlightedTableRowProviderProps) {
  const [highlightedSlug, setHighlightedSlug] = useState(defaultValue)

  const handleHighlightChange = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    setHighlightedSlug(highlight ?? undefined)
  }, [])

  useEffect(handleHighlightChange, [])

  return (
    <HighlightedTableRowContext.Provider value={{ highlightedSlug }}>
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
