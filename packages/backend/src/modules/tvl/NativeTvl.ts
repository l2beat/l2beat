import { Logger } from '@l2beat/shared'

import { NMVUpdater } from '../../core/assets/'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createNativeTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  logger: Logger,
  clock: Clock,
): TvlSubmodule | undefined {
  // #region updaters

  const nmvUpdater = new NMVUpdater(
    priceUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    logger,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('NativeTvlModule')
    logger.info('Starting')

    await nmvUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [nmvUpdater],
    start,
  }
}
