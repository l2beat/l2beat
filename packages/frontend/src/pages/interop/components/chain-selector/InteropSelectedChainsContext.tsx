import xor from 'lodash/xor'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { InteropChainWithIcon } from './types'

interface InteropSelectedChainsContextType {
  selectedChains: string[]
  toggleChain: (chainId: string) => void
  selectAll: () => void
  deselectAll: () => void
}

const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
}

export function InteropSelectedChainsProvider({
  children,
  interopChains,
}: InteropSelectedChainsProviderProps) {
  const allChainIds = useMemo(
    () => interopChains.map((c) => c.id),
    [interopChains],
  )
  const [selection, setSelection] = useState(allChainIds)

  const toggleChain = useCallback((chainId: string) => {
    setSelection((prev) => xor(prev, [chainId]))
  }, [])

  const selectAll = useCallback(() => {
    setSelection(allChainIds)
  }, [allChainIds])

  const deselectAll = useCallback(() => {
    setSelection([])
  }, [])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        selectedChains: selection,
        toggleChain,
        selectAll,
        deselectAll,
      }}
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
