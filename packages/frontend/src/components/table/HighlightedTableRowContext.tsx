import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface HighlightedTableRowContextType {
  highlightedId: string | undefined
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
  const [highlightedId, setHighlightedId] = useState(defaultValue)

  const handleHighlightChange = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    setHighlightedId(highlight ?? undefined)
  }, [])

  useEffect(handleHighlightChange, [])

  return (
    <HighlightedTableRowContext.Provider value={{ highlightedId }}>
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
