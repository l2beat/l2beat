'use client'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useEventListener } from '~/hooks/use-event-listener'

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
    const hash = window.location.hash
    if (!hash) return

    const element = document.querySelector(hash)
    if (!element) return

    const parentPrimaryCard = Array.from(
      document.querySelectorAll('.primary-card'),
    ).find((card) => card !== element && card.contains(element))

    const toHighlight = parentPrimaryCard ?? element
    setHighlightedId(toHighlight.id)
  }, [])

  useEffect(handleHashChange, [handleHashChange])
  useEventListener('hashchange', handleHashChange)

  useEffect(() => {
    if (!highlightedId) return

    const timeoutId = setTimeout(() => {
      setHighlightedId(undefined)
    }, 3000)

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
