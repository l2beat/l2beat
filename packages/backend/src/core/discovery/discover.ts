import { EthereumAddress } from '@l2beat/types'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryOptions } from './DiscoveryOptions'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  startingPoints: EthereumAddress[],
  options: DiscoveryOptions,
) {
  const resolved = new Map<EthereumAddress, AnalyzedData>()

  const stack = [...startingPoints]
  while (stack.length !== 0) {
    const address = stack.pop()
    if (
      !address ||
      address === EthereumAddress.ZERO ||
      resolved.has(address) ||
      options.skipAddresses.includes(address)
    ) {
      continue
    }
    console.log('Analyzing', address)
    const { analyzed, relatives } = await analyzeItem(
      provider,
      address,
      options,
    )
    console.log('Analyzed', address)
    resolved.set(address, analyzed)
    stack.push(...relatives)
  }

  return [...resolved.values()]
}
