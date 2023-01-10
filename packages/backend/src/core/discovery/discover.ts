import { EthereumAddress } from '@l2beat/types'

import { AnalyzedData, analyzeItem } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
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
      logger.log(`Skipping ${address.toString()}`)
      logger.log('')

      continue
    }

    if (depth > maxDepth) {
      logger.log(`Skipping ${address.toString()}`)
      logger.error(`Depth ${depth} exceeded max = ${maxDepth}`)
      logger.log('')

      continue
    }

    totalAddresses++
    if (totalAddresses > maxAddresses) {
      logger.log(`Skipping ${address.toString()}`)
      logger.error(
        `Total addresses ${totalAddresses} exceeded max = ${maxAddresses}`,
      )
      logger.log('')

      continue
    }
    logger.log(`Analyzing ${address.toString()}`)

    const { analyzed, relatives } = await analyzeItem(
      provider,
      address,
      config,
      logger,
    )
    resolved.set(address, analyzed)

    const unknown = relatives.filter((x) => !known.has(x))
    if (unknown.length > 0) {
      logger.log(`  New relatives found: ${unknown.length}`)

      for (const relative of unknown) {
        known.add(relative)
        logger.log(`    - ${relative.toString()}`)
      }
    }

    logger.log('')

    stack.push(...unknown.map((x) => ({ address: x, depth: depth + 1 })))
  }

  for (const override of Object.keys(config.overrides ?? {})) {
    if (!known.has(EthereumAddress(override))) {
      logger.configuredButUndiscovered(override.toString())
    }
  }

  return [...resolved.values()]
}
