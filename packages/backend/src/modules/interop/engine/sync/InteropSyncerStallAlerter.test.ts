import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type {
  InteropNotifier,
  InteropSyncerNotification,
} from '../notifications/InteropNotifier'
import type { InteropEventSyncer } from './InteropEventSyncer'
import {
  InteropSyncerStallAlerter,
  STALL_ALERT_AFTER,
} from './InteropSyncerStallAlerter'

describe(InteropSyncerStallAlerter.name, () => {
  it('alerts once on syncers failing for longer than the threshold', async () => {
    const stalledSince = UnixTime.now() - STALL_ALERT_AFTER - 1
    const stalled = syncer('wormhole', 'monad', stalledSince)
    const recent = syncer('wormhole', 'base', UnixTime.now())
    const healthy = syncer('wormhole', 'ethereum', undefined)
    const notifier = mockNotifier()
    const alerter = new InteropSyncerStallAlerter(
      [stalled, recent, healthy],
      notifier,
      Logger.SILENT,
    )

    await alerter.run()
    await alerter.run()

    expect(notifier.notifyStalledSyncers).toHaveBeenNthCalledWith(1, [
      { cluster: 'wormhole', chain: 'monad', failingSince: stalledSince },
    ])
    expect(notifier.notifyStalledSyncers).toHaveBeenNthCalledWith(2, [])
    expect(notifier.notifyRecoveredSyncers).toHaveBeenNthCalledWith(2, [])
  })

  it('reports an alerted syncer once it stops failing', async () => {
    const stalledSince = UnixTime.now() - STALL_ALERT_AFTER
    const stalled = syncer('wormhole', 'monad', stalledSince)
    const notifier = mockNotifier()
    const alerter = new InteropSyncerStallAlerter(
      [stalled],
      notifier,
      Logger.SILENT,
    )

    await alerter.run()
    stalled.failingSince = undefined
    await alerter.run()
    await alerter.run()

    expect(notifier.notifyRecoveredSyncers).toHaveBeenNthCalledWith(2, [
      { cluster: 'wormhole', chain: 'monad', failingSince: stalledSince },
    ])
    expect(notifier.notifyRecoveredSyncers).toHaveBeenNthCalledWith(3, [])
  })

  it('reports a recovery and a new stall when a syncer fails again between polls', async () => {
    const firstSince = UnixTime.now() - 2 * STALL_ALERT_AFTER
    const secondSince = UnixTime.now() - STALL_ALERT_AFTER
    const stalled = syncer('wormhole', 'monad', firstSince)
    const notifier = mockNotifier()
    const alerter = new InteropSyncerStallAlerter(
      [stalled],
      notifier,
      Logger.SILENT,
    )

    await alerter.run()
    stalled.failingSince = secondSince
    await alerter.run()

    expect(notifier.calls.slice(2)).toEqual([
      [
        'recovered',
        [{ cluster: 'wormhole', chain: 'monad', failingSince: firstSince }],
      ],
      [
        'stalled',
        [{ cluster: 'wormhole', chain: 'monad', failingSince: secondSince }],
      ],
    ])
  })
})

function syncer(
  cluster: string,
  chain: string,
  failingSince: UnixTime | undefined,
) {
  return {
    cluster: { name: cluster, plugins: [] },
    chain,
    failingSince,
  } as unknown as Pick<InteropEventSyncer, 'cluster' | 'chain' | 'failingSince'>
}

function mockNotifier() {
  const calls: ['stalled' | 'recovered', InteropSyncerNotification[]][] = []
  const notifier = mockObject<
    Pick<InteropNotifier, 'notifyStalledSyncers' | 'notifyRecoveredSyncers'>
  >({
    notifyStalledSyncers: mockFn((s) => {
      calls.push(['stalled', s])
    }),
    notifyRecoveredSyncers: mockFn((s) => {
      calls.push(['recovered', s])
    }),
  })
  return Object.assign(notifier, { calls })
}
