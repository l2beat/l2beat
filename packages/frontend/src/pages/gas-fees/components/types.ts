import type { GasFeesWallet } from '@l2beat/database'
import type {
  FeeSplitPartKey,
  GasFeesChainId,
} from '~/server/features/gas-fees/chains'

export interface GasFeesChain {
  id: GasFeesChainId
  name: string
  shortName: string | undefined
  type: string
  gasToken: string
  href: string | undefined
  iconUrl: string
  color: string
  noPriorityFeeNote: string | undefined
  /** How each part of the fee works on this chain */
  feeSplitNotes: Partial<Record<FeeSplitPartKey, string>>
}

export type GasFeesWalletIcons = Record<GasFeesWallet, string>
