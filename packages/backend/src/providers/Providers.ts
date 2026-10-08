import type { Logger } from '@l2beat/backend-tools'
import {
  BalanceProvider,
  BlockProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  CoingeckoQueryService,
  DaBeatStatsProvider,
  type DaBlobProvider,
  DaProvider,
  EthereumDaProvider,
  PriceProvider,
  SlotTimestampProvider,
  StarknetBalanceProvider,
  StarknetTotalSupplyProvider,
  SvmBlockProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { Config } from '../config'
import { BlobPriceProvider } from '../modules/tracked-txs/modules/l2-costs/BlobPriceProvider'
import { ActivityBlockProviders } from './ActivityBlockProviders'
import { AztecBlockProviders } from './AztecBlockProviders'
import { BlockProviders } from './BlockProviders'
import { type Clients, initClients } from './Clients'
import { DayProviders } from './day/DayProviders'
import { LogsProviders } from './LogsProviders'
import { SvmBlockProviders } from './SvmBlockProviders'
import { UopsAnalyzers } from './UopsAnalyzers'

export class Providers {
  block: BlockProviders
  activityBlock: ActivityBlockProviders
  logs: LogsProviders
  price: PriceProvider
  uops: UopsAnalyzers
  day: DayProviders
  circulatingSupply: CirculatingSupplyProvider
  da: DaProvider
  /** Ethereum blocks with their blob batches, from the RPC that follows the head */
  liveBlobsDa: EthereumDaProvider | undefined
  clients: Clients
  blockTimestamp: BlockTimestampProvider
  totalSupply: TotalSupplyProvider
  starknetTotalSupply: StarknetTotalSupplyProvider
  starknetBalance: StarknetBalanceProvider
  balance: BalanceProvider
  svmBlock: SvmBlockProviders
  aztecBlock: AztecBlockProviders
  slotTimestamp: SlotTimestampProvider
  daBeatStats: DaBeatStatsProvider
  blobPrice: BlobPriceProvider | undefined

  constructor(
    readonly config: Config,
    readonly logger: Logger,
  ) {
    this.clients = initClients(config, logger)
    const ethereumRpcClient = this.clients.rpcClients.find(
      (c) => c.chain === 'ethereum',
    )

    this.block = new BlockProviders(this.clients.block)
    this.logs = new LogsProviders(this.clients.logs)
    this.svmBlock = new SvmBlockProviders(this.clients.svmBlock)
    this.aztecBlock = new AztecBlockProviders(this.clients.aztecBlock)
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
    this.activityBlock = new ActivityBlockProviders(
      this.block,
      this.aztecBlock,
      this.uops,
    )
    this.day = new DayProviders(config.chainConfig, {
      starkex: this.clients.starkex,
      voyager: this.clients.voyager,
      lighter: this.clients.lighter,
    })

    const blobProviders: DaBlobProvider[] = []
    if (this.clients.beacon) {
      const ethereumRpc = this.clients.getRpcClient('ethereum')
      blobProviders.push(
        new EthereumDaProvider(this.clients.beacon, ethereumRpc, 'ethereum'),
      )
    }
    if (this.clients.beacon && this.clients.liveBlobsRpc) {
      this.liveBlobsDa = new EthereumDaProvider(
        this.clients.beacon,
        this.clients.liveBlobsRpc,
        'ethereum',
      )
    }
    this.da = new DaProvider(blobProviders)

    this.blockTimestamp = new BlockTimestampProvider({
      indexerClients: this.clients.indexer,
      blockProviders: [
        ...this.clients.block.map((c) => new BlockProvider(c.chain, [c])),
        ...this.aztecBlock.getAll(),
      ],
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
    this.starknetBalance = new StarknetBalanceProvider(
      this.clients.starknetClients,
      logger,
    )
    this.balance = new BalanceProvider(this.clients.rpcClients, logger)
    this.daBeatStats = new DaBeatStatsProvider(this.clients.beacon)

    if (ethereumRpcClient) {
      this.blobPrice = new BlobPriceProvider(logger, ethereumRpcClient)
    }
  }

  getPriceProviders() {
    assert(this.price, 'Price providers unintended access')
    return this.price
  }
}
