import type {
  ProjectAztecInclusionDelayChart,
  ProjectEthereumInclusionDelayChart,
  ProjectPolygonInclusionDelayChart,
} from '@l2beat/config'
import { expect } from 'earl'

import {
  calculateAztecDelayDays,
  calculateEthereumStyleDelayDays,
  calculatePolygonDelayDays,
  getInclusionDelayChartData,
} from './calculateInclusionDelay'

describe('calculateInclusionDelay', () => {
  describe(calculateEthereumStyleDelayDays.name, () => {
    const chart = {
      type: 'ethereum',
      validatorCount: 10,
      slotSeconds: 10,
      target: 0.99,
      maxCensorFraction: 0.5,
    } satisfies ProjectEthereumInclusionDelayChart

    it('returns one slot when nobody censors', () => {
      expect(calculateEthereumStyleDelayDays(chart, 0)).toEqual(10 / 86_400)
    })

    it('uses the honest proposer probability', () => {
      expect(calculateEthereumStyleDelayDays(chart, 4)).toEqual(60 / 86_400)
    })

    it('returns no finite delay without honest majority', () => {
      expect(calculateEthereumStyleDelayDays(chart, 5)).toEqual(null)
    })
  })

  describe(calculatePolygonDelayDays.name, () => {
    const chart = {
      type: 'polygon',
      validatorCount: 4,
      spanBlocks: 10,
      blockSeconds: 2,
      target: 0.99,
      maxCensorFraction: 0.5,
    } satisfies ProjectPolygonInclusionDelayChart

    it('returns one block when nobody censors', () => {
      expect(calculatePolygonDelayDays(chart, 0)).toEqual(2 / 86_400)
    })

    it('uses span-level proposer probability', () => {
      expect(calculatePolygonDelayDays(chart, 1)).toEqual(62 / 86_400)
    })

    it('returns no finite delay below the attestation threshold', () => {
      expect(calculatePolygonDelayDays(chart, 2)).toEqual(null)
    })
  })

  describe(calculateAztecDelayDays.name, () => {
    const chart = {
      type: 'aztec',
      validatorCount: 4,
      committeeSize: 2,
      epochSlots: 2,
      slotSeconds: 10,
      blockingThreshold: 0,
      target: 0.75,
      maxCensorFraction: 0.5,
    } satisfies ProjectAztecInclusionDelayChart

    it('returns one slot when nobody censors', () => {
      expect(calculateAztecDelayDays(chart, 0)).toEqual(10 / 86_400)
    })

    it('combines committee blocking probability across epochs', () => {
      expect(calculateAztecDelayDays(chart, 1)).toEqual(30 / 86_400)
    })
  })

  describe(getInclusionDelayChartData.name, () => {
    it('adds an ethereum comparison series at the project censoring fractions', () => {
      const chart = {
        type: 'ethereum',
        validatorCount: 4,
        slotSeconds: 5,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumInclusionDelayChart

      expect(getInclusionDelayChartData(chart)).toEqual([
        {
          censoringFraction: 0,
          projectDelayDays: 5 / 86_400,
          ethereumDelayDays: 12 / 86_400,
        },
        {
          censoringFraction: 0.25,
          projectDelayDays: 20 / 86_400,
          ethereumDelayDays: 48 / 86_400,
        },
        {
          censoringFraction: 0.5,
          projectDelayDays: null,
          ethereumDelayDays: null,
        },
      ])
    })
  })
})
