import type { TvsToken } from '@l2beat/config'
import capitalize from 'lodash/capitalize'

export function categoryToLabel(category: TvsToken['category']) {
  switch (category) {
    case 'ether':
      return 'ETH & derivatives'
    case 'btc':
      return 'BTC & derivatives'
    case 'stablecoin':
      return 'Stablecoins'
    case 'other':
      return 'Others'
    case 'rwaPublic':
      return 'Public RWAs'
    case 'rwaRestricted':
      return 'Restricted RWAs'
    default:
      return capitalize(category)
  }
}
