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
  getEthereumComparisonDelay,
  getInclusionDelayData,
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

  describe(getEthereumComparisonDelay.name, () => {
    it('computes the ethereum reference independently of any project model', () => {
      // The reference only depends on the censoring fraction and the confidence
      // target (12s slots), so it can be reused as one baseline across projects.
      const points = getEthereumComparisonDelay(0.5, 0.99)
      const at = (fraction: number) =>
        points.find((point) => point.censoringFraction === fraction)

      expect(at(0)).toEqual({ censoringFraction: 0, delayDays: 12 / 86_400 })
      expect(at(0.25)).toEqual({
        censoringFraction: 0.25,
        delayDays: 48 / 86_400,
      })
      expect(at(0.5)).toEqual({ censoringFraction: 0.5, delayDays: null })
    })
  })

  describe(getInclusionDelayData.name, () => {
    it('samples the project delay across the full fraction range', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 4,
        slotSeconds: 5,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      // Continuous models are sampled at a fixed resolution, so the line spans
      // the full fraction range with a delay computed at every point.
      const { projectPoints } = getInclusionDelayData(chart)
      const at = (fraction: number) =>
        projectPoints.find((point) => point.censoringFraction === fraction)

      expect(at(0)).toEqual({ censoringFraction: 0, delayDays: 5 / 86_400 })
      expect(at(0.25)).toEqual({
        censoringFraction: 0.25,
        delayDays: 20 / 86_400,
      })
      expect(at(0.5)).toEqual({ censoringFraction: 0.5, delayDays: null })
    })

    it('includes the next cumulative entity that cannot be drawn on the chart', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
        stakeDistribution: {
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

      expect(getInclusionDelayData(chart).entityLegendEntries).toEqual([
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

    it('snaps entity stake fractions to the sampling step', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 100_000,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
        stakeDistribution: {
          stakeToken: 'TEST',
          totalStake: 800,
          // 123 / 800 = 0.15375, which rounds to the nearest 0.1% step.
          entities: [{ name: 'A', stake: 123 }],
        },
      } satisfies ProjectEthereumLikeInclusionDelayChart

      const [entry] = getInclusionDelayData(chart).entityLegendEntries
      expect(entry?.stakeFraction).toEqual(0.154)
    })

    it('samples at a fixed 0.1% resolution regardless of validator count', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 100_000,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      const { projectPoints } = getInclusionDelayData(chart)
      // 0 to 0.5 in 0.001 steps => 501 evenly-spaced samples.
      expect(projectPoints.length).toEqual(501)
      expect(projectPoints[0]?.censoringFraction).toEqual(0)
      expect(projectPoints[1]?.censoringFraction).toEqual(0.001)
      const last = projectPoints[projectPoints.length - 1]
      expect(last?.censoringFraction).toEqual(0.5)
    })

    it('produces a single sample when maxCensorFraction is 0', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      expect(getInclusionDelayData(chart).projectPoints).toEqual([
        { censoringFraction: 0, delayDays: 10 / 86_400 },
      ])
    })

    it('places threshold markers at the start of the matching delay plateau', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      // The delay steps from 10s to 20s once censoring crosses ~1%, so the 20s
      // marker sits at the first sampled fraction on the 20s plateau.
      expect(
        getInclusionDelayData(chart, [{ label: '20s', days: 20 / 86_400 }])
          .thresholdMarkers,
      ).toEqual([
        {
          id: 'delay-threshold-20s',
          label: '20s delay',
          censoringFraction: 0.011,
          delayDays: 20 / 86_400,
        },
      ])
    })

    it('omits threshold markers the project delay line does not reach', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      // Project delay caps out below 7d before going null; the 7d/30d
      // thresholds are never crossed and must not produce markers.
      expect(
        getInclusionDelayData(chart, [
          { label: '1m', days: 60 / 86_400 },
          { label: '7d', days: 7 },
          { label: '30d', days: 30 },
        ]).thresholdMarkers.map((m) => m.label),
      ).toEqual(['1m delay'])
    })

    it('returns markers on exact delay thresholds', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      expect(
        getInclusionDelayData(chart, [
          { label: '50s', days: 50 / 86_400 },
          { label: '60s', days: 60 / 86_400 },
        ]).thresholdMarkers,
      ).toEqual([
        {
          id: 'delay-threshold-50s',
          label: '50s delay',
          censoringFraction: 0.317,
          delayDays: 50 / 86_400,
        },
        {
          id: 'delay-threshold-60s',
          label: '60s delay',
          censoringFraction: 0.399,
          delayDays: 60 / 86_400,
        },
      ])
    })

    it('snaps threshold markers up to the first sample that reaches the threshold', () => {
      const chart = {
        type: 'spanlike',
        validatorCount: 100,
        spanBlocks: 16,
        blockSeconds: 2,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectSpanLikeInclusionDelayChart

      // The delay steps from 2s at 0.010 to 34s at 0.011, so a 10s threshold
      // crosses at ~0.01025. Rounding to the nearest step would snap that back
      // to 0.010, where the delay is still only 2s; the marker must instead land
      // on 0.011, the first sample that actually reaches the threshold.
      expect(
        getInclusionDelayData(chart, [{ label: '10s', days: 10 / 86_400 }])
          .thresholdMarkers,
      ).toEqual([
        {
          id: 'delay-threshold-10s',
          label: '10s delay',
          censoringFraction: 0.011,
          delayDays: 10 / 86_400,
        },
      ])
    })

    it('snaps threshold markers that cross between samples to the step', () => {
      const chart = {
        type: 'ethereumlike',
        validatorCount: 10,
        slotSeconds: 10,
        target: 0.99,
        maxCensorFraction: 0.5,
      } satisfies ProjectEthereumLikeInclusionDelayChart

      // 25s falls between the 20s and 30s plateaus, so the interpolated crossing
      // (~0.1005) lands off the 0.1% grid and is snapped onto it.
      expect(
        getInclusionDelayData(chart, [{ label: '25s', days: 25 / 86_400 }])
          .thresholdMarkers,
      ).toEqual([
        {
          id: 'delay-threshold-25s',
          label: '25s delay',
          censoringFraction: 0.101,
          delayDays: 25 / 86_400,
        },
      ])
    })
  })
})
