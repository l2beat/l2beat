import type { ProjectCrops } from '@l2beat/config'
import { OSI_LICENSES } from '@l2beat/config'
import { expect } from 'earl'
import {
  qualifiesForGarden,
  resolveCropEvaluation,
  resolveProjectCrops,
} from './crops'

describe('crops', () => {
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
      ).toThrow(/not an OSI-approved license/)
    })
  })

  describe(qualifiesForGarden.name, () => {
    const crops = (overrides: Partial<ProjectCrops> = {}): ProjectCrops => ({
      censorshipResistance: { sentiment: 'good' },
      openSource: { sentiment: 'good' },
      privacy: { sentiment: 'good' },
      security: { sentiment: 'good' },
      ...overrides,
    })

    it('lets a project in when no crop is red', () => {
      const resolved = resolveProjectCrops(
        crops({
          privacy: { status: 'fullyTransparent' },
          security: { sentiment: 'warning', status: 'partiallyReviewed' },
        }),
      )
      expect(qualifiesForGarden(resolved)).toEqual(true)
    })

    it('keeps a project out when any crop is red', () => {
      const resolved = resolveProjectCrops(
        crops({ security: { sentiment: 'bad' } }),
      )
      expect(qualifiesForGarden(resolved)).toEqual(false)
    })

    it('keeps it out even when the red crop is only partially reviewed', () => {
      const resolved = resolveProjectCrops(
        crops({ security: { sentiment: 'bad', status: 'partiallyReviewed' } }),
      )
      expect(qualifiesForGarden(resolved)).toEqual(false)
    })
  })
})
