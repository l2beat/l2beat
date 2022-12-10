import { EthereumAddress } from '@l2beat/types'
import chalk from 'chalk'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
) {
  const maxAddresses = config.maxAddresses ?? 100
  const maxDepth = config.maxDepth ?? 6

  const resolved = new Map<EthereumAddress, AnalyzedData>()
  const known = new Set<EthereumAddress>()
  known.add(EthereumAddress.ZERO)
  for (const address of config.initialAddresses) {
    known.add(address)
  }

  let totalAddresses = 0

  const stack = [
    ...config.initialAddresses.map((address) => ({ address, depth: 0 })),
  ]
  while (stack.length !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { address, depth } = stack.pop()!

    if (address === EthereumAddress.ZERO || resolved.has(address)) {
      continue
    }

    const overrides = config.overrides?.[address.toString()]
    if (overrides?.ignoreDiscovery) {
      console.log('\nSkipping', address)
      continue
    }

    if (depth > maxDepth) {
      console.log('\nSkipping', address)
      console.log(
        '  Error:',
        chalk.red(`Depth ${depth} exceeded max = ${maxDepth}`),
      )
      continue
    }

    totalAddresses++
    if (totalAddresses > maxAddresses) {
      console.log('\nSkipping', address)
      console.log(
        '  Error:',
        chalk.red(
          `Total addresses ${totalAddresses} exceeded max = ${maxAddresses}`,
        ),
      )
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

    stack.push(...unknown.map((x) => ({ address: x, depth: depth + 1 })))
  }

  return [...resolved.values()]
}
