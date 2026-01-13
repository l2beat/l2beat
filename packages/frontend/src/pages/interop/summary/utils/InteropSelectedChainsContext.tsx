import type { InteropChain } from '@l2beat/config'
import xor from 'lodash/xor'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface InteropSelectedChainsContextType {
  selectedChains: {
    from: string[]
    to: string[]
  }
  toggleFrom: (chainId: string) => void
  toggleTo: (chainId: string) => void
  reset: () => void
  isDirty: boolean
}

const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChain[]
}

export function InteropSelectedChainsProvider({
  children,
  interopChains,
}: InteropSelectedChainsProviderProps) {
  const [selectedChains, setSelectedChains] = useState({
    from: interopChains.map((chain) => chain.id),
    to: interopChains.map((chain) => chain.id),
  })

  const toggleFrom = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      from: xor(prev.from, [chainId]),
    }))
  }, [])

  const toggleTo = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      to: xor(prev.to, [chainId]),
    }))
  }, [])

  const reset = useCallback(() => {
    setSelectedChains({
      from: interopChains.map((chain) => chain.id),
      to: interopChains.map((chain) => chain.id),
    })
  }, [interopChains])

  const isDirty = useMemo(() => {
    return (
      selectedChains.from.length !== interopChains.length ||
      selectedChains.to.length !== interopChains.length
    )
  }, [selectedChains, interopChains])

  return (
    <InteropSelectedChainsContext.Provider
      value={{ selectedChains, toggleFrom, toggleTo, reset, isDirty }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

export function useInteropSelectedChains() {
  const context = useContext(InteropSelectedChainsContext)
  if (!context) {
    throw new Error(
      'useInteropSelectedChains must be used within InteropSelectedChainsProvider',
    )
  }
  return context
}
