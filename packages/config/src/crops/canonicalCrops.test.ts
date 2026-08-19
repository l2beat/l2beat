import { expect } from 'earl'
import type { ProjectCrops } from '../types'
import {
  resolveCropEvaluation,
  serializeCanonicalCrops,
  toCanonicalCrops,
} from './canonicalCrops'

describe('canonicalCrops', () => {
  describe(resolveCropEvaluation.name, () => {
    it('defaults a missing status to reviewed', () => {
      expect(resolveCropEvaluation({ sentiment: 'good' })).toEqual({
        sentiment: 'good',
        status: 'reviewed',
        points: [],
        missing: [],
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
  })

  describe(serializeCanonicalCrops.name, () => {
    const crops: ProjectCrops = {
      censorshipResistance: { sentiment: 'good', points: ['a', 'b'] },
      openSource: { sentiment: 'good' },
      privacy: { status: 'notReviewed', notReviewed: ['not looked at'] },
      security: {
        sentiment: 'warning',
        status: 'partiallyReviewed',
        missing: ['audits'],
      },
    }

    it('is stable across key order in the source object', () => {
      const reordered: ProjectCrops = {
        security: crops.security,
        privacy: crops.privacy,
        openSource: crops.openSource,
        censorshipResistance: crops.censorshipResistance,
      }
      expect(
        serializeCanonicalCrops(toCanonicalCrops('p', 'P', reordered)),
      ).toEqual(serializeCanonicalCrops(toCanonicalCrops('p', 'P', crops)))
    })

    it('emits the crops in a fixed order, with resolved defaults', () => {
      const serialized = serializeCanonicalCrops(
        toCanonicalCrops('uniswapv3', 'Uniswap V3', crops),
      )
      expect(serialized).toEqual(
        '{"projectId":"uniswapv3","projectName":"Uniswap V3","crops":{' +
          '"censorshipResistance":{"sentiment":"good","status":"reviewed","points":["a","b"],"missing":[],"notReviewed":[]},' +
          '"openSource":{"sentiment":"good","status":"reviewed","points":[],"missing":[],"notReviewed":[]},' +
          '"privacy":{"sentiment":"neutral","status":"notReviewed","points":[],"missing":[],"notReviewed":["not looked at"]},' +
          '"security":{"sentiment":"warning","status":"partiallyReviewed","points":[],"missing":["audits"],"notReviewed":[]}' +
          '}}',
      )
    })

    it('changes when a bullet is reordered', () => {
      const reordered: ProjectCrops = {
        ...crops,
        censorshipResistance: { sentiment: 'good', points: ['b', 'a'] },
      }
      expect(
        serializeCanonicalCrops(toCanonicalCrops('p', 'P', reordered)),
      ).not.toEqual(serializeCanonicalCrops(toCanonicalCrops('p', 'P', crops)))
    })

    it('does not change when an omitted field is spelled out as empty', () => {
      const explicit: ProjectCrops = {
        ...crops,
        openSource: {
          sentiment: 'good',
          status: 'reviewed',
          points: [],
          missing: [],
          notReviewed: [],
        },
      }
      expect(
        serializeCanonicalCrops(toCanonicalCrops('p', 'P', explicit)),
      ).toEqual(serializeCanonicalCrops(toCanonicalCrops('p', 'P', crops)))
    })

    it('escapes quotes so the preimage stays valid json', () => {
      const quoted: ProjectCrops = {
        ...crops,
        openSource: { sentiment: 'good', points: ['the "core" contracts'] },
      }
      const serialized = serializeCanonicalCrops(
        toCanonicalCrops('p', 'P', quoted),
      )
      expect(() => JSON.parse(serialized)).not.toThrow()
    })
  })
})
