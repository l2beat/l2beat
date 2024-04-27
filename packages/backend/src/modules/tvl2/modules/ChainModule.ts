import { assert, Logger } from '@l2beat/backend-tools'
import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import {
  AmountConfigEntry,
  capitalizeFirstLetter,
  EscrowEntry,
  EthereumAddress,
  notUndefined,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { ChainTvlConfig, Tvl2Config } from '../../../config/Config'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { Configuration } from '../../../tools/uif/multi/types'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import {
  BlockTimestampIndexer,
  BlockTimestampProvider,
} from '../indexers/BlockTimestampIndexer'
import { ChainAmountIndexer } from '../indexers/ChainAmountIndexer'
import { ValueIndexer } from '../indexers/ValueIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { BlockTimestampRepository } from '../repositories/BlockTimestampRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
import { AmountService, ChainAmountConfig } from '../services/AmountService'
import { createAmountId } from '../utils/createAmountId'
import { createPriceId } from '../utils/createPriceId'
import { IdConverter } from '../utils/IdConverter'
import { SyncOptimizer } from '../utils/SyncOptimizer'
import { PriceModule } from './PriceModule'

interface ChainModule {
  start: () => Promise<void> | void
}

export function createChainModules(
  config: Tvl2Config,
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  idConverter: IdConverter,
): ChainModule[] {
  return config.chains
    .map((chain) =>
      createChainModule(
        chain,
        config.amounts,
        peripherals,
        logger,
        hourlyIndexer,
        syncOptimizer,
        indexerService,
        priceModule,
        idConverter,
      ),
    )
    .filter(notUndefined)
    .flat()
}

function createChainModule(
  chainConfig: ChainTvlConfig,
  amounts: AmountConfigEntry[],
  peripherals: Peripherals,
  logger: Logger,
  hourlyIndexer: HourlyIndexer,
  syncOptimizer: SyncOptimizer,
  indexerService: IndexerService,
  priceModule: PriceModule,
  idConverter: IdConverter,
): ChainModule | undefined {
  const name = `${capitalizeFirstLetter(chainConfig.chain)}TvlModule`
  if (!chainConfig.config) {
    logger.info(`${name} disabled`)
    return
  }
  logger = logger.tag(chainConfig.chain)

  const provider: BlockTimestampProvider =
    chainConfig.config.blockNumberProviderConfig.type === 'etherscan'
      ? peripherals.getClient(EtherscanClient, {
          apiKey: chainConfig.config.blockNumberProviderConfig.etherscanApiKey,
          url: chainConfig.config.blockNumberProviderConfig.etherscanApiUrl,
          minTimestamp: chainConfig.config.minBlockTimestamp,
          chainId: chainConfig.config.chainId,
        })
      : peripherals.getClient(BlockscoutClient, {
          url: chainConfig.config.blockNumberProviderConfig.blockscoutApiUrl,
          minTimestamp: chainConfig.config.minBlockTimestamp,
          chainId: chainConfig.config.chainId,
        })

  const blockTimestampIndexer = new BlockTimestampIndexer({
    logger,
    tag: chainConfig.chain,
    parents: [hourlyIndexer],
    minHeight: chainConfig.config.minBlockTimestamp.toNumber(),
    indexerService,
    chain: chainConfig.chain,
    blockTimestampProvider: provider,
    blockTimestampRepository: peripherals.getRepository(
      BlockTimestampRepository,
    ),
    syncOptimizer,
  })

  const rpcClient = peripherals.getClient(RpcClient, {
    url: chainConfig.config.providerUrl,
    callsPerMinute: chainConfig.config.providerCallsPerMinute,
  })
  const amountService = new AmountService({
    rpcClient: rpcClient,
    multicallClient: new MulticallClient(
      rpcClient,
      chainConfig.config.multicallConfig,
    ),
    logger: logger.tag(chainConfig.chain),
  })

  const escrowsAndTotalSupplies = amounts
    .filter((a) => a.chain === chainConfig.chain)
    .filter(
      (a): a is ChainAmountConfig =>
        a.type === 'escrow' || a.type === 'totalSupply',
    )

  const chainMinTimestamp = chainConfig.config.minBlockTimestamp

  const configurations: Configuration<EscrowEntry | TotalSupplyEntry>[] =
    escrowsAndTotalSupplies.map((a) => ({
      id: createAmountId(a),
      properties: a,
      minHeight: a.sinceTimestamp.lt(chainMinTimestamp)
        ? chainMinTimestamp.toNumber()
        : a.sinceTimestamp.toNumber(),
      maxHeight: a.untilTimestamp?.toNumber() ?? null,
    }))

  const chainAmountIndexer = new ChainAmountIndexer({
    logger,
    tag: chainConfig.chain,
    parents: [blockTimestampIndexer],
    indexerService,
    configurations,
    chain: chainConfig.chain,
    amountService,
    amountRepository: peripherals.getRepository(AmountRepository),
    blockTimestampsRepository: peripherals.getRepository(
      BlockTimestampRepository,
    ),
    encode,
    decode,
    syncOptimizer,
  })

  const perProject = groupBy(escrowsAndTotalSupplies, 'projectId')

  const valueIndexers: ValueIndexer[] = []

  for (const [project, amountConfigs] of Object.entries(perProject)) {
    const priceConfigs = amountConfigs.map((c) =>
      idConverter.getPriceConfigFromAmountConfig(c),
    )
    const priceIndexers = priceConfigs.map((c) => {
      const indexer = priceModule.indexers.get(createPriceId(c))
      assert(indexer)
      return indexer
    })

    const parents = [...priceIndexers, chainAmountIndexer]

    const indexer = new ValueIndexer({
      priceRepo: peripherals.getRepository(PriceRepository),
      amountRepo: peripherals.getRepository(AmountRepository),
      valueRepo: peripherals.getRepository(ValueRepository),
      priceConfigs,
      amountConfigs,
      project: ProjectId(project),
      dataSource: chainConfig.chain,
      syncOptimizer,
      parents,
      tag: `${project}_${chainConfig.chain}`,
      name: 'value_indexer',
      indexerService,
      logger,
      minHeight: amountConfigs
        .reduce(
          (prev, curr) => UnixTime.min(prev, curr.sinceTimestamp),
          amountConfigs[0].sinceTimestamp,
        )
        .toNumber(),
    })

    valueIndexers.push(indexer)
  }

  return {
    start: async () => {
      await blockTimestampIndexer.start()
      await chainAmountIndexer.start()

      for (const indexer of valueIndexers) {
        await indexer.start()
      }
    },
  }
}

function encode(value: EscrowEntry | TotalSupplyEntry): string {
  switch (value.type) {
    case 'escrow':
      return JSON.stringify({
        ...value,
        address: value.address.toString(),
        escrowAddress: value.escrowAddress.toString(),
        chain: value.chain,
        project: value.project.toString(),
        source: value.source,
        sinceTimestamp: value.sinceTimestamp.toNumber(),
        ...({ untilTimestamp: value.untilTimestamp?.toNumber() } ?? {}),
        includeInTotal: value.includeInTotal,
      })
    case 'totalSupply':
      return JSON.stringify({
        ...value,
        address: value.address.toString(),
        chain: value.chain,
        project: value.project.toString(),
        source: value.source,
        sinceTimestamp: value.sinceTimestamp.toNumber(),
        ...({ untilTimestamp: value.untilTimestamp?.toNumber() } ?? {}),
        includeInTotal: value.includeInTotal,
      })
  }
}

// TODO: validate the config with zod
function decode(value: string): EscrowEntry | TotalSupplyEntry {
  const obj = JSON.parse(value) as {
    type: string
    address: string
    escrowAddress: string | undefined
    chain: string
    project: string
    source: string
    sinceTimestamp: number
    untilTimestamp?: number
    includeInTotal: boolean
  }

  switch (obj.type) {
    case 'escrow':
      assert(obj.escrowAddress !== undefined, 'escrowAddress is required')
      return {
        address:
          obj.address === 'native' ? 'native' : EthereumAddress(obj.address),
        escrowAddress: EthereumAddress(obj.escrowAddress),
        chain: obj.chain,
        project: ProjectId(obj.project),
        source: obj.source,
        sinceTimestamp: new UnixTime(obj.sinceTimestamp),
        ...({
          untilTimestamp:
            obj.untilTimestamp && new UnixTime(obj.untilTimestamp),
        } ?? {}),
        includeInTotal: obj.includeInTotal,
      } as EscrowEntry
    case 'totalSupply':
      return {
        address:
          obj.address === 'native' ? 'native' : EthereumAddress(obj.address),
        chain: obj.chain,
        project: ProjectId(obj.project),
        source: obj.source,
        sinceTimestamp: new UnixTime(obj.sinceTimestamp),
        ...({
          untilTimestamp:
            obj.untilTimestamp && new UnixTime(obj.untilTimestamp),
        } ?? {}),
        includeInTotal: obj.includeInTotal,
      } as TotalSupplyEntry
    default:
      throw new Error('Unknown type')
  }
}
