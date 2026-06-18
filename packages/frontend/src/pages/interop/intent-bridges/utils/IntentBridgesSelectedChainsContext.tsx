import xor from 'lodash/xor'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'

interface IntentBridgesSelectedChainsContextType {
  selectedChains: string[]
  toggleChain: (chainId: string) => void
  selectAll: () => void
  deselectAll: () => void
}

const IntentBridgesSelectedChainsContext = createContext<
  IntentBridgesSelectedChainsContextType | undefined
>(undefined)

interface IntentBridgesSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
}

export function IntentBridgesSelectedChainsProvider({
  children,
  interopChains,
}: IntentBridgesSelectedChainsProviderProps) {
  const allChainIds = useMemo(
    () => interopChains.map((chain) => chain.id),
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
    <IntentBridgesSelectedChainsContext.Provider
      value={{ selectedChains: selection, toggleChain, selectAll, deselectAll }}
    >
      {children}
    </IntentBridgesSelectedChainsContext.Provider>
  )
}

export function useIntentBridgesSelectedChains() {
  const context = useContext(IntentBridgesSelectedChainsContext)
  if (!context) {
    throw new Error(
      'useIntentBridgesSelectedChains must be used within IntentBridgesSelectedChainsProvider',
    )
  }
  return context
}
