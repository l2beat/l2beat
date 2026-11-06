import type { GasFeesChainId } from '~/server/features/gas-fees/chains'

export interface GasFeesChain {
  id: GasFeesChainId
  name: string
  shortName: string | undefined
  type: string
  href: string | undefined
  iconUrl: string
  color: string
  noPriorityFeeNote: string | undefined
  /** What a priority fee buys on the chain */
  tipRole: string
}
