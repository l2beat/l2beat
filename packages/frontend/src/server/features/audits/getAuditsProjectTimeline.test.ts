import type { OssificationHistory } from '@l2beat/shared/frontend'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getAuditsProjectTimeline } from './getAuditsProjectTimeline'
import type { AuditsOwnReport } from './types'

const DAY = UnixTime.DAY
const NOW = UnixTime(1_800_000_000)

describe(getAuditsProjectTimeline.name, () => {
  const audits: AuditsOwnReport[] = [
    audit('a', NOW - 500 * DAY),
    audit('b', NOW - 100 * DAY),
  ]
  const history: OssificationHistory = {
    contracts: [
      {
        name: 'C',
        address: ChainSpecificAddress(
          'eth:0x0000000000000000000000000000000000000001',
        ),
        isVerified: true,
        ossifyingSince: NOW - 10 * DAY,
        codeChangeCount: 3,
        stateChangeCount: 0,
      },
    ],
    changes: [
      { timestamp: NOW - 600 * DAY, type: 'code' },
      { timestamp: NOW - 50 * DAY, type: 'code' },
      { timestamp: NOW - 10 * DAY, type: 'code' },
    ],
    resets: [],
    observedSince: NOW - 700 * DAY,
  }

  it('counts the critical changes after the latest audit', () => {
    const timeline = getAuditsProjectTimeline(
      audits,
      { history, href: '/p#ossification' },
      'tvs',
      NOW,
    )
    expect(timeline.hasOssification).toEqual(true)
    expect(timeline.ossificationHref).toEqual('/p#ossification')
    expect(timeline.latestAudit?.id).toEqual('b')
    expect(timeline.latestCriticalChange).toEqual(NOW - 10 * DAY)
    expect(timeline.criticalChangesSinceLatestAudit).toEqual(2)
    // MAX reaches back to the earliest marker.
    expect(timeline.from).toEqual(NOW - 600 * DAY)
  })

  it('shows audits alone without ossification', () => {
    const timeline = getAuditsProjectTimeline(
      audits,
      { history: undefined, href: '/p#ossification' },
      null,
      NOW,
    )
    expect(timeline.hasOssification).toEqual(false)
    expect(timeline.ossificationHref).toEqual(undefined)
    expect(timeline.criticalChanges).toEqual([])
    expect(timeline.criticalChangesSinceLatestAudit).toEqual(null)
    expect(timeline.from).toEqual(NOW - 500 * DAY)
  })

  it('never starts later than a year ago', () => {
    const timeline = getAuditsProjectTimeline(
      [audit('recent', NOW - 30 * DAY)],
      { history: undefined, href: undefined },
      null,
      NOW,
    )
    expect(timeline.from).toEqual(NOW - 365 * DAY)
  })
})

function audit(id: string, timestamp: number): AuditsOwnReport {
  return { id, title: id, auditor: 'A', timestamp, matched: true }
}
