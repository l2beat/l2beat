import type { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type { InteropNotifier } from '../notifications/InteropNotifier'
import type { InteropEventSyncer } from './InteropEventSyncer'

export const STALL_ALERT_AFTER = 30 * UnixTime.MINUTE

type WatchedSyncer = Pick<
  InteropEventSyncer,
  'cluster' | 'chain' | 'failingSince'
>

export class InteropSyncerStallAlerter extends TimeLoop {
  // Syncer -> failingSince that was alerted on
  private readonly alerted = new Map<WatchedSyncer, UnixTime>()

  constructor(
    private readonly syncers: WatchedSyncer[],
    private readonly notifier: Pick<
      InteropNotifier,
      'notifyStalledSyncers' | 'notifyRecoveredSyncers'
    >,
    protected logger: Logger,
    intervalMs = 60_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  run() {
    const now = UnixTime.now()
    const stalled = []
    const recovered = []

    for (const syncer of this.syncers) {
      const alertedSince = this.alerted.get(syncer)
      // A different start means the alerted run ended, even between two polls
      if (alertedSince !== undefined && syncer.failingSince !== alertedSince) {
        this.alerted.delete(syncer)
        recovered.push(toNotification(syncer, alertedSince))
      }
      if (
        !this.alerted.has(syncer) &&
        syncer.failingSince !== undefined &&
        now - syncer.failingSince >= STALL_ALERT_AFTER
      ) {
        this.alerted.set(syncer, syncer.failingSince)
        stalled.push(toNotification(syncer, syncer.failingSince))
      }
    }

    // Recoveries first, so the latest message matches the current state
    this.notifier.notifyRecoveredSyncers(recovered)
    this.notifier.notifyStalledSyncers(stalled)
    return Promise.resolve()
  }
}

function toNotification(syncer: WatchedSyncer, failingSince: UnixTime) {
  return { cluster: syncer.cluster.name, chain: syncer.chain, failingSince }
}
