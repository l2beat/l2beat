import type { InteropChains } from '@l2beat/config'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

type InteropChainId = InteropChains[number]['id']
interface InteropSelectedChainsContextType {
  selectedChains: {
    from: Record<InteropChainId, boolean>
    to: Record<InteropChainId, boolean>
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
    from: getAllSelected(interopChains),
    to: getAllSelected(interopChains),
  })

  const toggleFrom = useCallback((chainId: InteropChainId) => {
    setSelectedChains((prev) => ({
      ...prev,
      from: { ...prev.from, [chainId]: !prev.from[chainId] },
    }))
  }, [])

  const toggleTo = useCallback((chainId: InteropChainId) => {
    setSelectedChains((prev) => ({
      ...prev,
      to: { ...prev.to, [chainId]: !prev.to[chainId] },
    }))
  }, [])

  const reset = useCallback(() => {
    setSelectedChains({
      from: getAllSelected(interopChains),
      to: getAllSelected(interopChains),
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

function getAllSelected(chains: InteropChains) {
  return Object.fromEntries(chains.map((chain) => [chain.id, true])) as Record<
    InteropChainId,
    boolean
  >
}
