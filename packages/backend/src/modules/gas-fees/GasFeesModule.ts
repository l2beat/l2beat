import { DuneQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Clock } from '../../tools/Clock'
import { DailyIndexer } from '../../tools/DailyIndexer'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { GAS_FEES_CHAINS } from './fees/chains'
import { GasFeesDailyIndexer } from './fees/GasFeesDailyIndexer'
import { readFeesDays } from './fees/readFeesDays'
import { GasFeesTipIndexer } from './tips/GasFeesTipIndexer'
import { LiveTipsLoop } from './tips/LiveTipsLoop'
import { WalletTipsLoop } from './tips/WalletTipsLoop'

/** gas.fees trails by an hour or two. A chain that trails by more is filled in later */
const FEES_DELAY_SECONDS = 3 * UnixTime.HOUR
/**
 * The service gives up after 2 minutes by default, queueing included, without stopping the run on Dune:
 * a query slower than that would be billed and thrown away on every retry
 */
const DUNE_TIMEOUT_MS = 15 * 60_000
/** A minute or two old at most, in a few eth_feeHistory calls a minute */
const LIVE_TIPS_INTERVAL_MS = 15_000

export function createGasFeesModule({
  config,
  logger,
  clock,
  db,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.gasFees) {
    logger.info('GasFeesModule disabled')
    return
  }

  logger = logger.tag({ feature: 'gas-fees', module: 'gas-fees' })
  const duneClient = providers.clients.dune
  if (!duneClient) {
    throw new Error('gas-fees needs DUNE_API_KEY')
  }

  const { fees, historyFirstDay, walletServices } = config.gasFees
  const indexerService = new IndexerService(db)
  const dune = new DuneQueryService({
    logger,
    duneClient,
    timeoutMs: DUNE_TIMEOUT_MS,
  })
  const rpc = providers.clients.getRpcClient('ethereum')
  const blockFinder = providers.block.getBlockProvider('ethereum')
  // Each source has a day at its own delay, so each has its own day clock
  const dailyIndexer = (delaySeconds: number) =>
    new DailyIndexer(
      logger,
      new Clock(config.clock.minBlockTimestamp, delaySeconds),
    )
  const feesDays = dailyIndexer(FEES_DELAY_SECONDS)
  const hours = new HourlyIndexer(logger, clock)

  const feesIndexer = new GasFeesDailyIndexer(
    {
      parents: [feesDays],
      indexerService,
      firstDay: fees.firstDay,
      daysPerQuery: fees.daysPerQuery,
      chains: GAS_FEES_CHAINS,
      db,
      readFeesDays: (chains, fromDay, toDay) =>
        readFeesDays(dune, chains, fromDay, toDay),
    },
    logger,
  )
  const tipIndexer = new GasFeesTipIndexer(
    {
      parents: [hours],
      indexerService,
      // A day early: the daily statistics graded against these hours need the day before their first day
      firstHour: UnixTime(historyFirstDay - UnixTime.DAY),
      db,
      rpc,
      blockFinder,
    },
    logger,
  )
  const liveTipsLoop = new LiveTipsLoop(
    { db, rpc, intervalMs: LIVE_TIPS_INTERVAL_MS },
    logger,
  )
  const walletTipsLoop = new WalletTipsLoop({ db, rpc, walletServices }, logger)

  logger.info('Gas fees config loaded', {
    feesFirstDay: fees.firstDay,
    historyFirstDay,
    walletServices,
  })

  return {
    start: async () => {
      for (const indexer of [feesDays, hours, feesIndexer, tipIndexer]) {
        await indexer.start()
      }
      liveTipsLoop.start()
      walletTipsLoop.start()
    },
  }
}
