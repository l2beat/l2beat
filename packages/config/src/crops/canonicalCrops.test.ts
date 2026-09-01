import { expect } from 'earl'
import type { ProjectCrops } from '../types'
import {
  qualifiesForGarden,
  resolveCropEvaluation,
  resolveProjectCrops,
} from './canonicalCrops'
import { OSI_LICENSES } from './osiLicenses'

describe('canonicalCrops', () => {
  describe(resolveCropEvaluation.name, () => {
    it('defaults a missing status to reviewed', () => {
      expect(resolveCropEvaluation({ sentiment: 'good' })).toEqual({
        sentiment: 'good',
        status: 'reviewed',
        license: undefined,
        points: [],
        missing: [],
        additionalConsiderations: [],
        notReviewed: [],
      })
    })

    it('makes a not-reviewed crop neutral, whatever the config says', () => {
      // A crop we have not reviewed makes no claim about quality.
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
      // Only reachable from JavaScript or a stale build - the type stops it in
      // config - but a green crop with no license behind it must never render.
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
      // The rule is about the colour, not about how far the review got.
      const resolved = resolveProjectCrops(
        crops({ security: { sentiment: 'bad', status: 'partiallyReviewed' } }),
      )
      expect(qualifiesForGarden(resolved)).toEqual(false)
    })
  })
})
