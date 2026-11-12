import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react'
import {
  createSimulatedHead,
  type SimulatedHead,
  type SimulatedPoster,
} from './simulatedHead'
import type { EthereumHead } from './types'

const HeadContext = createContext<SimulatedHead | undefined>(undefined)

/** One stream for the whole page, so every number on it is from the same block */
export function EthereumHeadProvider({
  posters,
  speed,
  children,
}: {
  posters: SimulatedPoster[]
  speed: number
  children: ReactNode
}) {
  const [head] = useState(() => createSimulatedHead(posters))
  useEffect(() => head.setSpeed(speed), [head, speed])
  return <HeadContext value={head}>{children}</HeadContext>
}

export function useEthereumHead(): EthereumHead {
  const head = useHeadSource()
  // the server and the first client render both see the stream connecting,
  // so the page hydrates before any block arrives
  return useSyncExternalStore(head.subscribe, head.get, head.get)
}

/** Prototype only: lets a variant show off the reorg rewind on demand */
export function useSimulateReorg() {
  return useHeadSource().reorg
}

function useHeadSource() {
  const head = use(HeadContext)
  if (!head) throw new Error('Missing EthereumHeadProvider')
  return head
}
