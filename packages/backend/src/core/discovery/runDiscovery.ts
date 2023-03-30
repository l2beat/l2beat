import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/config.discovery'
import { ConfigReader } from './config/ConfigReader'
import { discover } from './discover'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { DiscoveryLogger } from './utils/DiscoveryLogger'
import { saveDiscoveryResult } from './utils/saveDiscoveryResult'

export async function runDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)

  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())

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
