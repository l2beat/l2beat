import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { saveDiscoveryResult } from './saveDiscoveryResult'

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
    etherscanClient,
    blockNumber,
  )

  const result = await discover(discoveryProvider, projectConfig)
  await saveDiscoveryResult(result, config.project, blockNumber)
}
