import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface HighlightedPrimaryCardContextType {
  highlightedId: string | undefined
}

const HighlightedPrimaryCardContext = createContext<
  HighlightedPrimaryCardContextType | undefined
>(undefined)

interface HighlightedPrimaryCardProviderProps {
  children: ReactNode
  defaultValue?: string
}

export function HighlightedPrimaryCardProvider({
  children,
  defaultValue,
}: HighlightedPrimaryCardProviderProps) {
  const [highlightedId, setHighlightedId] = useState<string | undefined>(
    defaultValue,
  )

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash
    if (!hash) return

    let selector: string
    try {
      selector = decodeURIComponent(hash)
    } catch {
      return
    }

    let element: Element | null = null
    try {
      element = document.querySelector(selector)
    } catch {
      // Invalid selector, ignore
      return
    }
    if (!element) return

    // Find the closest parent with .primary-card, or use the element itself
    const parentPrimaryCard = element.closest('.primary-card')
    setHighlightedId(parentPrimaryCard?.id ?? element.id)
  }, [])

  useEffect(handleHashChange, [])

  useEffect(() => {
    if (!highlightedId) return

    const timeoutId = setTimeout(() => {
      setHighlightedId(undefined)
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [highlightedId])

  return (
    <HighlightedPrimaryCardContext.Provider value={{ highlightedId }}>
      {children}
    </HighlightedPrimaryCardContext.Provider>
  )
}

export function useHighlightedPrimaryCardContext() {
  const context = useContext(HighlightedPrimaryCardContext)
  if (!context) {
    throw new Error(
      'useHighlightedPrimaryCardContext must be used within a HighlightedPrimaryCardProvider',
    )
  }
  return context
}
