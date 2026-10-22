import type { OssificationHistory } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectCrops } from '../types'
import { OSI_LICENSES } from './osiLicenses'
import { resolveCropEvaluation, resolveProjectCrops } from './resolveCrops'

describe('resolveCrops', () => {
  describe(resolveCropEvaluation.name, () => {
    it('defaults a missing status to reviewed', () => {
      expect(resolveCropEvaluation({ sentiment: 'good' })).toEqual({
        sentiment: 'good',
        status: 'reviewed',
        points: [],
        missing: [],
        additionalConsiderations: [],
        notReviewed: [],
      })
    })

    it('resolves an ungraded crop to neutral, since it declares no sentiment', () => {
      expect(
        resolveCropEvaluation({ status: 'notReviewed' }).sentiment,
      ).toEqual('neutral')
      expect(
        resolveCropEvaluation({ status: 'fullyTransparent' }).sentiment,
      ).toEqual('neutral')
    })

    it('keeps the sentiment of a partially reviewed crop', () => {
      const resolved = resolveCropEvaluation({
        sentiment: 'warning',
        status: 'partiallyReviewed',
      })
      expect(resolved.sentiment).toEqual('warning')
      expect(resolved.status).toEqual('partiallyReviewed')
    })

    it('resolves a declared license id against the OSI list', () => {
      const resolved = resolveCropEvaluation({
        sentiment: 'good',
        license: 'MIT',
      })
      expect(resolved.license).toEqual(OSI_LICENSES.MIT)
    })

    it('throws on a license the OSI has not approved', () => {
      expect(() =>
        resolveCropEvaluation({
          sentiment: 'good',
          license: 'BUSL-1.1' as 'MIT',
        }),
      ).toThrow(/Not an OSI-approved license/)
    })
  })

  describe(resolveProjectCrops.name, () => {
    const now = UnixTime(1_800_000_000)
    const crops = (overrides: Partial<ProjectCrops> = {}): ProjectCrops => ({
      censorshipResistance: { sentiment: 'good' },
      openSource: { sentiment: 'good' },
      privacy: { sentiment: 'good' },
      security: { sentiment: 'good', missing: ['Written.'] },
      ...overrides,
    })
    // Scores 86 two years after the last change, 66 after four months and 30
    // after a week: one per band.
    const unchangedFor = (days: number, isVerified = true) =>
      history(now - days * UnixTime.DAY, isVerified)

    it('lists a project with no red crop and an ossification score', () => {
      const resolved = resolveProjectCrops(
        {
          crops: crops({
            privacy: { status: 'fullyTransparent' },
            security: { sentiment: 'warning', status: 'partiallyReviewed' },
          }),
          ossificationHistory: unchangedFor(730),
        },
        now,
      )
      expect(resolved.listing).toEqual('listed')
    })

    it('keeps a project out when any crop is red, even partially reviewed', () => {
      const resolved = resolveProjectCrops(
        {
          crops: crops({
            censorshipResistance: {
              sentiment: 'bad',
              status: 'partiallyReviewed',
            },
          }),
          ossificationHistory: unchangedFor(730),
        },
        now,
      )
      expect(resolved.listing).toEqual('ratedBad')
    })

    it('keeps the written Security rating from the top band', () => {
      const { crops: resolved } = resolveProjectCrops(
        { crops: crops(), ossificationHistory: unchangedFor(730) },
        now,
      )
      expect(resolved.security).toHaveSubset({
        sentiment: 'good',
        missing: ['Written.'],
      })
    })

    it('caps Security at warning in the middle band and says why first', () => {
      const { crops: resolved } = resolveProjectCrops(
        { crops: crops(), ossificationHistory: unchangedFor(120) },
        now,
      )
      expect(resolved.security).toHaveSubset({
        sentiment: 'warning',
        missing: [
          'Ossification score below 80: critical contracts changed within about the last year.',
          'Written.',
        ],
      })
    })

    it('rates Security bad in the bottom band, which keeps the project out', () => {
      const resolved = resolveProjectCrops(
        { crops: crops(), ossificationHistory: unchangedFor(7) },
        now,
      )
      expect(resolved.crops.security.sentiment).toEqual('bad')
      expect(resolved.listing).toEqual('ratedBad')
    })

    it('never raises a written rating', () => {
      const { crops: resolved } = resolveProjectCrops(
        {
          crops: crops({ security: { sentiment: 'bad' } }),
          ossificationHistory: unchangedFor(730),
        },
        now,
      )
      expect(resolved.security.sentiment).toEqual('bad')
    })

    for (const [name, ossificationHistory] of [
      ['without an ossification history', undefined],
      ['while a critical contract is unverified', unchangedFor(7, false)],
    ] as const) {
      it(`has no score ${name}: Security says so, and the project is unlisted`, () => {
        const resolved = resolveProjectCrops(
          { crops: crops(), ossificationHistory },
          now,
        )
        expect(resolved.crops.security).toHaveSubset({
          sentiment: 'good',
          notReviewed: ['Ossification score.'],
        })
        expect(resolved.listing).toEqual('noOssificationScore')
      })
    }
  })
})

function history(since: number, isVerified: boolean): OssificationHistory {
  return {
    contracts: [
      {
        name: 'Core',
        address: ChainSpecificAddress(
          'eth:0x1F98431c8aD98523631AE4a59f267346ea31F984',
        ),
        isVerified,
        ossifyingSince: since,
        codeChangeCount: 0,
        stateChangeCount: 0,
      },
    ],
    changes: [],
    deployments: [since],
    observedSince: since,
  }
}
