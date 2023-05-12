import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/config.discovery'
import { AddressAnalyzer } from './analysis/AddressAnalyzer'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { diffDiscovery } from './output/diffDiscovery'
import { diffToMessages } from './output/diffToMessages'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'
import { findDependents } from './utils/findDependents'

export async function runDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)

  const blockNumber =
    config.blockNumber ??
    (config.dev
      ? (await configReader.readDiscovery(config.project)).blockNumber
      : await provider.getBlockNumber())

  const logger = new DiscoveryLogger({ enabled: true })
  const result = await discover(
    provider,
    etherscanClient,
    projectConfig,
    logger,
    blockNumber,
  )
  await saveDiscoveryResult(
    result,
    projectConfig,
    blockNumber,
    projectConfig.hash,
  )
}

export async function dryRunDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
) {
  const blockNumber = await provider.getBlockNumber()
  const BLOCKS_PER_DAY = 86400 / 12
  const blockNumberYesterday = blockNumber - BLOCKS_PER_DAY

  const projectConfig = await configReader.readConfig(config.project)

  const [discovered, discoveredYesterday] = await Promise.all([
    justDiscover(provider, etherscanClient, projectConfig, blockNumber),
    justDiscover(
      provider,
      etherscanClient,
      projectConfig,
      blockNumberYesterday,
    ),
  ])

  const diff = diffDiscovery(
    discoveredYesterday.contracts,
    discovered.contracts,
    projectConfig,
  )

  if (diff.length > 0) {
    const messages = diffToMessages(
      projectConfig.name,
      await findDependents(projectConfig.name, configReader),
      diff,
    )
    for (const message of messages) {
      console.log(message)
    }
  } else {
    console.log('No changes!')
  }
}

async function justDiscover(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  config: DiscoveryConfig,
  blockNumber: number,
) {
  const result = await discover(
    provider,
    etherscanClient,
    config,
    DiscoveryLogger.SILENT,
    blockNumber,
  )
  return toDiscoveryOutput(config.name, config.hash, blockNumber, result)
}

export async function discover(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
  blockNumber: number,
) {
  const discoveryProvider = new ProviderWithCache(provider, etherscanClient)
  const proxyDetector = new ProxyDetector(discoveryProvider, logger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const handlerExecutor = new HandlerExecutor(discoveryProvider, logger)
  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    logger,
  )
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return discoveryEngine.discover(config, blockNumber)
}
