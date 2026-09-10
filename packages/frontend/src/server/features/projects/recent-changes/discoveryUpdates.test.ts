import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import { expect } from 'earl'
import { countRecentDiscoveryUpdates } from './discoveryUpdates'

const DAY = 24 * 60 * 60
const NOW = 1700000000

function update(timestamp: number | null): ProjectDiscoveryUpdate {
  return {
    id: `${timestamp ?? 'unknown'}`,
    date: 'Tue, 21 Jan 2026 09:00:00 GMT',
    timestamp,
    description: '',
    isHighSeverity: false,
    changeCount: 1,
    sections: [],
  }
}

describe(countRecentDiscoveryUpdates.name, () => {
  it('counts only updates from the past 7 days', () => {
    const count = countRecentDiscoveryUpdates(
      [
        update(NOW - 1 * DAY),
        update(NOW - 7 * DAY),
        update(NOW - 8 * DAY),
        update(NOW - 30 * DAY),
      ],
      NOW,
    )

    expect(count).toEqual(2)
  })

  it('ignores updates without a timestamp', () => {
    expect(countRecentDiscoveryUpdates([update(null)], NOW)).toEqual(0)
  })

  it('returns zero for no updates', () => {
    expect(countRecentDiscoveryUpdates([], NOW)).toEqual(0)
  })
})
