import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject } from '../../types'
import {
  type CoverageGap,
  findCoverageGaps,
  findDaTrackingGaps,
  gapMessage,
  type TrackedRange,
} from './gaps'

describe(findCoverageGaps.name, () => {
  const entry = (
    since: number,
    until?: number,
    daLayer = 'ethereum',
  ): TrackedRange => ({ daLayer, label: `${daLayer} ${since}`, since, until })

  const gap = (
    before: TrackedRange,
    after: TrackedRange,
    daLayer = 'ethereum',
  ): CoverageGap => ({
    daLayer,
    from: (before.until ?? Number.NaN) + 1,
    to: after.since - 1,
    before,
    after,
  })

  it('accepts a single open entry', () => {
    expect(findCoverageGaps([entry(100)])).toEqual([])
  })

  it('accepts a trailing closed entry', () => {
    expect(findCoverageGaps([entry(100, 200)])).toEqual([])
    expect(findCoverageGaps([entry(100, 200), entry(201, 300)])).toEqual([])
  })

  it('accepts the handover convention next.since === prev.until', () => {
    expect(findCoverageGaps([entry(100, 200), entry(200)])).toEqual([])
  })

  it('accepts adjacent entries next.since === prev.until + 1', () => {
    expect(findCoverageGaps([entry(100, 200), entry(201)])).toEqual([])
  })

  it('accepts overlapping entries', () => {
    expect(findCoverageGaps([entry(100, 250), entry(150)])).toEqual([])
    expect(
      findCoverageGaps([entry(100), entry(150, 160), entry(170, 180)]),
    ).toEqual([])
  })

  it('reports a hole between a closed entry and its successor', () => {
    const [a, b] = [entry(100, 200), entry(202)]
    expect(findCoverageGaps([a, b])).toEqual([gap(a, b)])
  })

  it('measures the hole from the furthest covered point, not the last entry', () => {
    // The overlapping entry ends earlier than the first one - the covered
    // frontier must not go backwards.
    const [a, b, c] = [entry(100, 500), entry(200, 300), entry(600)]
    expect(findCoverageGaps([a, b, c])).toEqual([gap(a, c)])
  })

  it('reports multiple holes', () => {
    const [a, b, c] = [entry(100, 200), entry(300, 400), entry(500)]
    expect(findCoverageGaps([a, b, c])).toEqual([gap(a, b), gap(b, c)])
  })

  it('sorts by since itself', () => {
    const [a, b] = [entry(100, 200), entry(300)]
    expect(findCoverageGaps([b, a])).toEqual([gap(a, b)])
  })

  it('compares entries per DA layer', () => {
    // A closed ethereum range followed by a celestia range is a layer
    // switch, not a hole - the layers have unrelated units.
    const [a, b] = [entry(100, 200), entry(5, undefined, 'celestia')]
    expect(findCoverageGaps([a, b])).toEqual([])
    const [c, d] = [
      entry(100, 200, 'celestia'),
      entry(300, undefined, 'celestia'),
    ]
    expect(findCoverageGaps([a, c, d])).toEqual([gap(c, d, 'celestia')])
  })
})

describe(findDaTrackingGaps.name, () => {
  it('leaves no hole between consecutive ranges on a layer', () => {
    // Checked against the configs, not the snapshot: a project that stops
    // being tracked and resumes later has a hole in its data that
    // regenerating the snapshot would never reveal.
    const gaps = findDaTrackingGaps(getProjects())
    if (gaps.length > 0) {
      throw new Error(gapMessage(gaps))
    }
  })

  it('reports holes and honours the legacy list', () => {
    const project: BaseProject = {
      id: ProjectId('test'),
      slug: 'test',
      name: 'Test',
      shortName: undefined,
      addedAt: 0,
      daTrackingConfig: [
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          inbox: '0x1',
          sinceBlock: 100,
          untilBlock: 200,
        },
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          inbox: '0x2',
          sinceBlock: 300,
        },
      ],
    }

    const gaps = findDaTrackingGaps([project], [])
    expect(gaps.map((g) => [g.projectId, g.gap.from, g.gap.to])).toEqual([
      ['test', 201, 299],
    ])
    expect(gapMessage(gaps)).toInclude('[test/ethereum/201-299]')

    expect(findDaTrackingGaps([project], ['test/ethereum/201-299'])).toEqual([])
  })
})
