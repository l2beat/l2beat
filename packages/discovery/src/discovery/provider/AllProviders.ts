import { assert } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { DiscoveryChainConfig } from '../../config/types'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { HttpClient } from '../../utils/HttpClient'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import { HighLevelProvider } from './HighLevelProvider'
import { IProvider, RawProviders } from './IProvider'
import { LowLevelProvider } from './LowLevelProvider'
import { DiscoveryCache, ReorgAwareCache } from './ReorgAwareCache'
import { getBlockNumberTwoProviders } from './getBlockNumberTwoProviders'
import { MulticallClient } from './multicall/MulticallClient'

export class AllProviders {
  private config: Map<
    string,
    { config: DiscoveryChainConfig; providers: RawProviders }
  > = new Map()

  private lowLevelProviders: Map<string, LowLevelProvider> = new Map()
  private multicallClients: Map<string, MulticallClient> = new Map()
  private highLevelProviders: Map<string, HighLevelProvider> = new Map()

  constructor(
    chainConfigs: DiscoveryChainConfig[],
    httpClient: HttpClient,
    private discoveryCache: DiscoveryCache,
  ) {
    for (const config of chainConfigs) {
      const baseProvider = new providers.StaticJsonRpcProvider(config.rpcUrl)
      const eventProvider =
        config.eventRpcUrl === undefined
          ? baseProvider
          : new providers.StaticJsonRpcProvider(config.eventRpcUrl)
      const etherscanLikeClient = EtherscanLikeClient.createForDiscovery(
        httpClient,
        config.etherscanUrl,
        config.etherscanApiKey,
        config.etherscanUnsupported,
      )

      this.config.set(config.name, {
        config,
        providers: {
          baseProvider,
          eventProvider,
          etherscanLikeClient,
        },
      })
    }
  }

  getLatestBlockNumber(chain: string): Promise<number> {
    const config = this.config.get(chain)
    assert(config !== undefined, `Unknown chain: ${chain}`)
    return getBlockNumberTwoProviders(
      config.providers.baseProvider,
      config.providers.eventProvider,
    )
  }

  get(chain: string, blockNumber: number): IProvider {
    const config = this.config.get(chain)
    assert(config !== undefined, `Unknown chain: ${chain}`)

    const lowLevelProvider =
      this.lowLevelProviders.get(chain) ??
      new LowLevelProvider(
        config.providers.baseProvider,
        config.providers.eventProvider,
        config.providers.etherscanLikeClient,
      )
    this.lowLevelProviders.set(chain, lowLevelProvider)

    const reorgAwareCache = new ReorgAwareCache(
      this.discoveryCache,
      lowLevelProvider,
      chain,
    )

    const multicallClient =
      this.multicallClients.get(chain) ??
      new MulticallClient(lowLevelProvider, config.config.multicall)
    this.multicallClients.set(chain, multicallClient)

    const batchingAndCachingProvider = new BatchingAndCachingProvider(
      reorgAwareCache,
      lowLevelProvider,
      multicallClient,
    )

    const chainKey = `${chain}:${blockNumber}`
    const provider =
      this.highLevelProviders.get(chainKey) ??
      new HighLevelProvider(
        this,
        batchingAndCachingProvider,
        chain,
        blockNumber,
      )
    this.highLevelProviders.set(chainKey, provider)

    return provider
  }
}
