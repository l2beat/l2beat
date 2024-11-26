import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  HttpClient2,
  LoopringClient,
  RetryHandler,
  StarknetClient,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Config } from '../config'
import { BlobProviders, initBlobProviders } from './BlobProviders'
import { BlockProviders, initBlockProviders } from './BlockProviders'
import {
  CirculatingSupplyProviders,
  initCirculatingSupplyProviders,
} from './CirculatingSupplyProviders'
import { PriceProviders, initPriceProviders } from './PriceProviders'

export class Providers {
  block: BlockProviders
  price: PriceProviders | undefined
  circulatingSupply: CirculatingSupplyProviders | undefined
  blob: BlobProviders | undefined
  coingeckoClient: CoingeckoClient
  degateClient: LoopringClient
  loopringClient: LoopringClient
  starknetClient: StarknetClient

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    const http = new HttpClient2()
    this.coingeckoClient = new CoingeckoClient({
      apiKey: config.coingeckoApiKey,
      http,
      logger,
      rateLimiter: RateLimiter.COINGECKO(config.coingeckoApiKey),
      retryHandler: RetryHandler.RELIABLE_API(logger),
    })
    // TODO: refactor
    this.degateClient = new LoopringClient({
      url: 'https://v1-mainnet-backend.degate.com/order-book-api',
      type: 'degate3',
      http,
      logger,
      rateLimiter: new RateLimiter({ callsPerMinute: 60 }),
      retryHandler: RetryHandler.RELIABLE_API(logger),
    })
    this.loopringClient = new LoopringClient({
      url: 'https://api3.loopring.io/api/v3',
      type: 'loopring',
      http,
      logger,
      rateLimiter: new RateLimiter({ callsPerMinute: 60 }),
      retryHandler: RetryHandler.RELIABLE_API(logger),
    })
    this.starknetClient = new StarknetClient({
      url: 'https://starknet-mainnet.public.blastapi.io',
      http,
      logger,
      rateLimiter: new RateLimiter({ callsPerMinute: 60 }),
      retryHandler: RetryHandler.RELIABLE_API(logger),
    })
    this.block = initBlockProviders(config.chainConfig)
    this.circulatingSupply = config.tvl
      ? initCirculatingSupplyProviders(this.coingeckoClient)
      : undefined
    this.price = config.tvl
      ? initPriceProviders(this.coingeckoClient)
      : undefined
    this.blob = config.finality ? initBlobProviders(config.finality) : undefined
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }

  getCirculatingSupplyProviders() {
    assert(
      this.circulatingSupply,
      'Circulating Supply providers unintended access',
    )
    return this.circulatingSupply
  }

  getBlobProviders() {
    assert(this.blob, 'Blob providers unintended access')
    return this.blob
  }
}
