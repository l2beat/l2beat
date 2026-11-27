import { createContext, useContext, useState } from 'react'
import type { GasFeesChainId } from '~/server/features/gas-fees/chains'

interface ChainHighlight {
  chain: GasFeesChainId | undefined
  setChain: (chain: GasFeesChainId | undefined) => void
}

/** The chain hovered in the costs table, highlighted on the fee chart */
const ChainHighlightContext = createContext<ChainHighlight>({
  chain: undefined,
  setChain: () => {},
})

export function ChainHighlightProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [chain, setChain] = useState<GasFeesChainId>()
  return (
    <ChainHighlightContext.Provider value={{ chain, setChain }}>
      {children}
    </ChainHighlightContext.Provider>
  )
}

export function useChainHighlight() {
  return useContext(ChainHighlightContext)
}
