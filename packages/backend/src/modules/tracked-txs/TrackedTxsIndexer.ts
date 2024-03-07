import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer } from '@l2beat/uif'

import { HourlyIndexer } from './HourlyIndexer'
import { TrackedTxsConfigEntry } from './types/TrackedTxsConfig'
import { TxUpdaterInterface } from './types/TxUpdaterInterface'
import { TrackedTxsClient } from './utils/TrackedTxsClient'

export class TrackedTxsIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly configs: TrackedTxsConfigEntry[],
    private readonly trackedTxsClient: TrackedTxsClient,
    private readonly updaters: TxUpdaterInterface[],
  ) {
    super(logger, [parentIndexer])
  }

  override getSafeHeight(): Promise<number> {
    throw new Error('Method not implemented.')
  }
  protected override setSafeHeight(height: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
  protected override update(from: number, to: number): Promise<number> {
    // 1. check config diffs
    // 2. delete outdated config records from database (tracked_transcations_configuration)
    // 3. add new ones
    // ^ probably in initialize fn
    // 4. get all transactions that are tracked
    // 5. update via updaters
    this.updaters.forEach((updater) => updater.update())
    throw new Error('Method not implemented.')
  }
  protected override invalidate(targetHeight: number): Promise<number> {
    throw new Error('Method not implemented.')
  }
}
