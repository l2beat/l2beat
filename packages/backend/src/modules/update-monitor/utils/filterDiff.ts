import type { DiscoveryDiff } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export function filterDiff(
  diff: DiscoveryDiff[],
  unknownContracts: EthereumAddress[],
): DiscoveryDiff[] {
  return diff.filter((d) => {
    if (unknownContracts.includes(d.address)) {
      return false
    }
    if (d.type === 'created' || d.type === 'deleted') {
      return false
    }
    if (d.diff?.some((dd) => dd.key === 'errors')) {
      return false
    }
    return true
  })
}
