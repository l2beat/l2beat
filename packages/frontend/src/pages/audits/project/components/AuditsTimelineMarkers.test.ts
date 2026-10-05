import { expect } from 'earl'
import { getBuckets } from './AuditsTimelineMarkers'

describe(getBuckets.name, () => {
  const data = [10, 20, 30, 40].map((timestamp) => ({ timestamp }))

  it('snaps every marker to the last data point at or before it', () => {
    const buckets = getBuckets(data, {
      audits: [audit('a', 20), audit('b', 25), audit('c', 45)],
      criticalChanges: [5, 30, 39],
    })
    expect(buckets.map((b) => b.audits.map((a) => a.id))).toEqual([
      [],
      ['a', 'b'],
      [],
      ['c'],
    ])
    expect(buckets.map((b) => b.changes)).toEqual([[], [], [30, 39], []])
  })

  it('needs at least two data points', () => {
    expect(getBuckets(undefined, { audits: [], criticalChanges: [] })).toEqual(
      [],
    )
    expect(
      getBuckets([{ timestamp: 1 }], { audits: [], criticalChanges: [] }),
    ).toEqual([])
  })
})

function audit(id: string, timestamp: number) {
  return { id, title: id, auditor: 'A', timestamp, matched: true }
}
