import type { Logger } from '@l2beat/backend-tools'
import {
  AvailDaProvider,
  BalanceProvider,
  BlockProvider,
  BlockTimestampProvider,
  CelestiaDaProvider,
  CirculatingSupplyProvider,
  CoingeckoQueryService,
  DaProvider,
  EthereumDaProvider,
  PriceProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../config'
import { BlobProviders } from './BlobProviders'
import { BlockProviders } from './BlockProviders'
import { type Clients, initClients } from './Clients'
import { DayProviders } from './DayProviders'
import { UopsAnalyzers } from './UopsAnalyzers'

export class Providers {
  block: BlockProviders
  price: PriceProvider
  uops: UopsAnalyzers
  day: DayProviders
  circulatingSupply: CirculatingSupplyProvider
  blob: BlobProviders | undefined
  da: DaProvider
  clients: Clients
  blockTimestamp: BlockTimestampProvider
  totalSupply: TotalSupplyProvider
  balance: BalanceProvider

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.clients = initClients(config, logger)
    this.block = new BlockProviders(this.clients.block, this.clients.indexer)
    this.circulatingSupply = new CirculatingSupplyProvider(
      new CoingeckoQueryService(
        this.clients.coingecko,
        logger.tag({ tag: 'circulatingSupplies' }),
      ),
    )
    this.price = new PriceProvider(
      new CoingeckoQueryService(
        this.clients.coingecko,
        logger.tag({ tag: 'prices' }),
      ),
    )
    this.uops = new UopsAnalyzers(config.chainConfig)
    this.day = new DayProviders(config.chainConfig, this.clients.starkex)
    this.blob =
      config.finality && this.clients.blob
        ? new BlobProviders(this.clients.blob)
        : undefined
    this.da = new DaProvider([
      ...this.clients.blobscan.map(
        (c) => new EthereumDaProvider(c.client, c.daLayer),
      ),
      ...this.clients.celestia.map(
        (c) => new CelestiaDaProvider(c.client, c.daLayer),
      ),
      ...this.clients.avail.map(
        (c) => new AvailDaProvider(c.client, c.daLayer),
      ),
    ])
    this.blockTimestamp = new BlockTimestampProvider({
      indexerClients: this.clients.indexer,
      blockProviders: this.clients.block.map(
        (c) => new BlockProvider(c.chain, [c]),
      ),
    })
    this.totalSupply = new TotalSupplyProvider(this.clients.rpcClients, logger)
    this.balance = new BalanceProvider(this.clients.rpcClients, logger)
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }

  getBlobProviders() {
    assert(this.blob, 'Blob providers unintended access')
    return this.blob
  }
}
