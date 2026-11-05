import type { SyncMetadataRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getSyncState } from './syncState'

const at = (iso: string) => UnixTime.fromDate(new Date(iso))

describe(getSyncState.name, () => {
  it('reads a chain that follows finality as synced no further than its target', () => {
    // Ethereum indexes up to its finalized block, 14:03, past its 13:00
    // target. Every other project is synced to its target at most
    const state = getSyncState(
      record({
        target: at('2026-10-28T13:00:00Z'),
        syncedUntil: at('2026-10-28T15:00:00Z'),
        blockTarget: 1000,
        blockSyncedUntil: 900,
      }),
      at('2026-10-29T00:00:00Z'),
    )

    expect(state).toEqual({
      isSynced: false,
      syncedUntil: at('2026-10-28T13:00:00Z'),
      target: at('2026-10-28T13:00:00Z'),
    })
  })

  it('reads a chain behind its target as synced to where it is', () => {
    const state = getSyncState(
      record({
        target: at('2026-10-28T13:00:00Z'),
        syncedUntil: at('2026-10-28T09:00:00Z'),
        blockTarget: 1000,
        blockSyncedUntil: 900,
      }),
      at('2026-10-29T00:00:00Z'),
    )

    expect(state.syncedUntil).toEqual(at('2026-10-28T09:00:00Z'))
  })
})

function record(
  fields: Pick<
    SyncMetadataRecord,
    'target' | 'syncedUntil' | 'blockTarget' | 'blockSyncedUntil'
  >,
): SyncMetadataRecord {
  return {
    feature: 'activity',
    id: 'ethereum',
    latestBlockTimestamp: null,
    ...fields,
  }
}
