import { EthereumAddress } from '@l2beat/types'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
) {
  const resolved = new Map<EthereumAddress, AnalyzedData>()

  const stack = [...config.initialAddresses]
  while (stack.length !== 0) {
    const address = stack.pop()

    if (!address || address === EthereumAddress.ZERO || resolved.has(address)) {
      continue
    }
    const overrides = config.overrides?.[address.toString()]
    if (overrides?.ignoreDiscovery) {
      continue
    }

    console.log('Analyzing', address)
    const { analyzed, relatives } = await analyzeItem(provider, address, config)
    console.log('Analyzed', address)
    resolved.set(address, analyzed)
    stack.push(...relatives)
  }

  return [...resolved.values()]
}
