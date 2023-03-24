import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { DiscoveryLogger } from './DiscoveryLogger'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { saveDiscoveryResult } from './saveDiscoveryResult'
import { getDiscoveryConfigHash } from './utils/getDiscoveryConfigHash'

export async function runDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)
  const configHash = getDiscoveryConfigHash(projectConfig)

  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())

  const discoveryProvider = new ProviderWithCache(
    provider,
    etherscanClient,
    blockNumber,
  )

  const logger = new DiscoveryLogger({ enabled: true })

  const result = await discover(discoveryProvider, projectConfig, logger)
  await saveDiscoveryResult(result, projectConfig, blockNumber, configHash)
}
