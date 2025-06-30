import type { Logger } from '@l2beat/backend-tools'
import {
  AvailDaProvider,
  BalanceProvider,
  BlockProvider,
  BlockTimestampProvider,
  CelestiaDaProvider,
  CirculatingSupplyProvider,
  CoingeckoQueryService,
  type DaBlobProvider,
  DaProvider,
  EthereumDaProvider,
  PriceProvider,
  SlotTimestampProvider,
  StarknetTotalSupplyProvider,
  SvmBlockProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../config'
import { BlockProviders } from './BlockProviders'
import { type Clients, initClients } from './Clients'
import { DayProviders } from './DayProviders'
import { LogsProviders } from './LogsProviders'
import { SvmBlockProviders } from './SvmBlockProviders'
import { UopsAnalyzers } from './UopsAnalyzers'

export class Providers {
  block: BlockProviders
  logs: LogsProviders
  price: PriceProvider
  uops: UopsAnalyzers
  day: DayProviders
  circulatingSupply: CirculatingSupplyProvider
  da: DaProvider
  clients: Clients
  blockTimestamp: BlockTimestampProvider
  totalSupply: TotalSupplyProvider
  starknetTotalSupply: StarknetTotalSupplyProvider
  balance: BalanceProvider
  svmBlock: SvmBlockProviders
  slotTimestamp: SlotTimestampProvider

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.clients = initClients(config, logger)
    this.block = new BlockProviders(this.clients.block)
    this.logs = new LogsProviders(this.clients.logs)
    this.svmBlock = new SvmBlockProviders(this.clients.svmBlock)
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

    const blobProviders: DaBlobProvider[] = []
    if (this.clients.beacon) {
      const ethereumRpc = this.clients.getRpcClient('ethereum')
      blobProviders.push(
        new EthereumDaProvider(this.clients.beacon, ethereumRpc, 'ethereum'),
      )
    }
    if (this.clients.celestia) {
      blobProviders.push(
        new CelestiaDaProvider(this.clients.celestia, 'celestia'),
      )
    }
    if (this.clients.avail) {
      blobProviders.push(new AvailDaProvider(this.clients.avail, 'avail'))
    }
    this.da = new DaProvider(blobProviders)

    this.blockTimestamp = new BlockTimestampProvider({
      indexerClients: this.clients.indexer,
      blockProviders: this.clients.block.map(
        (c) => new BlockProvider(c.chain, [c]),
      ),
    })

    this.slotTimestamp = new SlotTimestampProvider({
      svmBlockProviders: this.clients.svmBlock.map(
        (c) => new SvmBlockProvider(c.chain, [c]),
      ),
    })

    this.totalSupply = new TotalSupplyProvider(this.clients.rpcClients, logger)
    this.starknetTotalSupply = new StarknetTotalSupplyProvider(
      this.clients.starknetClients,
      logger,
    )
    this.balance = new BalanceProvider(this.clients.rpcClients, logger)
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }
}
