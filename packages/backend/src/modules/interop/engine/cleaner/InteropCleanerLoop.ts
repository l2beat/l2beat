import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import { type InteropPlugins, pluginsAsClusters } from '../../plugins'
import type { InteropEventStore } from '../capture/InteropEventStore'

export class InteropCleanerLoop extends TimeLoop {
  constructor(
    private store: InteropEventStore,
    private db: Database,
    private plugins: InteropPlugins,
    protected logger: Logger,
    intervalMs = 20 * 60 * 1000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const now = UnixTime.now()

    const expiredEvents = await this.store.deleteExpired(now)
    const expiredMessages = await this.db.interopMessage.deleteBefore(
      now - 1 * UnixTime.DAY,
    )
    const expiredTransfers = await this.db.interopTransfer.deleteBefore(
      now - 1 * UnixTime.DAY,
    )
    const expiredPrices = await this.db.interopRecentPrices.deleteBefore(
      now - 7 * UnixTime.DAY,
    )

    const currentPluginNames = pluginsAsClusters(this.plugins.eventPlugins).map(
      (c) => c.name,
    )
    const orphanedSyncStates =
      await this.db.interopPluginSyncState.deleteNotInPluginNames(
        currentPluginNames,
      )
    const orphanedSyncedRanges =
      await this.db.interopPluginSyncedRange.deleteNotInPluginNames(
        currentPluginNames,
      )

    this.logger.info('Cleaning finished', {
      expiredEvents,
      expiredMessages,
      expiredTransfers,
      expiredPrices,
      orphanedSyncStates,
      orphanedSyncedRanges,
    })
  }
}
