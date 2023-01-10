import { EthereumAddress } from '@l2beat/types'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
  discoveryLogger: DiscoveryLogger,
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
    ...config.initialAddresses
      .map((address) => ({ address, depth: 0 }))
      .reverse(),
  ]
  while (stack.length !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { address, depth } = stack.pop()!

    if (address === EthereumAddress.ZERO || resolved.has(address)) {
      continue
    }

    const overrides = config.overrides?.[address.toString()]
    if (overrides?.ignoreDiscovery) {
      discoveryLogger.log(`Skipping ${address.toString()}`)
      discoveryLogger.log('')

      continue
    }

    if (depth > maxDepth) {
      discoveryLogger.log(`Skipping ${address.toString()}`)
      discoveryLogger.red(`  Error: Depth ${depth} exceeded max = ${maxDepth}`)
      discoveryLogger.log('')

      continue
    }

    totalAddresses++
    if (totalAddresses > maxAddresses) {
      discoveryLogger.log(`Skipping ${address.toString()}`)
      discoveryLogger.red(
        `  Error: Total addresses ${totalAddresses} exceeded max = ${maxAddresses}`,
      )
      discoveryLogger.log('')

      continue
    }
    discoveryLogger.log(`Analyzing ${address.toString()}`)

    const { analyzed, relatives } = await analyzeItem(
      provider,
      address,
      config,
      discoveryLogger,
    )
    resolved.set(address, analyzed)

    const unknown = relatives.filter((x) => !known.has(x))
    if (unknown.length > 0) {
      discoveryLogger.log(`  New relatives found: ${unknown.length}`)

      for (const relative of unknown) {
        known.add(relative)
        discoveryLogger.log(`    - ${relative.toString()}`)
      }
    }

    discoveryLogger.log('')

    stack.push(...unknown.map((x) => ({ address: x, depth: depth + 1 })))
  }

  for (const override of Object.keys(config.overrides ?? {})) {
    if (!known.has(EthereumAddress(override))) {
      discoveryLogger.red(
        `Override for ${override.toString()} was configured, but the address wasn't discovered!`,
      )
    }
  }

  return [...resolved.values()]
}
