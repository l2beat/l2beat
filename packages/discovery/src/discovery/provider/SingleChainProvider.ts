import { assert } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { HttpClient } from '../../utils/HttpClient'
import {
  ExplorerConfig,
  IEtherscanClient,
  getExplorerClient,
} from '../../utils/IEtherscanClient'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import { HighLevelProvider } from './HighLevelProvider'
import { IProvider } from './IProvider'
import { LowLevelProvider } from './LowLevelProvider'
import { DiscoveryCache, ReorgAwareCache } from './ReorgAwareCache'
import { MulticallClient } from './multicall/MulticallClient'
import { getMulticall3Config } from './multicall/MulticallConfig'

// NOTE(radomski): Since the assumption is that there always is a chain that
// we're working on in the IProvider abstraction and this class works on an
// rpcUrl without knowing what chain it actually is underneath we need to
// create a _virtual_ chain. Ideally the user should never try to switch the
// used chain so we can just assert that the used chain is always the magic
// one. This class is written with the assumption that it's used from a place
// that only operates on a rpcUrl. An example would be l2b - which is a cli
// application.
const MAGIC_CHAIN = 'ThisIsAMagicChainThatDoesNotExist'

export class SingleChainProvider {
  private lowLevelProviders: Map<string, LowLevelProvider> = new Map()
  private batchingAndCachingProviders: Map<string, BatchingAndCachingProvider> =
    new Map()
  private multicallClients: Map<string, MulticallClient> = new Map()
  private highLevelProviders: Map<string, HighLevelProvider> = new Map()
  private baseProvider: providers.JsonRpcProvider
  private etherscanClient: IEtherscanClient

  constructor(
    rpcUrl: string,
    explorer: ExplorerConfig,
    httpClient: HttpClient,
    private discoveryCache: DiscoveryCache,
  ) {
    this.baseProvider = new providers.StaticJsonRpcProvider(rpcUrl)
    this.etherscanClient = getExplorerClient(httpClient, explorer)
  }

  async init(): Promise<IProvider> {
    const blockNumber = await this.baseProvider.getBlockNumber()
    return this.get(MAGIC_CHAIN, blockNumber)
  }

  get(chain: string, blockNumber: number): IProvider {
    assert(chain === MAGIC_CHAIN)
    const lowLevelProvider =
      this.lowLevelProviders.get(chain) ??
      new LowLevelProvider(
        this.baseProvider,
        this.baseProvider,
        this.etherscanClient,
      )
    this.lowLevelProviders.set(chain, lowLevelProvider)

    const reorgAwareCache = new ReorgAwareCache(
      this.discoveryCache,
      lowLevelProvider,
      chain,
    )

    const uncallableMulticallConfig = getMulticall3Config(
      Number.MAX_SAFE_INTEGER,
    )

    const multicallClient =
      this.multicallClients.get(chain) ??
      new MulticallClient(lowLevelProvider, uncallableMulticallConfig)
    this.multicallClients.set(chain, multicallClient)

    const batchingAndCachingProvider =
      this.batchingAndCachingProviders.get(chain) ??
      new BatchingAndCachingProvider(
        reorgAwareCache,
        lowLevelProvider,
        multicallClient,
      )
    this.batchingAndCachingProviders.set(chain, batchingAndCachingProvider)

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
