import type {
  FeeSplitPartKey,
  GasFeesChainId,
} from '~/server/features/gas-fees/chains'

export interface GasFeesChain {
  id: GasFeesChainId
  name: string
  shortName: string | undefined
  type: string
  href: string | undefined
  iconUrl: string
  color: string
  noPriorityFeeNote: string | undefined
  /** How each part of the fee works on this chain */
  feeSplitNotes: Partial<Record<FeeSplitPartKey, string>>
  /** What a priority fee buys on the chain */
  tipRole: string
}
