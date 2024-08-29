import {
  type CoingeckoPriceConfigEntry,
  type EscrowEntry,
  type TotalSupplyEntry,
} from '@l2beat/shared-pure'
import { getChainAmountIndexerId, getPriceIndexerId } from './ids'

export type MultiIndexerEntry =
  | TotalSupplyEntry
  | EscrowEntry
  | CoingeckoPriceConfigEntry

export function toIndexerId(config: MultiIndexerEntry) {
  switch (config.type) {
    case 'coingecko':
      return getPriceIndexerId(config.coingeckoId)
    case 'escrow':
    case 'totalSupply':
      return getChainAmountIndexerId(config.chain)
  }
}
