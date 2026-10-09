import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  CROP_COLUMNS,
  type CropKey,
  type CropOssification,
  getCropOssificationLines,
  type ResolvedCropEvaluation,
  toCropEntries,
} from './crops'

describe('CROP_COLUMNS', () => {
  it('names every crop once, checked against a record the type system keeps complete', () => {
    const every: Record<CropKey, null> = {
      censorshipResistance: null,
      openSource: null,
      privacy: null,
      security: null,
    }
    expect(CROP_COLUMNS.map((x) => x.key as string).sort()).toEqual(
      Object.keys(every).sort(),
    )
  })
})

describe(getCropOssificationLines.name, () => {
  const ossification: CropOssification = {
    score: 99,
    isUnverified: false,
    unchangedSince: UnixTime.fromDate(new Date('2020-05-18T12:00:00Z')),
    exposure: 2_640_000_000,
  }

  it('lists the score, the last critical change and the exposure', () => {
    expect(getCropOssificationLines(ossification)).toEqual([
      'Score: 99 of 100.',
      'No critical change since 2020 May 18.',
      // formatCurrency puts a hair space before the unit.
      'Battle-tested exposure: $2.64\u200aB·years.',
    ])
  })

  it('withholds the score for unverified contracts and skips a missing exposure', () => {
    expect(
      getCropOssificationLines({
        ...ossification,
        isUnverified: true,
        exposure: null,
      }),
    ).toEqual([
      'No score: some critical contracts are unverified.',
      'No critical change since 2020 May 18.',
    ])
  })
})

describe(toCropEntries.name, () => {
  const evaluation: ResolvedCropEvaluation = {
    sentiment: 'good',
    status: 'reviewed',
    points: [],
    missing: [],
    additionalConsiderations: [],
    notReviewed: [],
  }
  const crops = {
    censorshipResistance: evaluation,
    openSource: evaluation,
    privacy: evaluation,
    security: evaluation,
  }

  it('attaches the ossification to the Security crop only', () => {
    const ossification: CropOssification = {
      score: 50,
      isUnverified: false,
      unchangedSince: UnixTime(0),
      exposure: null,
    }
    const withOssification = toCropEntries(crops, ossification)
      .filter((entry) => entry.ossification)
      .map((entry) => entry.definition.key)
    expect(withOssification).toEqual(['security'])
  })
})
