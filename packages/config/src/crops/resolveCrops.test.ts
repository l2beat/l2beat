import type { OssificationHistory } from '@l2beat/shared'
import { expect } from 'earl'
import type {
  ProjectCrops,
  ProjectDefiInfo,
  ProjectPrivacyInfo,
} from '../types'
import { OSI_LICENSES } from './osiLicenses'
import { resolveCropEvaluation, resolveGarden } from './resolveCrops'

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

  describe(resolveGarden.name, () => {
    const crops = (overrides: Partial<ProjectCrops> = {}): ProjectCrops => ({
      censorshipResistance: { sentiment: 'good' },
      openSource: { sentiment: 'good' },
      privacy: { sentiment: 'good' },
      security: { sentiment: 'good', missing: ['Written.'] },
      ...overrides,
    })
    const verdicts = (overrides: Partial<ProjectCrops> = {}) =>
      resolveGarden({ slug: 'p', crops: crops(overrides) }).verdicts

    it('lists a project with no red crop and an ossification score', () => {
      const { good } = verdicts({
        privacy: { status: 'fullyTransparent' },
        security: { sentiment: 'warning', status: 'partiallyReviewed' },
      })
      expect(good.listing).toEqual('listed')
    })

    it('keeps a project out when any crop is red, even partially reviewed', () => {
      const { good } = verdicts({
        censorshipResistance: { sentiment: 'bad', status: 'partiallyReviewed' },
      })
      expect(good.listing).toEqual('ratedBad')
    })

    it('keeps the written Security rating in the top band', () => {
      expect(verdicts().good.crops.security).toHaveSubset({
        sentiment: 'good',
        missing: ['Written.'],
      })
    })

    it('caps Security at warning in the middle band and says why first', () => {
      expect(verdicts().warning.crops.security).toHaveSubset({
        sentiment: 'warning',
        missing: [
          'Ossification score below 80, which takes about a year without a critical change.',
          'Written.',
        ],
      })
    })

    it('rates Security bad in the bottom band, which keeps the project out', () => {
      const { bad } = verdicts()
      expect(bad.crops.security.sentiment).toEqual('bad')
      expect(bad.listing).toEqual('ratedBad')
    })

    it('grades an ungraded Security bad in the bottom band, which keeps the project out', () => {
      const { bad } = verdicts({ security: { status: 'notReviewed' } })
      expect(bad.crops.security).toHaveSubset({
        sentiment: 'bad',
        status: 'partiallyReviewed',
        missing: [
          'Ossification score below 50, which means a critical change within roughly the last five weeks.',
        ],
      })
      expect(bad.listing).toEqual('ratedBad')
    })

    it('leaves an ungraded Security ungraded above the bottom band', () => {
      expect(
        verdicts({ security: { status: 'notReviewed' } }).warning.crops
          .security,
      ).toHaveSubset({
        sentiment: 'neutral',
        status: 'notReviewed',
        missing: [],
      })
    })

    it('never raises a written rating', () => {
      expect(
        verdicts({ security: { sentiment: 'bad' } }).good.crops.security
          .sentiment,
      ).toEqual('bad')
    })

    it('says when there is no score, and keeps the project out', () => {
      const { unscored } = verdicts()
      expect(unscored.crops.security).toHaveSubset({
        sentiment: 'good',
        notReviewed: ['Ossification score.'],
      })
      expect(unscored.listing).toEqual('noOssificationScore')
    })

    it('links the page the project has', () => {
      const path = (project: Partial<Parameters<typeof resolveGarden>[0]>) =>
        resolveGarden({ slug: 'p', crops: crops(), ...project }).path
      expect(path({ privacyInfo: {} as ProjectPrivacyInfo })).toEqual(
        '/privacy/projects/p',
      )
      expect(path({ defiInfo: {} as ProjectDefiInfo })).toEqual(null)
      expect(
        path({
          defiInfo: {} as ProjectDefiInfo,
          ossificationHistory: {} as OssificationHistory,
        }),
      ).toEqual('/defi/projects/p')
    })
  })
})
