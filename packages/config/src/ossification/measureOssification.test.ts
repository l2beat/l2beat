import { Bytes, Hash160, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectOssificationContract } from '../types'
import {
  exploitAgePercentile,
  getUncertainNewestChange,
  measureOssification,
  toDisplayScore,
} from './measureOssification'
import type { OssificationChange, OssificationInput } from './OssificationInput'
import ossificationCurve from './ossificationCurve.json'

const NOW = UnixTime(1_800_000_000)
const YEAR = 365 * 24 * 60 * 60
const DAY = 24 * 60 * 60
const HOUR = 60 * 60

const scoreAt = (ageSeconds: number) =>
  Math.round(100 * exploitAgePercentile(ageSeconds))

function row(
  overrides: Partial<ProjectOssificationContract> = {},
): ProjectOssificationContract {
  return {
    name: 'A',
    address: 'eth:0xA',
    isVerified: true,
    ossifyingSince: NOW - 3 * YEAR,
    codeChangeCount: 0,
    stateChangeCount: 0,
    ...overrides,
  }
}

function change(
  timestamp: number,
  overrides: Partial<OssificationChange> = {},
): OssificationChange {
  return { timestamp, type: 'code', earliest: timestamp, ...overrides }
}

function input(overrides: Partial<OssificationInput> = {}): OssificationInput {
  return {
    now: NOW,
    contracts: [row()],
    changes: [],
    resets: [],
    observedSince: NOW - 3 * YEAR,
    ...overrides,
  }
}

describe(measureOssification.name, () => {
  it('refuses an input without a critical contract', () => {
    expect(() => measureOssification(input({ contracts: [] }))).toThrow(
      'has a contract',
    )
  })

  it('scores an old unchanged perimeter as mature', () => {
    const result = measureOssification(input({ resets: [NOW - 3 * YEAR] }))
    expect(result?.score).toEqual(scoreAt(3 * YEAR))
    expect(result?.projectClockStart).toEqual(NOW - 3 * YEAR)
    expect(result?.lastCriticalChange).toEqual(undefined)
    expect(result?.clusteredEventCount).toEqual(0)
    expect(result?.perimeterResets).toEqual([NOW - 3 * YEAR])
  })

  it('gives the project its youngest clock, youngest contract first', () => {
    const result = measureOssification(
      input({
        contracts: [row(), row({ name: 'B', ossifyingSince: NOW - YEAR })],
      }),
    )
    expect(result?.projectClockStart).toEqual(NOW - YEAR)
    expect(result?.score).toEqual(scoreAt(YEAR))
    expect(result?.contracts.map((c) => c.name)).toEqual(['B', 'A'])
  })

  it('scores zero while any critical contract is unverified', () => {
    const result = measureOssification(
      input({ contracts: [row(), row({ isVerified: false })] }),
    )
    expect(result?.score).toEqual(0)
    expect(result?.maturity).toEqual(0)
  })

  it('counts changes against the observed window', () => {
    const result = measureOssification(input({ changes: [change(NOW - YEAR)] }))
    expect(result?.lastCriticalChange).toEqual(NOW - YEAR)
    expect(result?.clusteredEventCount).toEqual(1)
    expect(result?.windowSeconds).toEqual(3 * YEAR)
    expect(result?.criticalChangesPerYear).toEqual(1 / 3)
  })

  it('clusters changes within 24 hours into one decision', () => {
    const result = measureOssification(
      input({
        changes: [
          change(NOW - YEAR),
          change(NOW - YEAR + HOUR, { type: 'state' }),
          change(NOW - YEAR + 2 * DAY),
        ],
      }),
    )
    expect(result?.clusteredEventCount).toEqual(2)
  })

  it('clips the window to the observed history and counts inside it only', () => {
    const result = measureOssification(
      input({
        observedSince: NOW - YEAR,
        changes: [change(NOW - 2 * YEAR), change(NOW - DAY)],
      }),
    )
    expect(result?.windowSeconds).toEqual(YEAR)
    expect(result?.clusteredEventCount).toEqual(1)
    expect(result?.criticalChangesPerYear).toEqual(1)
  })

  it('never divides by less than thirty days', () => {
    const result = measureOssification(
      input({ observedSince: NOW - DAY, changes: [change(NOW - HOUR)] }),
    )
    expect(result?.windowSeconds).toEqual(30 * DAY)
  })

  it('draws changes and resets as one clustered timeline', () => {
    const result = measureOssification(
      input({
        resets: [NOW - 3 * YEAR, NOW - YEAR + HOUR],
        changes: [change(NOW - YEAR), change(NOW - DAY)],
      }),
    )
    expect(result?.perimeterResets).toEqual([
      NOW - 3 * YEAR,
      NOW - YEAR,
      NOW - DAY,
    ])
  })

  it('tags each discovery update once, mixed updates as code', () => {
    const result = measureOssification(
      input({
        changes: [
          change(NOW - YEAR, { type: 'state', updateId: 'u1' }),
          change(NOW - YEAR + HOUR, { type: 'code', updateId: 'u1' }),
          change(NOW - DAY, { type: 'state', updateId: 'u2' }),
          change(NOW - HOUR),
        ],
      }),
    )
    expect(result?.criticalUpdates).toEqual([
      { id: 'u1', type: 'code' },
      { id: 'u2', type: 'state' },
    ])
  })

  it('accepts changes in any order', () => {
    const result = measureOssification(
      input({ changes: [change(NOW - DAY), change(NOW - YEAR)] }),
    )
    expect(result?.lastCriticalChange).toEqual(NOW - DAY)
    expect(result?.clusteredEventCount).toEqual(2)
  })
})

describe(getUncertainNewestChange.name, () => {
  const interval = (timestamp: number) =>
    change(timestamp, {
      type: 'state',
      updateId: 'u1',
      earliest: timestamp - 30 * DAY,
    })

  it('is nothing when the clock is set by an exact change or a reset', () => {
    const exact = input({
      contracts: [row({ ossifyingSince: NOW - DAY })],
      changes: [interval(NOW - YEAR), change(NOW - DAY)],
    })
    expect(getUncertainNewestChange(exact)).toEqual(undefined)
    const deployment = input({
      contracts: [row({ ossifyingSince: NOW - HOUR })],
      changes: [interval(NOW - DAY)],
    })
    expect(getUncertainNewestChange(deployment)).toEqual(undefined)
  })

  it('is the newest change when it sets the clock and is only an interval', () => {
    const uncertain = interval(NOW - DAY)
    const known = input({
      contracts: [row({ ossifyingSince: NOW - DAY })],
      changes: [change(NOW - YEAR), uncertain],
    })
    expect(getUncertainNewestChange(known)).toEqual(uncertain)
    const legacy = change(NOW - DAY, { earliest: undefined })
    const unknown = input({
      contracts: [row({ ossifyingSince: NOW - DAY })],
      changes: [legacy],
    })
    expect(getUncertainNewestChange(unknown)).toEqual(legacy)
  })
})

describe(toDisplayScore.name, () => {
  it('reserves 0 for the unverified gate and never fakes the extremes', () => {
    expect(toDisplayScore(0)).toEqual(0)
    expect(toDisplayScore(0.001)).toEqual(1)
    expect(toDisplayScore(0.999)).toEqual(99)
    expect(toDisplayScore(1)).toEqual(99)
  })
})

describe('ossificationCurve', () => {
  it('should have a hash', () => {
    const hash = Hash160(Bytes.fromHex(ossificationCurve.hash).toString())
    expect(hash).not.toBeEmpty()
  })

  it('knots can not be empty', () => {
    expect(ossificationCurve.knots).not.toBeEmpty()
  })

  it('knots should be ascending', () => {
    const sorted = structuredClone(ossificationCurve.knots)
    sorted.sort((a, b) => a - b)
    expect(ossificationCurve.knots).toEqual(sorted)
  })
})
