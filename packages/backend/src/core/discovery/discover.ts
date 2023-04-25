import { EthereumAddress } from '@l2beat/shared'

import { AddressAnalyzer, Analysis } from './analysis/AddressAnalyzer'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'
import { DiscoveryLogger } from './utils/DiscoveryLogger'

export async function discover(
  provider: DiscoveryProvider,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
) {
  const resolved = new Map<EthereumAddress, Analysis>()
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

    const contractOverrides = config.overrides.get(address)
    if (contractOverrides?.ignoreDiscovery) {
      logger.log(`Skipping ${address.toString()}`)
      logger.log('')

      continue
    }

    const sharedModule = config.getSharedModule(address)
    if (sharedModule) {
      logger.log(`Skipping shared module ${sharedModule}`)
      logger.log(`address: ${address.toString()}`)
      logger.log('')

      continue
    }

    if (depth > config.maxDepth) {
      logger.log(`Skipping ${address.toString()}`)
      logger.error(`Depth ${depth} exceeded max = ${config.maxDepth}`)
      logger.log('')

      continue
    }

    totalAddresses++
    if (totalAddresses > config.maxAddresses) {
      logger.log(`Skipping ${address.toString()}`)
      logger.error(
        `Total addresses ${totalAddresses} exceeded max = ${config.maxAddresses}`,
      )
      logger.log('')

      continue
    }
    logger.log(`Analyzing ${address.toString()}`)

    const proxyDetector = new ProxyDetector(provider, logger)
    const sourceCodeService = new SourceCodeService(provider)
    const handlerExecutor = new HandlerExecutor(provider, logger)
    const addressAnalyzer = new AddressAnalyzer(
      provider,
      proxyDetector,
      sourceCodeService,
      handlerExecutor,
      logger,
    )
    const { analysis, relatives } = await addressAnalyzer.analyze(
      address,
      contractOverrides,
    )
    resolved.set(address, analysis)

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

  return [...resolved.values()]
}
