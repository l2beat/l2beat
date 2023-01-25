import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryConfig } from '../../config/Config'
import { binSearch } from '../../tools/binSearch'
import { ConfigReader } from './ConfigReader'
import { discover } from './discover'
import { DiscoveryLogger } from './DiscoveryLogger'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { parseDiscoveryOutput } from './saveDiscoveryResult'
import { diffDiscovery } from './utils/diffDiscovery'

export async function findChange(
  provider: providers.AlchemyProvider,
  etherscanClient: MainnetEtherscanClient,
  configReader: ConfigReader,
  config: DiscoveryConfig,
) {
  const projectConfig = await configReader.readConfig(config.project)

  const blockNumber = config.blockNumber ?? (await provider.getBlockNumber())
  const lastDiscovery = await configReader.readDiscovery(config.project)

  const logger = DiscoveryLogger.SILENT

  async function checkIfNoChanges(blockNumber: number) {
    console.log('Checking block ', blockNumber)
    const discoveryProvider = new ProviderWithCache(
      provider,
      etherscanClient,
      blockNumber,
    )

    const discovered = await discover(discoveryProvider, projectConfig, logger)
    const parsedDiscovery = parseDiscoveryOutput(discovered)

    const diff = diffDiscovery(
      lastDiscovery.contracts,
      parsedDiscovery.contracts,
      projectConfig.overrides ?? {},
    )
    console.log(blockNumber, diff.length)

    return diff.length === 0
  }

  if(await checkIfNoChanges(blockNumber)) {
    console.log('No changes!')
    return
  }

  const result = await binSearch(
    lastDiscovery.blockNumber,
    blockNumber,
    checkIfNoChanges,
  )
  
  console.log('First change detected on block number', result)
}
