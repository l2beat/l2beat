import { AddressAnalyzer } from '@l2beat/common'
import { constants, providers } from 'ethers'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryOptions } from './DiscoveryOptions'

export async function discover(
  provider: providers.Provider,
  addressAnalyzer: AddressAnalyzer,
  startingPoints: string[],
  options: DiscoveryOptions,
) {
  const resolved = new Map<string, AnalyzedData>()

  const stack = [...startingPoints]
  while (stack.length !== 0) {
    const address = stack.pop()
    if (
      !address ||
      address === constants.AddressZero ||
      resolved.has(address) ||
      options.skipAddresses.includes(address)
    ) {
      continue
    }
    const { analyzed, relatives } = await analyzeItem(
      provider,
      addressAnalyzer,
      address,
      options,
    )
    console.log('Analyzed', address)
    resolved.set(address, analyzed)
    stack.push(...relatives)
  }

  return [...resolved.values()]
}
