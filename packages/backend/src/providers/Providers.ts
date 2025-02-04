import type { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../config'
import { BlobProviders } from './BlobProviders'
import { BlockProviders } from './BlockProviders'
import {
  type CirculatingSupplyProviders,
  initCirculatingSupplyProviders,
} from './CirculatingSupplyProviders'
import { type Clients, initClients } from './Clients'
import { DaProviders } from './DaProviders'
import { type PriceProviders, initPriceProviders } from './PriceProviders'

export class Providers {
  block: BlockProviders
  price: PriceProviders | undefined
  circulatingSupply: CirculatingSupplyProviders | undefined
  blob: BlobProviders | undefined
  da: DaProviders | undefined
  clients: Clients

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.clients = initClients(config, logger)
    this.block = new BlockProviders(
      this.clients.block,
      this.clients.starkex,
      this.clients.indexer,
    )
    this.circulatingSupply = config.tvl
      ? initCirculatingSupplyProviders(this.clients.coingecko)
      : undefined
    this.price = config.tvl
      ? initPriceProviders(this.clients.coingecko)
      : undefined
    this.blob =
      config.finality && this.clients.blob
        ? new BlobProviders(this.clients.blob)
        : undefined
    this.da =
      config.da && this.clients.blobscan
        ? new DaProviders(this.clients.blobscan)
        : undefined
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

  getDaProviders() {
    assert(this.da, 'Da providers unintended access')
    return this.da
  }
}
