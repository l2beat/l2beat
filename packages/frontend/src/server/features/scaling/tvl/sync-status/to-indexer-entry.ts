import { getChainAmountIndexerId, getPriceIndexerId } from '@l2beat/config'
import {
  type CoingeckoPriceConfigEntry,
  type EscrowEntry,
  type TotalSupplyEntry,
} from '@l2beat/shared-pure'

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
