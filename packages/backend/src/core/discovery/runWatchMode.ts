import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { readDiscoveryResult, saveDiscoveryResult } from './fsDiscoveryResult'
import { ProviderWithCache } from './provider/ProviderWithCache'

export async function runWatchMode(
  provider: providers.AlchemyProvider,
  _etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)
  const discoveryResult = await readDiscoveryResult(config.project)
  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())
  const discoveryProvider = new ProviderWithCache(
    provider,
    blockNumber,
    undefined,
    discoveryResult,
  )

  const result = await discover(discoveryProvider, projectConfig)
  await saveDiscoveryResult(result, config.project, blockNumber, '_watched')
}
