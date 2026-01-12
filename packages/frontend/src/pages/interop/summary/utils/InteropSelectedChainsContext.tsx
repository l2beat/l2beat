import type { InteropChains } from '@l2beat/config'
import xor from 'lodash/xor'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

export type InteropChainId = InteropChains[number]['id']
interface InteropSelectedChainsContextType {
  selectedChains: {
    from: InteropChainId[]
    to: InteropChainId[]
  }
  toggleFrom: (chainId: InteropChainId) => void
  toggleTo: (chainId: InteropChainId) => void
  reset: () => void
}

const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChains
}

export function InteropSelectedChainsProvider({
  children,
  interopChains,
}: InteropSelectedChainsProviderProps) {
  const [selectedChains, setSelectedChains] = useState({
    from: interopChains.map((chain) => chain.id),
    to: interopChains.map((chain) => chain.id),
  })

  const toggleFrom = useCallback((chainId: InteropChainId) => {
    setSelectedChains((prev) => ({
      ...prev,
      from: xor(prev.from, [chainId]),
    }))
  }, [])

  const toggleTo = useCallback((chainId: InteropChainId) => {
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

  return (
    <InteropSelectedChainsContext.Provider
      value={{ selectedChains, toggleFrom, toggleTo, reset }}
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
