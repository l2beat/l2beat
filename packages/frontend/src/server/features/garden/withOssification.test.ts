import { resolveCropEvaluation } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'
import { withOssification } from './withOssification'

describe(withOssification.name, () => {
  const evaluation = resolveCropEvaluation({ sentiment: 'good' })
  const crops = {
    censorshipResistance: evaluation,
    openSource: evaluation,
    privacy: evaluation,
    security: evaluation,
  }
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

  it('lists the score, the last critical change and the exposure under Security only', () => {
    const result = withOssification(crops, stats)
    expect(result.security.ossification).toEqual([
      'Score: 99 of 100.',
      'No critical change since 2020 May 18.',
      // formatCurrency puts a hair space before the unit.
      'Battle-tested exposure: $2.64 B·years.',
    ])
    expect(result.privacy.ossification).toEqual(undefined)
  })

  it('withholds the score for unverified contracts and skips a missing exposure', () => {
    const result = withOssification(crops, {
      ...stats,
      isUnverified: true,
      exposure: null,
    })
    expect(result.security.ossification).toEqual([
      'No score: some critical contracts are unverified.',
      'No critical change since 2020 May 18.',
    ])
  })

  it('leaves the crops alone while the ossification feature is off', () => {
    expect(withOssification(crops, undefined)).toEqual(crops)
  })
})
