import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/config.discovery'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { discover } from './engine/discover'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { diffDiscovery } from './utils/diffDiscovery'
import { diffToMessages } from './utils/diffToMessages'
import { DiscoveryLogger } from './utils/DiscoveryLogger'
import { findDependents } from './utils/findDependants'
import {
  parseDiscoveryOutput,
  saveDiscoveryResult,
} from './utils/saveDiscoveryResult'

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

  const discoveryProvider = new ProviderWithCache(
    provider,
    etherscanClient,
    blockNumber,
  )

  const logger = new DiscoveryLogger({ enabled: true })
  const result = await discover(discoveryProvider, projectConfig, logger)
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
  projectConfig: DiscoveryConfig,
  blockNumber: number,
) {
  const discoveryProvider = new DiscoveryProvider(
    provider,
    etherscanClient,
    blockNumber,
  )

  const result = await discover(
    discoveryProvider,
    projectConfig,
    DiscoveryLogger.SILENT,
  )

  return parseDiscoveryOutput(
    result,
    projectConfig,
    blockNumber,
    projectConfig.hash,
  )
}
