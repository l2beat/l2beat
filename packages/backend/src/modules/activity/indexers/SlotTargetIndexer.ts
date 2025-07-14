import type { Logger } from '@l2beat/backend-tools'
import type { SlotActivityConfig } from '@l2beat/config'
import type { SlotTimestampProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'

export class SlotTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly slotTimestampProvider: SlotTimestampProvider,
    private readonly config: ActivityConfigProject,
  ) {
    super(
      logger.tag({
        tag: config.id,
        project: config.id,
      }),
      {
        tickRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
    )
  }

  override initialize() {
    this.clock.onNewHour(() => this.requestTick())
    this.requestTick()
    return Promise.resolve(undefined)
  }

  async tick(): Promise<number> {
    const timestamp = this.clock.getLastHour()
    this.logger.info('Getting slot number for timestamp', { timestamp })

    assert(
      this.config.activityConfig.type === 'slot',
      'SlotTargetIndexer should only be used for slot activity',
    )

    return await this.slotTimestampProvider.getSlotNumberAtOrBefore(
      timestamp,
      this.config.chainName,
      (this.config.activityConfig as SlotActivityConfig).startSlot,
    )
  }
}
