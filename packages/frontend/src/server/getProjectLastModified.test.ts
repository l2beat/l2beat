import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjectLastModified } from './getProjectLastModified'

describe(getProjectLastModified.name, () => {
  const ADDED = UnixTime.fromDate(new Date('2024-01-10T00:00:00Z'))
  const CHANGED = UnixTime.fromDate(new Date('2025-06-01T00:00:00Z'))
  const CHANGED_EARLIER = UnixTime.fromDate(new Date('2025-02-01T00:00:00Z'))

  it('uses the newest discovery update', () => {
    const project = {
      addedAt: ADDED,
      discoveryUpdates: [update(CHANGED), update(CHANGED_EARLIER)],
    }

    expect(getProjectLastModified(project)).toEqual(CHANGED)
  })

  it('falls back to when the project was added', () => {
    expect(
      getProjectLastModified({ addedAt: ADDED, discoveryUpdates: undefined }),
    ).toEqual(ADDED)
  })

  it('skips discovery updates whose date did not parse', () => {
    const project = { addedAt: ADDED, discoveryUpdates: [update(null)] }

    expect(getProjectLastModified(project)).toEqual(ADDED)
  })

  it('is unknown for a placeholder addedAt and no discovery updates', () => {
    const project = { addedAt: UnixTime(0), discoveryUpdates: [] }

    expect(getProjectLastModified(project)).toEqual(undefined)
  })
})

function update(timestamp: number | null): ProjectDiscoveryUpdate {
  return {
    id: `update-${timestamp}`,
    date: '',
    timestamp,
    description: '',
    isHighSeverity: false,
    changeCount: 1,
    sections: [],
  }
}
