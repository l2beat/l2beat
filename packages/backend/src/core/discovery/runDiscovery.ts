import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { saveDiscoveryResult } from './fsDiscoveryResult'
import { ProviderWithCache } from './provider/ProviderWithCache'

export async function runDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)
  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())
  const discoveryProvider = new ProviderWithCache(
    provider,
    blockNumber,
    etherscanClient,
  )

  const result = await discover(discoveryProvider, projectConfig)
  await saveDiscoveryResult(result, config.project, blockNumber)
}
