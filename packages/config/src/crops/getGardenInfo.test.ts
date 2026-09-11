import { expect } from 'earl'
import type { ProjectCrops } from '../types'
import { getGardenInfo, resolveCropEvaluation } from './getGardenInfo'
import { OSI_LICENSES } from './osiLicenses'

describe(getGardenInfo.name, () => {
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

    it('makes a not-reviewed crop neutral, whatever the config says', () => {
      const resolved = resolveCropEvaluation({
        sentiment: 'good',
        status: 'notReviewed',
      })
      expect(resolved.sentiment).toEqual('neutral')
    })

    it('keeps the sentiment of a partially reviewed crop', () => {
      const resolved = resolveCropEvaluation({
        sentiment: 'warning',
        status: 'partiallyReviewed',
      })
      expect(resolved.sentiment).toEqual('warning')
      expect(resolved.status).toEqual('partiallyReviewed')
    })

    it('falls back to neutral when no sentiment is given', () => {
      expect(resolveCropEvaluation({}).sentiment).toEqual('neutral')
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
      ).toThrow(/not an OSI-approved license/)
    })
  })

  describe('inGarden', () => {
    const crops = (overrides: Partial<ProjectCrops> = {}): ProjectCrops => ({
      censorshipResistance: { sentiment: 'good' },
      openSource: { sentiment: 'good' },
      privacy: { sentiment: 'good' },
      security: { sentiment: 'good' },
      ...overrides,
    })

    it('lets a project in when no crop is red', () => {
      const info = getGardenInfo(
        crops({
          privacy: { status: 'fullyTransparent' },
          security: { sentiment: 'warning', status: 'partiallyReviewed' },
        }),
      )
      expect(info.inGarden).toEqual(true)
    })

    it('keeps a project out when any crop is red', () => {
      const info = getGardenInfo(crops({ security: { sentiment: 'bad' } }))
      expect(info.inGarden).toEqual(false)
    })

    it('keeps it out even when the red crop is only partially reviewed', () => {
      const info = getGardenInfo(
        crops({ security: { sentiment: 'bad', status: 'partiallyReviewed' } }),
      )
      expect(info.inGarden).toEqual(false)
    })

    it('still resolves every crop of a project that is kept out', () => {
      const info = getGardenInfo(crops({ security: { sentiment: 'bad' } }))
      expect(info.crops.security.sentiment).toEqual('bad')
      expect(info.crops.privacy.status).toEqual('reviewed')
    })
  })
})
