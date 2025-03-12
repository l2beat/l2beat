'use client'
import {
  type ReactNode,
  createContext,
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
  const [highlightedId, setHighlightedId] = useState(defaultValue)

  const handleHashChange = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    const highlight = params.get('highlight')
    if (!highlight) return

    const element = document.getElementById(highlight)
    if (!element) return

    const parentPrimaryCard = Array.from(
      document.querySelectorAll('.primary-card'),
    ).find((card) => card !== element && card.contains(element))

    const toHighlight = parentPrimaryCard ?? element
    setHighlightedId(toHighlight.id)
  }, [])

  useEffect(handleHashChange, [handleHashChange])

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
