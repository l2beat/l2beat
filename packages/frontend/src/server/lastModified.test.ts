import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjectLastModified, newestTimestamp } from './lastModified'

// Method: build projects from hand-picked discovery update timestamps and
// check which one dates the page; expected dates are literals, not recomputed.
describe(getProjectLastModified.name, () => {
  const CHANGED = UnixTime.fromDate(new Date('2025-06-01T00:00:00Z'))
  const CHANGED_EARLIER = UnixTime.fromDate(new Date('2025-02-01T00:00:00Z'))

  it('uses the newest discovery update', () => {
    const project = {
      discoveryUpdates: [update(CHANGED_EARLIER), update(CHANGED)],
    }

    expect(getProjectLastModified(project)).toEqual(CHANGED)
  })

  it('is unknown without discovery updates, so the caller can fall back', () => {
    expect(getProjectLastModified({ discoveryUpdates: undefined })).toEqual(
      undefined,
    )
  })

  it('skips discovery updates whose date did not parse', () => {
    const project = { discoveryUpdates: [update(null)] }

    expect(getProjectLastModified(project)).toEqual(undefined)
  })
})

describe(newestTimestamp.name, () => {
  it('picks the newest known timestamp', () => {
    expect(newestTimestamp([UnixTime(200), undefined, UnixTime(300)])).toEqual(
      UnixTime(300),
    )
  })

  it('treats the UnixTime(0) placeholder as unknown', () => {
    expect(newestTimestamp([UnixTime(0), null, undefined])).toEqual(undefined)
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
