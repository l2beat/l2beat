import type { Logger } from '@l2beat/backend-tools'
import {
  BlobClient,
  CelestiaApiClient,
  CoingeckoClient,
  type HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
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
        sourceName: 'ethereum',
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
        callsPerMinute: config.coingeckoApiKey ? 400 : 10,
        retryStrategy: 'SCRIPT',
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

  async get(chain: string, timestamp: UnixTime): Promise<IProvider> {
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

    const chainKey = `${chain}:${timestamp}`
    const blockNumber = await getBlockNumberForTimestamp(
      config.providers,
      timestamp,
    )
    const provider =
      this.highLevelProviders.get(chainKey) ??
      new HighLevelProvider(
        this,
        batchingAndCachingProvider,
        chain,
        timestamp,
        blockNumber,
      )
    this.highLevelProviders.set(chainKey, provider)

    return provider
  }

  getStats(chain: string): AllProviderStats {
    const highLevelMeasurements = [...this.highLevelProviders.keys()]
      .filter((key) => key.startsWith(chain))
      .map(
        (key) => this.highLevelProviders.get(key)?.stats ?? new ProviderStats(),
      )
      .reduce((a, b) => ProviderStats.add(a, b), new ProviderStats())

    return {
      highLevelMeasurements,
      cacheMeasurements:
        this.batchingAndCachingProviders.get(chain)?.stats ??
        new ProviderStats(),
      lowLevelMeasurements:
        this.lowLevelProviders.get(chain)?.stats ?? new ProviderStats(),
    }
  }
}

async function getBlockNumberForTimestamp(
  providers: RawProviders,
  timestamp: UnixTime,
): Promise<number> {
  try {
    return providers.etherscanClient.getBlockNumberAtOrBefore(timestamp)
  } catch {
    return getBlockNumberSwitching(
      timestamp,
      1, // NOTE(radomski): We don't support discovery on block 0, but assuming it's fine
      await providers.baseProvider.getBlockNumber(),
      async (blockNumber: number) =>
        (await providers.baseProvider.getBlock(blockNumber)).timestamp,
    )
  }
}

// TODO(radomski): Test and explain how it works
export async function getBlockNumberSwitching(
  timestamp: UnixTime,
  lhsBlock: number,
  rhsBlock: number,
  getBlockTimestamp: (number: number) => Promise<number>,
): Promise<number> {
  let [lhsTimestamp, rhsTimestamp] = await Promise.all([
    getBlockTimestamp(lhsBlock),
    getBlockTimestamp(rhsBlock),
  ])

  if (timestamp <= lhsTimestamp) return lhsBlock
  if (timestamp >= rhsTimestamp) return rhsBlock

  while (lhsBlock + 1 < rhsBlock) {
    const blockTime = (rhsTimestamp - lhsTimestamp) / (rhsBlock - lhsBlock)
    const blocksFromStart = Math.round(timestamp - lhsTimestamp / blockTime)
    const guessedBlockNumber = Math.max(
      lhsBlock + 1,
      Math.min(rhsBlock - 1, lhsBlock + blocksFromStart),
    )

    const guessedBlockTimestamp = await getBlockTimestamp(guessedBlockNumber)

    if (guessedBlockTimestamp <= timestamp) {
      lhsBlock = guessedBlockNumber
      lhsTimestamp = guessedBlockTimestamp
    } else {
      rhsBlock = guessedBlockNumber
      rhsTimestamp = guessedBlockTimestamp
    }

    const midBlockNumber = lhsBlock + Math.floor((rhsBlock - lhsBlock) / 2)
    const midTimestamp = await getBlockTimestamp(midBlockNumber)
    if (midTimestamp <= timestamp) {
      lhsBlock = midBlockNumber
      lhsTimestamp = midTimestamp
    } else {
      rhsBlock = midBlockNumber
      rhsTimestamp = midTimestamp
    }
  }

  return lhsBlock
}
