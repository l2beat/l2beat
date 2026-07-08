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

interface ChainSetSelectionContextType {
  selectedChains: string[]
  toggleChain: (chainId: string) => void
  selectAll: () => void
  deselectAll: () => void
}

const ChainSetSelectionContext = createContext<
  ChainSetSelectionContextType | undefined
>(undefined)

interface ChainSetSelectionProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
}

export function ChainSetSelectionProvider({
  children,
  interopChains,
}: ChainSetSelectionProviderProps) {
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
    <ChainSetSelectionContext.Provider
      value={{
        selectedChains: selection,
        toggleChain,
        selectAll,
        deselectAll,
      }}
    >
      {children}
    </ChainSetSelectionContext.Provider>
  )
}

export function useChainSetSelection() {
  const context = useContext(ChainSetSelectionContext)
  if (!context) {
    throw new Error(
      'useChainSetSelection must be used within ChainSetSelectionProvider',
    )
  }
  return context
}
