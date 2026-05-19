import type {
  ProjectCommitteeLikeInclusionDelayChart,
  ProjectEthereumLikeInclusionDelayChart,
  ProjectSpanLikeInclusionDelayChart,
} from '@l2beat/config'
import { expect } from 'earl'

import {
  calculateCommitteeLikeDelayDays,
  calculateEthereumLikeDelayDays,
  calculateSpanLikeDelayDays,
  getInclusionDelayChartData,
  getInclusionDelayEntityLegendEntries,
  getInclusionDelayEntityThresholds,
} from './calculateInclusionDelay'

describe('calculateInclusionDelay', () => {
  describe(calculateEthereumLikeDelayDays.name, () => {
    const chart = {
      type: 'ethereumlike',
      validatorCount: 10,
      slotSeconds: 10,
      target: 0.99,
      maxCensorFraction: 0.5,
    } satisfies ProjectEthereumLikeInclusionDelayChart

    it('returns one slot when nobody censors', () => {
      expect(calculateEthereumLikeDelayDays(chart, 0)).toEqual(10 / 86_400)
    })

    it('uses the honest proposer probability', () => {
      expect(calculateEthereumLikeDelayDays(chart, 4)).toEqual(60 / 86_400)
    })

    it('returns no finite delay without honest majority', () => {
      expect(calculateEthereumLikeDelayDays(chart, 5)).toEqual(null)
    })
  })

  describe(calculateSpanLikeDelayDays.name, () => {
    const chart = {
      type: 'spanlike',
      validatorCount: 4,
      spanBlocks: 10,
      blockSeconds: 2,
      target: 0.99,
      maxCensorFraction: 0.5,
    } satisfies ProjectSpanLikeInclusionDelayChart

    it('returns one block when nobody censors', () => {
      expect(calculateSpanLikeDelayDays(chart, 0)).toEqual(2 / 86_400)
    })

    it('uses span-level proposer probability', () => {
      expect(calculateSpanLikeDelayDays(chart, 1)).toEqual(62 / 86_400)
    })

    it('returns no finite delay below the attestation threshold', () => {
      expect(calculateSpanLikeDelayDays(chart, 2)).toEqual(null)
    })
  })

  describe(calculateCommitteeLikeDelayDays.name, () => {
    const chart = {
      type: 'committeelike',
      validatorCount: 4,
      committeeSize: 2,
      epochSlots: 2,
      slotSeconds: 10,
      blockingThreshold: 0,
      target: 0.75,
      maxCensorFraction: 0.5,
    } satisfies ProjectCommitteeLikeInclusionDelayChart

    it('returns one slot when nobody censors', () => {
      expect(calculateCommitteeLikeDelayDays(chart, 0)).toEqual(10 / 86_400)
    })

    it('combines committee blocking probability across epochs', () => {
      expect(calculateCommitteeLikeDelayDays(chart, 1)).toEqual(30 / 86_400)
    })
  })

  describe(getInclusionDelayChartData.name, () => {
    it('adds an ethereum comparison series at the project censoring fractions', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 4,
        slotSeconds: 5,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

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

  describe(getInclusionDelayEntityLegendEntries.name, () => {
    it('includes the next cumulative entity that cannot be drawn on the chart', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
        entityStakeDistribution: {
          stakeToken: 'TEST',
          totalStake: 100,
          entities: [
            { name: 'Second', stake: 15 },
            { name: 'First', stake: 25 },
            { name: 'Third', stake: 10 },
            { name: 'Outside', stake: 5 },
          ],
        },
      } satisfies ProjectEthereumLikeInclusionDelayChart

      expect(getInclusionDelayEntityLegendEntries(chart)).toEqual([
        {
          id: '1-First',
          label: 'Top 1',
          entityCount: 1,
          entityNames: ['First'],
          stakeFraction: 0.25,
          delayDays: 40 / 86_400,
        },
        {
          id: '2-Second',
          label: 'Top 2',
          entityCount: 2,
          entityNames: ['First', 'Second'],
          stakeFraction: 0.4,
          delayDays: 60 / 86_400,
        },
        {
          id: '3-Third',
          label: 'Top 3',
          entityCount: 3,
          entityNames: ['First', 'Second', 'Third'],
          stakeFraction: 0.5,
          delayDays: null,
        },
      ])
    })
  })

  describe(getInclusionDelayEntityThresholds.name, () => {
    it('returns the first cumulative entity above each delay threshold', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
        entityStakeDistribution: {
          stakeToken: 'TEST',
          totalStake: 100,
          entities: [
            { name: 'Second', stake: 15 },
            { name: 'First', stake: 25 },
            { name: 'Third', stake: 10 },
          ],
        },
      } satisfies ProjectEthereumLikeInclusionDelayChart

      expect(
        getInclusionDelayEntityThresholds(chart, [30 / 86_400, 50 / 86_400, 7]),
      ).toEqual([
        {
          thresholdDays: 30 / 86_400,
          entry: {
            id: '1-First',
            label: 'Top 1',
            entityCount: 1,
            entityNames: ['First'],
            stakeFraction: 0.25,
            delayDays: 40 / 86_400,
          },
        },
        {
          thresholdDays: 50 / 86_400,
          entry: {
            id: '2-Second',
            label: 'Top 2',
            entityCount: 2,
            entityNames: ['First', 'Second'],
            stakeFraction: 0.4,
            delayDays: 60 / 86_400,
          },
        },
        {
          thresholdDays: 7,
          entry: {
            id: '3-Third',
            label: 'Top 3',
            entityCount: 3,
            entityNames: ['First', 'Second', 'Third'],
            stakeFraction: 0.5,
            delayDays: null,
          },
        },
      ])
    })
  })
})
