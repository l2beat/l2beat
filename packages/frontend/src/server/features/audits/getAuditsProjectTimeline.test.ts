import type { OssificationHistory } from '@l2beat/shared/frontend'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getAuditsLaunch,
  getAuditsProjectTimeline,
  toAuditsSummaryTimeline,
} from './getAuditsProjectTimeline'
import type { AuditsProjectReport } from './types'

const DAY = UnixTime.DAY
const NOW = UnixTime(1_800_000_000)

describe(getAuditsProjectTimeline.name, () => {
  const audits: AuditsProjectReport[] = [
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
    deployments: [],
    observedSince: NOW - 700 * DAY,
  }
  const ossification = { history, href: '/p#ossification' }

  it('counts the critical changes after the latest audit', () => {
    const timeline = getAuditsProjectTimeline(
      { audits, otherAudits: [], ossification, launch: NOW - 700 * DAY },
      NOW,
    )
    expect(timeline.hasOssification).toEqual(true)
    expect(timeline.ossificationHref).toEqual('/p#ossification')
    expect(timeline.latestAudit?.id).toEqual('b')
    expect(timeline.criticalChangesSinceLatestAudit).toEqual(2)
    expect(timeline.from).toEqual(NOW - 700 * DAY)
    expect(timeline.to).toEqual(NOW)
  })

  it('averages the audits and upgrades over the life since the launch', () => {
    const timeline = getAuditsProjectTimeline(
      { audits, otherAudits: [], ossification, launch: NOW - 700 * DAY },
      NOW,
    )
    expect(timeline.auditInterval).toEqual({
      start: NOW - 700 * DAY,
      audits: 2,
      average: 350 * DAY,
    })
    expect(timeline.averageUpgradeInterval).toEqual((700 * DAY) / 3)
  })

  it('averages the audits since the first one when it predates the launch', () => {
    const timeline = getAuditsProjectTimeline(
      { audits, otherAudits: [], ossification, launch: NOW - 400 * DAY },
      NOW,
    )
    expect(timeline.auditInterval?.average).toEqual(250 * DAY)
    expect(timeline.from).toEqual(NOW - 600 * DAY)
  })

  it('starts the interval at the launch or the first own audit, not at a stack audit', () => {
    const timeline = getAuditsProjectTimeline(
      {
        audits: [
          { ...audit('stack-old', NOW - 900 * DAY), origin: 'stack' },
          { ...audit('stack-new', NOW - 300 * DAY), origin: 'stack' },
          ...audits,
        ],
        otherAudits: [],
        ossification,
        launch: NOW - 700 * DAY,
      },
      NOW,
    )
    expect(timeline.auditInterval).toEqual({
      start: NOW - 700 * DAY,
      audits: 3,
      average: (700 * DAY) / 3,
    })
    expect(timeline.from).toEqual(NOW - 900 * DAY)
  })

  it('has no interval without audits', () => {
    const timeline = getAuditsProjectTimeline(
      { audits: [], otherAudits: [], ossification, launch: NOW - 700 * DAY },
      NOW,
    )
    expect(timeline.auditInterval).toEqual(null)
    expect(timeline.latestAudit).toEqual(null)
    expect(timeline.criticalChangesSinceLatestAudit).toEqual(3)
  })

  it('shows audits alone without ossification', () => {
    const timeline = getAuditsProjectTimeline(
      {
        audits,
        otherAudits: [],
        ossification: { history: undefined, href: '/p#ossification' },
        launch: null,
      },
      NOW,
    )
    expect(timeline.hasOssification).toEqual(false)
    expect(timeline.ossificationHref).toEqual(undefined)
    expect(timeline.criticalChanges).toEqual([])
    expect(timeline.criticalChangesSinceLatestAudit).toEqual(null)
    expect(timeline.averageUpgradeInterval).toEqual(null)
    expect(timeline.from).toEqual(NOW - 500 * DAY)
  })

  it('never starts later than a year ago', () => {
    const timeline = getAuditsProjectTimeline(
      {
        audits: [audit('recent', NOW - 30 * DAY)],
        otherAudits: [],
        ossification: { history: undefined, href: undefined },
        launch: NOW - 60 * DAY,
      },
      NOW,
    )
    expect(timeline.from).toEqual(NOW - 365 * DAY)
  })

  it('sorts the other audits', () => {
    const timeline = getAuditsProjectTimeline(
      {
        audits,
        otherAudits: [other('late', NOW - DAY), other('early', NOW - 9 * DAY)],
        ossification: { history: undefined, href: undefined },
        launch: null,
      },
      NOW,
    )
    expect(timeline.otherAudits.map((a) => a.id)).toEqual(['early', 'late'])
  })

  it('reduces to the summary timeline', () => {
    const timeline = getAuditsProjectTimeline(
      { audits, otherAudits: [], ossification, launch: NOW - 700 * DAY },
      NOW,
    )
    expect(toAuditsSummaryTimeline(timeline)).toEqual({
      from: NOW - 700 * DAY,
      to: NOW,
      launch: NOW - 700 * DAY,
      audits: [NOW - 500 * DAY, NOW - 100 * DAY],
      latestAudit: NOW - 100 * DAY,
      criticalChangesSinceLatestAudit: 2,
    })
  })
})

describe(getAuditsLaunch.name, () => {
  it('prefers the ossification perimeter start', () => {
    expect(
      getAuditsLaunch({
        ossificationHistory: {
          contracts: [],
          changes: [],
          deployments: [],
          observedSince: 100,
        },
        chainConfig: { sinceTimestamp: UnixTime(50) },
      }),
    ).toEqual(100)
  })

  it('falls back to the chain start, then to nothing', () => {
    expect(
      getAuditsLaunch({ chainConfig: { sinceTimestamp: UnixTime(50) } }),
    ).toEqual(50)
    expect(getAuditsLaunch({})).toEqual(null)
  })
})

function audit(id: string, timestamp: number): AuditsProjectReport {
  return {
    id,
    title: id,
    auditor: 'A',
    timestamp,
    origin: 'own',
    collectionName: 'Own',
    matched: true,
  }
}

function other(id: string, timestamp: number) {
  return {
    id,
    title: id,
    auditor: 'A',
    timestamp,
    origin: 'library' as const,
    collectionName: 'Lib',
  }
}
