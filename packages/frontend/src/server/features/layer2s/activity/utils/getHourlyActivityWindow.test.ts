import type { SyncMetadataRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { optionToRange } from '~/utils/range/range'
import { getHourlyActivityWindow } from './getHourlyActivityWindow'

const HOUR = UnixTime.HOUR
const DAY = UnixTime.DAY
const at = (iso: string) => UnixTime.fromDate(new Date(iso))

describe(getHourlyActivityWindow.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
    time.setSystemTime(new Date('2026-10-28T14:30:00.000Z'))
  })

  afterEach(() => {
    time.uninstall()
  })

  it('ends 1D at the latest full hour, a day after it starts', () => {
    // Synced to their 14:00 target, so 13:00 is their last full hour
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      synced('ethereum', '2026-10-28T14:00:00Z'),
    ])

    expect(window).toEqual({
      start: at('2026-10-27T14:00:00Z'),
      end: at('2026-10-28T13:00:00Z'),
      behind: [],
    })
  })

  it('shows 7D as the last 168 hours', () => {
    const window = getHourlyActivityWindow(optionToRange('7d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
    ])

    expect(window.start).toEqual(at('2026-10-21T14:00:00Z'))
    expect(window.end).toEqual(at('2026-10-28T13:00:00Z'))
  })

  it('stops before the hour of the latest block of a chain still syncing', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      // Its latest block is from 12:xx, so it has finished 11:00
      catchingUp('base', '2026-10-28T13:00:00Z'),
    ])

    expect(window).toEqual({
      start: at('2026-10-27T12:00:00Z'),
      end: at('2026-10-28T11:00:00Z'),
      behind: [],
    })
  })

  it('reads a chain synced to its target as having every hour before it', () => {
    // No blocks since 09:xx, and none missing either
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      {
        ...synced('quiet', '2026-10-28T14:00:00Z'),
        syncedUntil: at('2026-10-28T10:00:00Z'),
      },
    ])

    expect(window.end).toEqual(at('2026-10-28T13:00:00Z'))
    expect(window.behind).toEqual([])
  })

  it('reads hours from an API as whole up to where they are synced', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      // Has stored 13:00, its last full hour
      api('lighter', '2026-10-28T14:00:00Z'),
    ])

    expect(window.end).toEqual(at('2026-10-28T13:00:00Z'))
    expect(window.behind).toEqual([])
  })

  it('leaves out a project far behind instead of stopping the window at it', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      // Synced once a day, up to midnight
      api('lighter', '2026-10-28T00:00:00Z'),
      catchingUp('stalled', '2026-10-28T09:00:00Z'),
    ])

    expect(window).toEqual({
      start: at('2026-10-27T14:00:00Z'),
      end: at('2026-10-28T13:00:00Z'),
      behind: [
        { id: 'lighter', syncedUntil: at('2026-10-28T00:00:00Z') },
        { id: 'stalled', syncedUntil: at('2026-10-28T08:00:00Z') },
      ],
    })
  })

  it('waits for every project, however far behind, when told to', () => {
    const window = getHourlyActivityWindow(
      optionToRange('1d'),
      [
        synced('ethereum', '2026-10-28T14:00:00Z'),
        catchingUp('stalled', '2026-10-28T09:00:00Z'),
      ],
      { waitForAll: true },
    )

    expect(window.end).toEqual(at('2026-10-28T07:00:00Z'))
    expect(window.behind).toEqual([])
  })

  it('ends where everything stopped when all projects are behind', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T05:00:00Z'),
      synced('ethereum', '2026-10-28T04:00:00Z'),
    ])

    expect(window).toEqual({
      start: at('2026-10-27T04:00:00Z'),
      end: at('2026-10-28T03:00:00Z'),
      behind: [],
    })
  })

  it('never starts before the range does', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-27T05:00:00Z'),
    ])

    expect(window.start).toEqual(at('2026-10-27T00:00:00Z'))
    expect(window.end).toEqual(at('2026-10-27T04:00:00Z'))
  })

  it('ignores projects that have not synced yet', () => {
    const window = getHourlyActivityWindow(optionToRange('1d'), [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
      { ...catchingUp('new', '2026-10-28T09:00:00Z'), syncedUntil: null },
    ])

    expect(window.end).toEqual(at('2026-10-28T13:00:00Z'))
    expect(window.behind).toEqual([])
  })

  it('keeps 7D a full week just after midnight', () => {
    time.setSystemTime(new Date('2026-10-28T00:30:00.000Z'))

    const window = getHourlyActivityWindow(optionToRange('7d'), [
      synced('arbitrum', '2026-10-28T00:00:00Z'),
    ])

    expect(window.end).toEqual(at('2026-10-27T23:00:00Z'))
    expect(window.end - window.start).toEqual(7 * DAY - HOUR)
  })

  it('keeps the start of a custom range ending today', () => {
    const range: [UnixTime, UnixTime] = [
      at('2026-10-26T00:00:00Z'),
      at('2026-10-28T14:00:00Z'),
    ]
    const window = getHourlyActivityWindow(range, [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
    ])

    expect(window.start).toEqual(at('2026-10-26T00:00:00Z'))
    expect(window.end).toEqual(at('2026-10-28T13:00:00Z'))
  })

  it('keeps the start of a custom range', () => {
    const range: [UnixTime, UnixTime] = [
      at('2026-10-25T00:00:00Z'),
      at('2026-10-26T23:59:59Z'),
    ]
    const window = getHourlyActivityWindow(range, [
      synced('arbitrum', '2026-10-28T14:00:00Z'),
    ])

    expect(window).toEqual({
      start: at('2026-10-25T00:00:00Z'),
      end: at('2026-10-26T23:00:00Z'),
      behind: [],
    })
  })
})

/** Holds every block until its hourly target */
function synced(id: string, target: string): SyncMetadataRecord {
  return {
    feature: 'activity',
    id,
    target: at(target),
    syncedUntil: at(target),
    blockTarget: 1000,
    blockSyncedUntil: 1000,
  }
}

/** Still syncing, until the end of the hour of its latest block */
function catchingUp(id: string, syncedUntil: string): SyncMetadataRecord {
  return {
    feature: 'activity',
    id,
    target: at('2026-10-28T14:00:00Z'),
    syncedUntil: at(syncedUntil),
    blockTarget: 1000,
    blockSyncedUntil: 900,
  }
}

function api(id: string, syncedUntil: string): SyncMetadataRecord {
  return {
    feature: 'activity',
    id,
    target: at(syncedUntil),
    syncedUntil: at(syncedUntil),
    blockTarget: null,
    blockSyncedUntil: null,
  }
}
