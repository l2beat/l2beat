import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/config.discovery'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { discover } from './engine/discover'
import { diffDiscovery } from './output/diffDiscovery'
import { diffToMessages } from './output/diffToMessages'
import { parseDiscoveryOutput } from './output/prepareDiscoveryFile'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { ProviderWithCache } from './provider/ProviderWithCache'
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

  const discoveryProvider = new ProviderWithCache(provider, etherscanClient)

  const logger = new DiscoveryLogger({ enabled: true })
  const result = await discover(
    discoveryProvider,
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
  projectConfig: DiscoveryConfig,
  blockNumber: number,
) {
  const discoveryProvider = new DiscoveryProvider(provider, etherscanClient)

  const result = await discover(
    discoveryProvider,
    projectConfig,
    DiscoveryLogger.SILENT,
    blockNumber,
  )

  return parseDiscoveryOutput(
    result,
    projectConfig,
    blockNumber,
    projectConfig.hash,
  )
}
