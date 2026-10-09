import type { ProjectCrops, ProjectDefiInfo } from '@l2beat/config'
import { OSI_LICENSES } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { resolveCropsProject } from './api'
import {
  qualifiesForGarden,
  resolveCropEvaluation,
  resolveProjectCrops,
} from './crops'
import { LEDGER, UNISWAP } from './test/fixtures'

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

  const crops = (overrides: Partial<ProjectCrops> = {}): ProjectCrops => ({
    censorshipResistance: { sentiment: 'good' },
    openSource: { sentiment: 'good' },
    privacy: { sentiment: 'good' },
    security: { sentiment: 'good' },
    ...overrides,
  })

  describe(qualifiesForGarden.name, () => {
    it('lets a project in when no crop is red', () => {
      const resolved = resolveProjectCrops(
        crops({
          privacy: { status: 'fullyTransparent' },
          security: { sentiment: 'warning', status: 'partiallyReviewed' },
        }),
        undefined,
      )
      expect(qualifiesForGarden(resolved, true)).toEqual(true)
    })

    it('keeps a project out when any crop is red', () => {
      const resolved = resolveProjectCrops(
        crops({ security: { sentiment: 'bad' } }),
        undefined,
      )
      expect(qualifiesForGarden(resolved, true)).toEqual(false)
    })

    it('keeps a project out until it has an ossification score', () => {
      const resolved = resolveProjectCrops(crops(), undefined)
      expect(qualifiesForGarden(resolved, false)).toEqual(false)
    })

    it('keeps it out even when the red crop is only partially reviewed', () => {
      const resolved = resolveProjectCrops(
        crops({ security: { sentiment: 'bad', status: 'partiallyReviewed' } }),
        undefined,
      )
      expect(qualifiesForGarden(resolved, true)).toEqual(false)
    })
  })

  describe('Security capped by ossification', () => {
    const security = (score: number, isUnverified = false) =>
      resolveProjectCrops(
        crops({ security: { sentiment: 'good', missing: ['Written.'] } }),
        { score, isUnverified },
      ).security

    it('keeps the written rating from 80 up', () => {
      expect(security(80)).toHaveSubset({
        sentiment: 'good',
        missing: ['Written.'],
      })
    })

    it('caps at warning below 80 and says why first', () => {
      expect(security(79)).toHaveSubset({
        sentiment: 'warning',
        missing: [
          'Ossification score below 80: critical contracts changed within about the last year.',
          'Written.',
        ],
      })
    })

    it('rates it bad below 50, which keeps the project out', () => {
      const capped = resolveProjectCrops(crops(), {
        score: 49,
        isUnverified: false,
      })
      expect(capped.security.sentiment).toEqual('bad')
      expect(qualifiesForGarden(capped, true)).toEqual(false)
    })

    it('blames unverified contracts rather than a recent change', () => {
      expect(security(0, true).missing[0]).toEqual(
        'No ossification score: some critical contracts are unverified.',
      )
    })

    it('never raises a written rating', () => {
      const capped = resolveProjectCrops(
        crops({ security: { sentiment: 'bad' } }),
        { score: 99, isUnverified: false },
      )
      expect(capped.security.sentiment).toEqual('bad')
    })
  })

  describe('DeFi project links', () => {
    const { scalingInfo: _, ...defiProject } = {
      ...UNISWAP,
      defiInfo: { category: 'DEX' } as ProjectDefiInfo,
    }
    const now = UnixTime(1_800_000_000)

    it('links a DeFi project to its page when ossification shows it', () => {
      expect(resolveCropsProject(defiProject, LEDGER, now).href).toEqual(
        'https://l2beat.com/defi/projects/uniswap-v3',
      )
    })

    it('does not link a DeFi project without an ossification history', () => {
      const { ossificationHistory: __, ...unmeasured } = defiProject
      expect(resolveCropsProject(unmeasured, LEDGER, now).href).toEqual(null)
    })
  })
})
