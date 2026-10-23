import type { Logger } from '@l2beat/backend-tools'
import type { SlotActivityConfig } from '@l2beat/config'
import type { SlotTimestampProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { Indexer, RootIndexer } from '@l2beat/uif'
import type { ActivityConfigProject } from '../../../config/Config'
import type { Clock } from '../../../tools/Clock'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { waitForTarget } from '../../../tools/waitForData'

export class SlotTargetIndexer extends RootIndexer {
  constructor(
    logger: Logger,
    private readonly clock: Clock,
    private readonly slotTimestampProvider: SlotTimestampProvider,
    private readonly config: ActivityConfigProject,
    private readonly options?: {
      onTick?: (targetTimestamp: number, slotTarget: number) => Promise<void>
      notReadyPollIntervalMs?: number
    },
  ) {
    super(
      logger.tag({
        tag: config.id,
        project: config.id,
        chain: config.chainName,
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
    return await withCoreFeatureRpcMetricsContext(
      'activity.target',
      {
        chain: this.config.chainName,
        mode: 'slot',
      },
      async () => {
        const timestamp = this.clock.getLastHour()
        this.logger.info('Getting slot number for timestamp', { timestamp })

        assert(
          this.config.activityConfig.type === 'slot',
          'SlotTargetIndexer should only be used for slot activity',
        )

        const slotNumber = await waitForTarget(
          () =>
            this.slotTimestampProvider.getSlotNumberAtOrBefore(
              timestamp,
              this.config.chainName,
              (this.config.activityConfig as SlotActivityConfig).startSlot,
            ),
          {
            logger: this.logger,
            chain: this.config.chainName,
            timestamp,
            pollIntervalMs: this.options?.notReadyPollIntervalMs,
          },
        )

        await this.options?.onTick?.(timestamp, slotNumber)

        return slotNumber
      },
    )
  }
}
