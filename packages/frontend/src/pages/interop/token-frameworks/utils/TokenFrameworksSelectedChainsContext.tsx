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

interface TokenFrameworksSelectedChainsContextType {
  selectedChains: string[]
  toggleChain: (chainId: string) => void
  selectAll: () => void
  deselectAll: () => void
}

export const TokenFrameworksSelectedChainsContext = createContext<
  TokenFrameworksSelectedChainsContextType | undefined
>(undefined)

interface TokenFrameworksSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
}

export function TokenFrameworksSelectedChainsProvider({
  children,
  interopChains,
}: TokenFrameworksSelectedChainsProviderProps) {
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
    <TokenFrameworksSelectedChainsContext.Provider
      value={{
        selectedChains: selection,
        toggleChain,
        selectAll,
        deselectAll,
      }}
    >
      {children}
    </TokenFrameworksSelectedChainsContext.Provider>
  )
}

export function useTokenFrameworksSelectedChains() {
  const context = useContext(TokenFrameworksSelectedChainsContext)
  if (!context) {
    throw new Error(
      'useTokenFrameworksSelectedChains must be used within TokenFrameworksSelectedChainsProvider',
    )
  }
  return context
}
