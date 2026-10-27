import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { describeOssification } from './describeOssification'

describe(describeOssification.name, () => {
  const clockStart = UnixTime.fromDate(new Date('2020-05-18T12:00:00Z'))
  const stats: OssificationStats = {
    score: 99,
    isUnverified: false,
    criticalChangesPerYear: 0,
    contractCount: 1,
    exposure: 2_640_000_000,
    valueSource: null,
    timeline: {
      from: clockStart,
      to: clockStart,
      clockStart,
      genesis: clockStart,
      criticalChanges: [],
      values: null,
    },
  }

  it('lists the score, the last critical change and the exposure', () => {
    expect(describeOssification(stats)).toEqual([
      'Score: 99 of 100.',
      'No critical change since 2020 May 18.',
      // formatCurrency puts a hair space before the unit.
      'Battle-tested exposure: $2.64 B·years.',
    ])
  })

  it('withholds the score for unverified contracts and skips a missing exposure', () => {
    expect(
      describeOssification({ ...stats, isUnverified: true, exposure: null }),
    ).toEqual([
      'No score: some critical contracts are unverified.',
      'No critical change since 2020 May 18.',
    ])
  })

  it('lists nothing while the ossification feature is off', () => {
    expect(describeOssification(undefined)).toEqual([])
  })
})
