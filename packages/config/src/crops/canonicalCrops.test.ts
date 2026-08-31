import { expect } from 'earl'
import { resolveCropEvaluation } from './canonicalCrops'

describe('canonicalCrops', () => {
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
})
