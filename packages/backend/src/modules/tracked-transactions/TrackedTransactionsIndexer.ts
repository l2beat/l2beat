import { Logger } from '@l2beat/backend-tools'
import { ChildIndexer } from '@l2beat/uif'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { HourlyIndexer } from '../liveness/HourlyIndexer'

export class TrackedTransactionsIndexer extends ChildIndexer {
  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly configs:
    private readonly bigQueryClient: BigQueryClient,

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
    throw new Error('Method not implemented.')
  }
  protected override invalidate(targetHeight: number): Promise<number> {
    throw new Error('Method not implemented.')
  }
}
