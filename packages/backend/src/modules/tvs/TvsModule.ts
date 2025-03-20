import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import type { Indexer } from '@l2beat/uif'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { SyncOptimizer } from '../tvl/utils/SyncOptimizer'
import { BlockTimestampIndexer } from './indexers/BlockTimestampIndexer'
import { CirculatingSupplyAmountIndexer } from './indexers/CirculatingSupplyAmountIndexer'
import {
  type OnchainAmountConfig,
  OnchainAmountIndexer,
} from './indexers/OnchainAmountIndexer'
import { TokenValueIndexer } from './indexers/TokenValueIndexer'
import { TvsPriceIndexer } from './indexers/TvsPriceIndexer'
import { ValueService } from './services/ValueService'
import { DBStorage } from './tools/DBStorage'
import { createAmountConfig } from './tools/extractPricesAndAmounts'

export function initTvsModule(
  config: Config,
  logger: Logger,
  database: Database,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvs) {
    logger.info('TvsModule disabled')
    return
  }

  logger = logger.tag({ feature: 'tvs', module: 'tvs' })

  logger.info(`TVS config loaded`, {
    projects: config.tvs.projects.length,
    prices: config.tvs.prices.length,
    amounts: config.tvs.amounts.length,
    chains: config.tvs.chains.length,
  })

  const syncOptimizer = new SyncOptimizer(clock)
  const indexerService = new IndexerService(database)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const priceIndexer = new TvsPriceIndexer({
    logger,
    parents: [hourlyIndexer],
    indexerService,
    configurations: config.tvs.prices.map((price) => ({
      // configurationId has to be 12 characters long so we cannot use the priceId directly
      id: price.id,
      minHeight: price.sinceTimestamp,
      maxHeight: price.untilTimestamp ?? null,
      properties: price,
    })),
    priceProvider: providers.price,
    syncOptimizer,
    db: database,
  })

  const amountIndexers = new Map<string, Indexer>()

  const circulatingSupplyIndexer = new CirculatingSupplyAmountIndexer({
    logger,
    parents: [hourlyIndexer],
    indexerService,
    configurations: config.tvs.amounts
      .filter((a) => a.type === 'circulatingSupply')
      .map((amount) => ({
        // configurationId has to be 12 characters long so we cannot use the priceId directly
        id: amount.id,
        minHeight: amount.sinceTimestamp,
        maxHeight: amount.untilTimestamp ?? null,
        properties: amount,
      })),
    circulatingSupplyProvider: providers.circulatingSupply,
    syncOptimizer,
    db: database,
  })
  amountIndexers.set('l2b-circulating-supply', circulatingSupplyIndexer)

  const blockTimestampIndexers: Indexer[] = []

  for (const chain of config.tvs.chains) {
    const blockTimestampIndexer = new BlockTimestampIndexer({
      syncOptimizer,
      blockTimestampProvider: providers.blockTimestamp,
      parents: [hourlyIndexer],
      indexerService,
      configurations: [
        {
          id: chain.configurationId,
          minHeight: chain.sinceTimestamp,
          maxHeight: chain.untilTimestamp ?? null,
          properties: chain,
        },
      ],
      db: database,
      logger,
    })
    blockTimestampIndexers.push(blockTimestampIndexer)

    const configurations = config.tvs.amounts.filter(
      (a) =>
        a.chain === chain.chainName &&
        (a.type === 'totalSupply' || a.type === 'balanceOfEscrow'),
    ) as OnchainAmountConfig[]

    const amountIndexer = new OnchainAmountIndexer({
      syncOptimizer,
      chain: chain.chainName,
      totalSupplyProvider: providers.totalSupply,
      balanceProvider: providers.balance,
      parents: [blockTimestampIndexer],
      indexerService,
      configurations: configurations.map((c) => ({
        id: createAmountConfig(c).id,
        minHeight: c.sinceTimestamp,
        maxHeight: c.untilTimestamp ?? null,
        properties: c,
      })),
      db: database,
      logger,
    })
    amountIndexers.set(chain.chainName, amountIndexer)
  }

  const tokenValueIndexers: Indexer[] = []

  for (const project of config.tvs.projects) {
    const amountss = project.amountSources.map((source) => {
      const indexer = amountIndexers.get(source)
      assert(indexer, `${project.projectId} no indexer found for ${source}`)
      return indexer
    })

    const dbStorage = new DBStorage(database, logger)
    // TODO: add since & until support to ValueService
    const valueService = new ValueService(dbStorage)

    const tokenValueIndexer = new TokenValueIndexer({
      syncOptimizer,
      valueService,
      dbStorage,
      project: project.projectId,
      maxTimestampsToProcessAtOnce: 500,
      parents: [priceIndexer, ...amountss],
      indexerService,
      configurations: project.tokens.map((t) => ({
        id: TokenValueIndexer.idToConfigurationId(t.id),
        // TODO: hangle this
        minHeight: 1742342400,
        // TODO: hangle this
        maxHeight: null,
        properties: t,
      })),
      db: database,
      logger,
    })

    tokenValueIndexers.push(tokenValueIndexer)
  }

  const start = async () => {
    await hourlyIndexer.start()
    await priceIndexer.start()

    for (const indexer of blockTimestampIndexers) {
      await indexer.start()
    }

    for (const indexer of Array.from(amountIndexers.values())) {
      await indexer.start()
    }

    for (const indexer of tokenValueIndexers) {
      await indexer.start()
    }
  }

  return {
    start,
  }
}
