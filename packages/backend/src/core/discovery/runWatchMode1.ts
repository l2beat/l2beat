import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { LocalMetadataProvider } from './provider/MetadataProvider'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { readDiscoveryResult, saveDiscoveryResult } from './fsDiscoveryResult'

export async function runWatchMode(
  provider: providers.AlchemyProvider,
  _etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)
  const discoveryResult = await readDiscoveryResult(config.project)
  const metadataProvider = new LocalMetadataProvider(discoveryResult)
  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())
  const discoveryProvider = new ProviderWithCache(
    provider,
    metadataProvider,
    blockNumber,
  )

  const result = await discover(
    discoveryProvider,
    projectConfig,
    discoveryResult,
  )
  await saveDiscoveryResult(result, config.project, blockNumber, 'watch')
}
