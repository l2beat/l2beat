import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../../chain-selector/types'

interface InteropFlowsContextType {
  selectedChains: string[]
  selectedProtocols: string[]
  allChainIds: string[]
  allProtocolNames: string[]
  toggleChainSelection: (chainId: string) => void
  toggleProtocolSelection: (protocolName: string) => void
}

export const InteropFlowsContext = createContext<
  InteropFlowsContextType | undefined
>(undefined)

interface InteropFlowsProviderProps {
  children: ReactNode
  chains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}

export function InteropFlowsProvider({
  children,
  chains,
  protocols,
}: InteropFlowsProviderProps) {
  const allChainIds = useMemo(() => chains.map((c) => c.id), [chains])
  const allProtocolNames = useMemo(
    () => protocols.map((p) => p.name),
    [protocols],
  )
  const [selectedChains, setSelectedChains] = useState<string[]>(allChainIds)
  const [selectedProtocols, setSelectedProtocols] =
    useState<string[]>(allProtocolNames)

  const toggleChainSelection = useCallback((chainId: string) => {
    setSelectedChains((prev) => {
      if (prev.includes(chainId)) {
        return prev.filter((id) => id !== chainId)
      }
      return [...prev, chainId]
    })
  }, [])

  const toggleProtocolSelection = useCallback((protocolName: string) => {
    setSelectedProtocols((prev) => {
      if (prev.includes(protocolName)) {
        return prev.filter((name) => name !== protocolName)
      }
      return [...prev, protocolName]
    })
  }, [])

  return (
    <InteropFlowsContext.Provider
      value={{
        allChainIds,
        allProtocolNames,
        selectedChains,
        selectedProtocols,
        toggleChainSelection,
        toggleProtocolSelection,
      }}
    >
      {children}
    </InteropFlowsContext.Provider>
  )
}

export function useInteropFlows() {
  const context = useContext(InteropFlowsContext)
  if (!context) {
    throw new Error('useInteropFlows must be used within InteropFlowsProvider')
  }
  return context
}
