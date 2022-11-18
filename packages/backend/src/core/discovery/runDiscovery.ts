import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'
import { DiscoveryConfig } from '../../config/Config'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { DiscoveryOptions } from './DiscoveryOptions'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { saveDiscoveryResult } from './saveDiscoveryResult'

export async function runDiscovery(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)
  const overrides = projectConfig.overrides ?? {}
  // Temporary mapping from new config structure to the old one
  const discoveryOptions: DiscoveryOptions = {
    skipAddresses: [],
    skipMethods: {},
    addAbis: {},
  }
  Object.keys(overrides).forEach((address) => {
    const ignoreMethods = overrides[address].ignoreMethods
    if (ignoreMethods) {
      discoveryOptions.skipMethods[address] = ignoreMethods
    }
  })

  const blockNumber =
    config.blockNumber ?? (await provider.getBlockNumber())

  const discoveryProvider = new ProviderWithCache(
    provider,
    etherscanClient,
    blockNumber,
  )

  const result = await discover(
    discoveryProvider,
    projectConfig.initialAddresses,
    discoveryOptions,
  )
  await saveDiscoveryResult(result, config.project, blockNumber)
}
