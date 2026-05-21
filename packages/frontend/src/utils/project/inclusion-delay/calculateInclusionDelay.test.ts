import type {
  ProjectCommitteeInclusionDelayConfig,
  ProjectSingleSlotInclusionDelayConfig,
  ProjectSpanInclusionDelayConfig,
} from '@l2beat/config'
import { expect } from 'earl'

import {
  calculateCommitteeDelaySeconds,
  calculateEthereumComparisonDelaySeconds,
  calculateInclusionDelayForCensoringFraction,
  calculateProjectDelaySeconds,
  calculateSingleSlotDelaySeconds,
  calculateSpanDelaySeconds,
  getDelayThresholdMarkers,
  getEntityStakeMarkers,
  getInclusionDelaySeries,
} from './calculateInclusionDelay'

describe('calculateInclusionDelay', () => {
  describe(calculateSingleSlotDelaySeconds.name, () => {
    const config = {
      type: 'singleSlot',
      validatorCount: 10,
      slotSeconds: 10,
      targetPercentile: 0.99,
      maxCensoringFraction: 0.5,
    } satisfies ProjectSingleSlotInclusionDelayConfig

    it('returns one slot when nobody censors', () => {
      expect(calculateSingleSlotDelaySeconds(config, 0)).toEqual(10)
    })

    it('uses the honest proposer probability', () => {
      expect(calculateSingleSlotDelaySeconds(config, 4)).toEqual(60)
    })

    it('returns no finite delay without honest majority', () => {
      expect(calculateSingleSlotDelaySeconds(config, 5)).toEqual(null)
    })
  })

  describe(calculateSpanDelaySeconds.name, () => {
    const config = {
      type: 'span',
      validatorCount: 4,
      spanBlocks: 10,
      blockSeconds: 2,
      targetPercentile: 0.99,
      maxCensoringFraction: 0.5,
    } satisfies ProjectSpanInclusionDelayConfig

    it('returns one block when nobody censors', () => {
      expect(calculateSpanDelaySeconds(config, 0)).toEqual(2)
    })

    it('uses span-level proposer probability', () => {
      expect(calculateSpanDelaySeconds(config, 1)).toEqual(62)
    })

    it('returns no finite delay below the attestation threshold', () => {
      expect(calculateSpanDelaySeconds(config, 2)).toEqual(null)
    })
  })

  describe(calculateCommitteeDelaySeconds.name, () => {
    const config = {
      type: 'committee',
      validatorCount: 4,
      committeeSize: 2,
      epochSlots: 2,
      slotSeconds: 10,
      blockingThreshold: 0,
      targetPercentile: 0.75,
      maxCensoringFraction: 0.5,
    } satisfies ProjectCommitteeInclusionDelayConfig

    it('returns one slot when nobody censors', () => {
      expect(calculateCommitteeDelaySeconds(config, 0)).toEqual(10)
    })

    it('combines committee blocking probability across epochs', () => {
      expect(calculateCommitteeDelaySeconds(config, 1)).toEqual(30)
    })
  })

  describe(getInclusionDelaySeries.name, () => {
    it('adds an ethereum comparison series at the project censoring fractions', () => {
      const config = {
        type: 'singleSlot',
        validatorCount: 4,
        slotSeconds: 5,
        targetPercentile: 0.99,
        maxCensoringFraction: 0.5,
      } satisfies ProjectSingleSlotInclusionDelayConfig

      expect(getInclusionDelaySeries(config)).toEqual([
        {
          censoringFraction: 0,
          projectDelaySeconds: 5,
          ethereumComparisonDelaySeconds: 12,
        },
        {
          censoringFraction: 0.25,
          projectDelaySeconds: 20,
          ethereumComparisonDelaySeconds: 48,
        },
        {
          censoringFraction: 0.5,
          projectDelaySeconds: null,
          ethereumComparisonDelaySeconds: null,
        },
      ])
    })
  })

  describe(getEntityStakeMarkers.name, () => {
    it('includes the next cumulative entity that cannot be drawn on the chart', () => {
      const config = {
        type: 'singleSlot',
        validatorCount: 10,
        slotSeconds: 10,
        targetPercentile: 0.99,
        maxCensoringFraction: 0.5,
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
      } satisfies ProjectSingleSlotInclusionDelayConfig

      expect(getEntityStakeMarkers(config)).toEqual([
        {
          id: '1-First',
          label: 'Top 1',
          entityCount: 1,
          entityNames: ['First'],
          stakeFraction: 0.25,
          delaySeconds: 40,
        },
        {
          id: '2-Second',
          label: 'Top 2',
          entityCount: 2,
          entityNames: ['First', 'Second'],
          stakeFraction: 0.4,
          delaySeconds: 60,
        },
        {
          id: '3-Third',
          label: 'Top 3',
          entityCount: 3,
          entityNames: ['First', 'Second', 'Third'],
          stakeFraction: 0.5,
          delaySeconds: null,
        },
      ])
    })
  })

  describe(calculateEthereumComparisonDelaySeconds.name, () => {
    it('returns one slot when nobody censors', () => {
      expect(
        calculateEthereumComparisonDelaySeconds({
          censoringFraction: 0,
          targetPercentile: 0.99,
        }),
      ).toEqual(12)
    })

    it('uses the censoring fraction as a slot censoring probability', () => {
      expect(
        calculateEthereumComparisonDelaySeconds({
          censoringFraction: 0.25,
          targetPercentile: 0.99,
        }),
      ).toEqual(48)
    })

    it('returns no finite delay without honest majority', () => {
      expect(
        calculateEthereumComparisonDelaySeconds({
          censoringFraction: 0.5,
          targetPercentile: 0.99,
        }),
      ).toEqual(null)
    })

    it('supports custom slot duration', () => {
      expect(
        calculateEthereumComparisonDelaySeconds({
          censoringFraction: 0.25,
          targetPercentile: 0.99,
          slotSeconds: 10,
        }),
      ).toEqual(40)
    })
  })

  describe(calculateInclusionDelayForCensoringFraction.name, () => {
    const config = {
      type: 'singleSlot',
      validatorCount: 10,
      slotSeconds: 10,
      targetPercentile: 0.99,
      maxCensoringFraction: 0.5,
    } satisfies ProjectSingleSlotInclusionDelayConfig

    it('calculates delay for a censoring fraction', () => {
      expect(calculateInclusionDelayForCensoringFraction(config, 0.4)).toEqual(
        60,
      )
    })

    it('rejects fractions outside the probability range', () => {
      expect(() =>
        calculateInclusionDelayForCensoringFraction(config, 1.1),
      ).toThrow('censoringFraction must be between 0 and 1')
    })
  })

  describe(getDelayThresholdMarkers.name, () => {
    it('returns markers on exact delay thresholds', () => {
      const config = {
        type: 'singleSlot',
        validatorCount: 10,
        slotSeconds: 10,
        targetPercentile: 0.99,
        maxCensoringFraction: 0.5,
      } satisfies ProjectSingleSlotInclusionDelayConfig

      expect(
        getDelayThresholdMarkers(config, [
          { label: '50s', seconds: 50 },
          { label: '2m', seconds: 120 },
        ]),
      ).toEqual([
        {
          id: 'delay-threshold-50s',
          label: '50s delay',
          censoringFraction: 0.35,
          delaySeconds: 50,
        },
      ])
    })
  })

  describe('config validation', () => {
    const config = {
      type: 'committee',
      validatorCount: 4,
      committeeSize: 2,
      epochSlots: 2,
      slotSeconds: 10,
      blockingThreshold: 0,
      targetPercentile: 0.75,
      maxCensoringFraction: 0.5,
    } satisfies ProjectCommitteeInclusionDelayConfig

    it('rejects non-integer validator counts', () => {
      expect(() =>
        getInclusionDelaySeries({ ...config, validatorCount: 4.5 }),
      ).toThrow('validatorCount must be an integer')
    })

    it('rejects invalid target percentiles', () => {
      expect(() =>
        getInclusionDelaySeries({ ...config, targetPercentile: Number.NaN }),
      ).toThrow('targetPercentile must be between 0 and 1')
    })

    it('rejects invalid max censoring fractions', () => {
      expect(() =>
        getInclusionDelaySeries({
          ...config,
          maxCensoringFraction: Number.POSITIVE_INFINITY,
        }),
      ).toThrow('maxCensoringFraction must be between 0 and 1')
    })

    it('rejects committee size greater than validator count', () => {
      expect(() =>
        getInclusionDelaySeries({ ...config, committeeSize: 5 }),
      ).toThrow('committeeSize must be between 1 and validatorCount')
    })

    it('rejects invalid blocking thresholds', () => {
      expect(() =>
        getInclusionDelaySeries({ ...config, blockingThreshold: 2.5 }),
      ).toThrow('blockingThreshold must be an integer')

      expect(() =>
        getInclusionDelaySeries({ ...config, blockingThreshold: 3 }),
      ).toThrow('blockingThreshold must be between 0 and committeeSize')
    })
  })

  describe('delay monotonicity', () => {
    it('is monotonic for representative configs', () => {
      const configs = [
        {
          type: 'singleSlot',
          validatorCount: 10,
          slotSeconds: 10,
          targetPercentile: 0.99,
          maxCensoringFraction: 0.5,
        },
        {
          type: 'span',
          validatorCount: 10,
          spanBlocks: 10,
          blockSeconds: 2,
          targetPercentile: 0.99,
          maxCensoringFraction: 0.5,
        },
        {
          type: 'committee',
          validatorCount: 10,
          committeeSize: 4,
          epochSlots: 4,
          slotSeconds: 10,
          blockingThreshold: 1,
          targetPercentile: 0.99,
          maxCensoringFraction: 0.5,
        },
      ] as const

      for (const config of configs) {
        let previousDelay = 0
        for (
          let censorCount = 0;
          censorCount <= config.validatorCount;
          censorCount++
        ) {
          const delay = calculateProjectDelaySeconds(config, censorCount)
          const comparableDelay = delay ?? Number.POSITIVE_INFINITY

          expect(comparableDelay >= previousDelay).toEqual(true)
          previousDelay = comparableDelay
        }
      }
    })
  })
})
