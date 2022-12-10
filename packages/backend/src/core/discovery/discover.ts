import { EthereumAddress } from '@l2beat/types'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
) {
  const resolved = new Map<EthereumAddress, AnalyzedData>()
  const known = new Set<EthereumAddress>()
  known.add(EthereumAddress.ZERO)

  const stack = [...config.initialAddresses]
  while (stack.length !== 0) {
    const address = stack.pop()

    if (!address || address === EthereumAddress.ZERO || resolved.has(address)) {
      continue
    }
    known.add(address)

    const overrides = config.overrides?.[address.toString()]
    if (overrides?.ignoreDiscovery) {
      continue
    }

    console.log('\nAnalyzing', address)
    const { analyzed, relatives } = await analyzeItem(provider, address, config)
    resolved.set(address, analyzed)

    const unknown = relatives.filter((x) => !known.has(x))
    if (unknown.length > 0) {
      console.log('  New relatives found:', unknown.length)
      for (const relative of unknown) {
        known.add(relative)
        console.log('    -', relative)
      }
    }

    stack.push(...unknown)
  }

  return [...resolved.values()]
}
