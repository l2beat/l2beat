import type { Logger } from '@l2beat/backend-tools'
import {
  BlobClient,
  CelestiaApiClient,
  CoingeckoClient,
  type HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { assert, type UnixTime, unique } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import type { DiscoveryChainConfig } from '../../config/types'
import { getExplorerClient } from '../../utils/IEtherscanClient'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { DiscoveryCache } from './DiscoveryCache'
import { getBlockNumberTwoProviders } from './getBlockNumberTwoProviders'
import { HighLevelProvider } from './HighLevelProvider'
import type { IProvider, RawProviders } from './IProvider'
import { LowLevelProvider } from './LowLevelProvider'
import { MulticallClient } from './multicall/MulticallClient'
import { ReorgAwareCache } from './ReorgAwareCache'
import { type AllProviderStats, ProviderStats } from './Stats'

export class AllProviders {
  private config: Map<
    string,
    { config: DiscoveryChainConfig; providers: RawProviders }
  > = new Map()

  private inFlight: Map<string, Promise<HighLevelProvider>> = new Map()
  private lowLevelProviders: Map<string, LowLevelProvider> = new Map()
  private batchingAndCachingProviders: Map<string, BatchingAndCachingProvider> =
    new Map()
  private multicallClients: Map<string, MulticallClient> = new Map()
  private highLevelProviders: Map<string, HighLevelProvider> = new Map()

  constructor(
    chainConfigs: DiscoveryChainConfig[],
    http: HttpClient,
    private discoveryCache: DiscoveryCache,
    private logger: Logger,
  ) {
    for (const config of chainConfigs) {
      const baseProvider = new providers.StaticJsonRpcProvider(
        config.rpcUrl,
        config.chainId,
      )
      const eventProvider =
        config.eventRpcUrl === undefined
          ? baseProvider
          : new providers.StaticJsonRpcProvider(
              config.eventRpcUrl,
              config.chainId,
            )

      const etherscanClient = getExplorerClient(http, config.explorer, logger)
      let blobClient: BlobClient | undefined
      let celestiaApiClient: CelestiaApiClient | undefined

      const ethereumRpc = new RpcClient({
        url: config.rpcUrl,
        retryStrategy: 'SCRIPT',
        callsPerMinute: 60,
        chain: 'ethereum',
        logger,
        http,
      })

      if (config.beaconApiUrl) {
        blobClient = new BlobClient({
          beaconApiUrl: config.beaconApiUrl,
          logger,
          rpcClient: ethereumRpc,
          retryStrategy: 'SCRIPT',
          sourceName: 'beaconAPI',
          callsPerMinute: 60,
          http,
        })
      }

      if (config.celestiaApiUrl) {
        celestiaApiClient = new CelestiaApiClient({
          url: config.celestiaApiUrl,
          http,
          logger,
          sourceName: 'celestia-api',
          callsPerMinute: 300,
          retryStrategy: 'SCRIPT',
        })
      }

      const coingeckoClient = new CoingeckoClient({
        apiKey: config.coingeckoApiKey,
        logger,
        sourceName: 'coingecko',
        http,
        callsPerMinute: config.coingeckoApiKey ? 240 : 10,
        retryStrategy: 'RELIABLE',
      })

      this.config.set(config.name, {
        config,
        providers: {
          baseProvider,
          eventProvider,
          etherscanClient,
          blobClient,
          celestiaApiClient,
          coingeckoClient,
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

  get(chain: string, timestamp: UnixTime): Promise<IProvider> {
    const batchingAndCachingProvider = this.getBatchingAndCachingProvider(chain)
    const stateless = HighLevelProvider.createStateless(
      this,
      batchingAndCachingProvider,
      chain,
    )

    return this.getImplementation(
      chain,
      batchingAndCachingProvider,
      timestamp,
      () => stateless.getBlockNumberAtOrBefore(timestamp),
    )
  }

  async getByBlockNumber(
    chain: string,
    blockNumber: number,
  ): Promise<IProvider> {
    const batchingAndCachingProvider = this.getBatchingAndCachingProvider(chain)
    const stateless = HighLevelProvider.createStateless(
      this,
      batchingAndCachingProvider,
      chain,
    )

    const block = await stateless.getBlock(blockNumber)
    assert(
      block !== undefined,
      `Could not find block ${blockNumber} @ ${chain}`,
    )
    const timestamp = block.timestamp

    return this.getImplementation(
      chain,
      batchingAndCachingProvider,
      timestamp,
      () => new Promise((resolve) => resolve(blockNumber)),
    )
  }

  private getImplementation(
    chain: string,
    batchingAndCachingProvider: BatchingAndCachingProvider,
    timestamp: UnixTime,
    blockNumberGenerator: () => Promise<number>,
  ): Promise<IProvider> {
    const chainKey = encodeKey(chain, timestamp)
    const cached = this.highLevelProviders.get(chainKey)
    if (cached) return new Promise((resolve) => resolve(cached))

    const existing = this.inFlight.get(chainKey)
    if (existing) return existing

    const creation = (async () => {
      try {
        const blockNumber = await blockNumberGenerator()
        const provider = new HighLevelProvider(
          this,
          batchingAndCachingProvider,
          chain,
          timestamp,
          blockNumber,
        )
        // Double-check in case someone won the race while we awaited
        const prior = this.highLevelProviders.get(chainKey)
        if (prior) return prior
        this.highLevelProviders.set(chainKey, provider)
        return provider
      } finally {
        this.inFlight.delete(chainKey)
      }
    })()

    this.inFlight.set(chainKey, creation)
    return creation
  }

  getStats(): Record<string, AllProviderStats> {
    const chains = unique(
      [...this.highLevelProviders.keys()].map((key) => decodeKey(key)[0]),
    )

    const result: Record<string, AllProviderStats> = {}
    for (const chain of chains) {
      const highLevelMeasurements = [...this.highLevelProviders.keys()]
        .filter((key) => key.startsWith(chain))
        .map(
          (key) =>
            this.highLevelProviders.get(key)?.stats ?? new ProviderStats(),
        )
        .reduce((a, b) => ProviderStats.add(a, b), new ProviderStats())

      result[chain] = {
        highLevelMeasurements,
        cacheMeasurements:
          this.batchingAndCachingProviders.get(chain)?.stats ??
          new ProviderStats(),
        lowLevelMeasurements:
          this.lowLevelProviders.get(chain)?.stats ?? new ProviderStats(),
      }
    }

    return result
  }

  private getBatchingAndCachingProvider(
    chain: string,
  ): BatchingAndCachingProvider {
    const config = this.config.get(chain)
    assert(
      config !== undefined,
      `Chain [${chain}] has not been configured or is missing .env variables.`,
    )

    const lowLevelProvider =
      this.lowLevelProviders.get(chain) ??
      new LowLevelProvider(
        config.providers.baseProvider,
        config.providers.eventProvider,
        config.providers.etherscanClient,
        config.providers.coingeckoClient,
        config.providers.celestiaApiClient,
        config.providers.blobClient,
        this.logger,
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

    const batchingAndCachingProvider =
      this.batchingAndCachingProviders.get(chain) ??
      new BatchingAndCachingProvider(
        reorgAwareCache,
        lowLevelProvider,
        multicallClient,
        this.logger,
      )
    this.batchingAndCachingProviders.set(chain, batchingAndCachingProvider)
    return batchingAndCachingProvider
  }
}

function encodeKey(chain: string, timestamp: number) {
  return `${chain}:${timestamp}`
}

function decodeKey(key: string) {
  return key.split(':') as [string, number]
}
