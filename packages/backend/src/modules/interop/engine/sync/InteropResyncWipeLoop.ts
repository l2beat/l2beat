import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type { InteropEventStore } from '../capture/InteropEventStore'
import type {
  InteropEventSyncer,
  ResyncablePluginCluster,
} from './InteropEventSyncer'

export class InteropResyncWipeLoop extends TimeLoop {
  constructor(
    private readonly cluster: ResyncablePluginCluster,
    private readonly syncers: InteropEventSyncer[],
    private readonly store: InteropEventStore,
    private readonly db: Database,
    protected logger: Logger,
    intervalMs = 10000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    if (this.syncers.length === 0) {
      return
    }

    const syncStates = await this.db.interopPluginSyncState.findByPluginName(
      this.cluster.name,
    )
    if (syncStates.length === 0) {
      return
    }

    const statesByChain = new Map(
      syncStates.map((state) => [state.chain, state]),
    )

    const allWaitingForWipe = this.syncers.every((syncer) => syncer.waitingForWipe)
    const allWipeRequired = this.syncers.every(
      (syncer) => statesByChain.get(syncer.chain)?.wipeRequired === true,
    )

    if (!allWaitingForWipe || !allWipeRequired) {
      return
    }

    await this.db.transaction(async () => {
      await this.wipeClusterData()
      await this.db.interopPluginSyncState.updateByPluginName(
        this.cluster.name,
        {
          wipeRequired: false,
        },
      )
    })

    this.logger.info('Cluster data wiped for resync', {
      pluginName: this.cluster.name,
    })
  }

  private async wipeClusterData() {
    for (const plugin of this.cluster.plugins) {
      await this.db.interopMessage.deleteForPlugin(plugin.name)
      await this.db.interopTransfer.deleteForPlugin(plugin.name)
      await this.store.deleteAllForPlugin(plugin.name)
    }
  }
}
