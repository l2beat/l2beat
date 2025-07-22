import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, notUndefined, UnixTime } from '@l2beat/shared-pure'
import type { Indexer } from '@l2beat/uif'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTimestampIndexer } from './indexers/BlockTimestampIndexer'
import { CirculatingSupplyAmountIndexer } from './indexers/CirculatingSupplyAmountIndexer'
import { OnchainAmountIndexer } from './indexers/OnchainAmountIndexer'
import { ProjectValueIndexer } from './indexers/ProjectValueIndexer'
import { TokenValueIndexer } from './indexers/TokenValueIndexer'
import { TvsPriceIndexer } from './indexers/TvsPriceIndexer'
import { ValueService } from './services/ValueService'
import { DBStorage } from './tools/DBStorage'
import {
  createAmountConfig,
  generateConfigurationId,
} from './tools/extractPricesAndAmounts'
import { getTokenSyncRange } from './tools/getTokenSyncRange'
import { SyncOptimizer } from './tools/SyncOptimizer'
import { isOnchainAmountConfig } from './types'

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

  logger.info('TVS config loaded', {
    projects: config.tvs.projects.length,
    prices: config.tvs.prices.length,
    amounts: config.tvs.amounts.length,
    chains: config.tvs.chains.length,
    maxSources: config.tvs.projects.reduce(
      (prev, curr) =>
        prev < curr.amountSources.length ? curr.amountSources.length : prev,
      0,
    ),
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
        // configurationId has to be 12 characters long so we cannot use the apiId directly
        id: amount.id,
        minHeight: amount.sinceTimestamp,
        maxHeight: amount.untilTimestamp ?? null,
        properties: amount,
      })),
    circulatingSupplyProvider: providers.circulatingSupply,
    syncOptimizer,
    db: database,
  })
  amountIndexers.set(
    CirculatingSupplyAmountIndexer.SOURCE(),
    circulatingSupplyIndexer,
  )

  const blockTimestampIndexers = new Map<string, Indexer>()

  for (const block of config.tvs.blockTimestamps) {
    const blockTimestampIndexer = new BlockTimestampIndexer({
      syncOptimizer,
      blockTimestampProvider: providers.blockTimestamp,
      parents: [hourlyIndexer],
      indexerService,
      configurations: [
        {
          id: block.configurationId,
          minHeight: block.sinceTimestamp,
          maxHeight: block.untilTimestamp ?? null,
          properties: block,
        },
      ],
      db: database,
      logger,
    })
    blockTimestampIndexers.set(block.chainName, blockTimestampIndexer)
  }

  const onchainAmounts = config.tvs.amounts.filter(isOnchainAmountConfig)

  for (const chain of config.tvs.chains) {
    const blockTimestampIndexer = blockTimestampIndexers.get(chain)
    assert(blockTimestampIndexer, `${chain}: No blockTimestampIndexer found`)

    const configurations = onchainAmounts.filter((a) => a.chain === chain)

    const amountIndexer = new OnchainAmountIndexer({
      syncOptimizer,
      chain: chain,
      totalSupplyProvider: providers.totalSupply,
      starknetTotalSupplyProvider: providers.starknetTotalSupply,
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
    amountIndexers.set(chain, amountIndexer)
  }

  const valueIndexers: Indexer[] = []

  for (const project of config.tvs.projects) {
    const dbStorage = new DBStorage(database, logger)
    const valueService = new ValueService(dbStorage, logger)

    const amountSources = project.amountSources.map((source) => {
      const indexer = amountIndexers.get(source)
      assert(indexer, `${project.projectId} no indexer found for ${source}`)
      return indexer
    })

    const tokensWithRanges = project.tokens.map((t) => {
      const { sinceTimestamp, untilTimestamp } = getTokenSyncRange(t)

      return {
        ...t,
        sinceTimestamp,
        untilTimestamp,
      }
    })

    const tokenValueIndexer = new TokenValueIndexer({
      syncOptimizer,
      valueService,
      dbStorage,
      project: project.projectId,
      maxTimestampsToProcessAtOnce: 500,
      parents: [priceIndexer, ...amountSources],
      indexerService,
      configurations: tokensWithRanges.map((t) => {
        return {
          id: TokenValueIndexer.idToConfigurationId(t),
          minHeight: t.sinceTimestamp,
          maxHeight: t.untilTimestamp ?? null,
          properties: t,
        }
      }),
      db: database,
      logger,
    })

    valueIndexers.push(tokenValueIndexer)

    const since = tokensWithRanges.reduce(
      (prev, curr) => (prev > curr.sinceTimestamp ? curr.sinceTimestamp : prev),
      Number.POSITIVE_INFINITY,
    )

    const hasUndefinedTimestamp = tokensWithRanges.some(
      (token) => token.untilTimestamp === undefined,
    )

    const until = hasUndefinedTimestamp
      ? null
      : tokensWithRanges
          .map((t) => t.untilTimestamp)
          .filter(notUndefined)
          .reduce((prev, curr) => (prev < curr ? curr : prev), UnixTime(0))

    const id = generateConfigurationId(
      [...tokensWithRanges]
        .sort((a, b) => a.id.localeCompare(b.id))
        .flatMap((t) => [
          TokenValueIndexer.idToConfigurationId(t),
          t.sinceTimestamp.toString(),
          t.untilTimestamp?.toString() ?? 'undefined',
        ]),
    )

    const projectValueIndexer = new ProjectValueIndexer({
      syncOptimizer,
      tokens: new Map(project.tokens.map((t) => [t.id, t])),
      maxTimestampsToProcessAtOnce: 500,
      parents: [tokenValueIndexer],
      indexerService,
      configurations: [
        {
          id,
          minHeight: since,
          maxHeight: until,
          properties: { project: project.projectId },
        },
      ],
      db: database,
      logger,
    })

    valueIndexers.push(projectValueIndexer)
  }

  const start = async () => {
    await hourlyIndexer.start()
    await priceIndexer.start()

    for (const indexer of Array.from(blockTimestampIndexers.values())) {
      await indexer.start()
    }

    for (const indexer of Array.from(amountIndexers.values())) {
      await indexer.start()
    }

    for (const indexer of valueIndexers) {
      await indexer.start()
    }
  }

  return {
    start,
  }
}
