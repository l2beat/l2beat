import { EthereumAddress } from '@protocol-beat/types'
import { providers } from 'ethers'

import { ConfigReader } from '../../core/discovery/ConfigReader'
import { discover } from '../../core/discovery/discover'
import { DiscoveryLogger } from '../../core/discovery/DiscoveryLogger'
import { ProviderWithCache } from '../../core/discovery/provider/ProviderWithCache'
import { prepareDiscoveryFile } from '../../core/discovery/saveDiscoveryResult'
import { ProjectParameters } from '../../core/discovery/types'
import { MainnetEtherscanClient } from '../../peripherals/etherscan/MainnetEtherscanClient'
import { Logger } from '../../tools/Logger'

export class DiscoveryController {
  constructor(
    private readonly logger: Logger,
    private readonly ethereumProvider: providers.AlchemyProvider,
    private readonly etherscanClient: MainnetEtherscanClient,
    private readonly discoveryLogger: DiscoveryLogger,
    private readonly configReader: ConfigReader,
  ) {
    this.logger = this.logger.for(this)
  }

  async discover(
    addressOrProjectName: EthereumAddress | string,
    maxDepth?: number,
  ): Promise<ProjectParameters> {
    this.logger.info('Starting discovery for ', {
      address: addressOrProjectName.toString(),
    })

    if (!EthereumAddress.check(addressOrProjectName)) {
      return this.configReader.readDiscovery(addressOrProjectName)
    }

    const blockNumber = await this.ethereumProvider.getBlockNumber()
    const discoveryProvider = new ProviderWithCache(
      this.ethereumProvider,
      this.etherscanClient,
      blockNumber,
    )

    const projectConfig = this.configReader.defaultConfigForAddress(
      addressOrProjectName,
      maxDepth ?? 0,
    )

    const result = await discover(
      discoveryProvider,
      projectConfig,
      this.discoveryLogger,
    )

    return prepareDiscoveryFile(result)
  }
}
