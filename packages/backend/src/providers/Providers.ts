import type { Logger } from '@l2beat/backend-tools'
import {
  AvailDaProvider,
  CelestiaDaProvider,
  DaProvider,
  EthereumDaProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../config'
import { BlobProviders } from './BlobProviders'
import { BlockProviders } from './BlockProviders'
import {
  type CirculatingSupplyProviders,
  initCirculatingSupplyProviders,
} from './CirculatingSupplyProviders'
import { type Clients, initClients } from './Clients'
import { DayProviders } from './DayProviders'
import { type PriceProviders, initPriceProviders } from './PriceProviders'
import { UopsAnalyzers } from './UopsAnalyzers'

export class Providers {
  block: BlockProviders
  price: PriceProviders | undefined
  uops: UopsAnalyzers
  day: DayProviders
  circulatingSupply: CirculatingSupplyProviders | undefined
  blob: BlobProviders | undefined
  da: DaProvider
  clients: Clients

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.clients = initClients(config, logger)
    this.block = new BlockProviders(this.clients.block, this.clients.indexer)
    this.circulatingSupply = config.tvl
      ? initCirculatingSupplyProviders(this.clients.coingecko)
      : undefined
    this.price = config.tvl
      ? initPriceProviders(this.clients.coingecko)
      : undefined
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
