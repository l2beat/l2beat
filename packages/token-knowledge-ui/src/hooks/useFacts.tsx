import type { RouterOutputs } from '@l2beat/token-knowledge'
import { createContext, useContext, useState } from 'react'

export type Fact = RouterOutputs['infer']['facts'][number]

const FactsContext = createContext<{
  facts: Fact[]
  setFacts: (facts: Fact[]) => void
}>({ facts: [], setFacts: () => {} })

export function FactsProvider({ children }: { children: React.ReactNode }) {
  const [facts, setFacts] = useState<Fact[]>([])
  return (
    <FactsContext.Provider value={{ facts, setFacts }}>
      {children}
    </FactsContext.Provider>
  )
}

export function useFacts() {
  return useContext(FactsContext)
}
