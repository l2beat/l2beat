import { describe, expect, it } from 'vitest'

import { formatSeconds } from './formatSeconds.js'

describe(formatSeconds.name, () => {
  describe('short units', () => {
    it('rounds up seconds to lower unit', () => {
      expect(formatSeconds(1)).toBe('1s')
      expect(formatSeconds(60)).toBe('1m')
      expect(formatSeconds(61)).toBe('1m 1s')
      expect(formatSeconds(3600)).toBe('1h')
      expect(formatSeconds(3601)).toBe('1h')
      expect(formatSeconds(3660)).toBe('1h 1m')
      expect(formatSeconds(3661)).toBe('1h 1m')

      expect(formatSeconds(86400)).toBe('1d')
      expect(formatSeconds(86401)).toBe('1d')
      expect(formatSeconds(86460)).toBe('1d')
      expect(formatSeconds(86461)).toBe('1d')
      expect(formatSeconds(90000)).toBe('1d 1h')
      expect(formatSeconds(90060)).toBe('1d 1h')
      expect(formatSeconds(90061)).toBe('1d 1h')

      expect(formatSeconds(31536000)).toBe('1y')
      expect(formatSeconds(63072000)).toBe('2y')
      expect(formatSeconds(2592000)).toBe('1mo')
      expect(formatSeconds(5184000)).toBe('2mo')
      expect(formatSeconds(34128000)).toBe('1y 1mo')
      expect(formatSeconds(34214400)).toBe('1y 1mo')
      expect(formatSeconds(5270400)).toBe('2mo 1d')
      expect(formatSeconds(5443200)).toBe('2mo 3d')
      expect(formatSeconds(34218000)).toBe('1y 1mo')
    })

    it('does not round up', () => {
      expect(formatSeconds(1, { preventRoundingUp: true })).toBe('1s')
      expect(formatSeconds(60, { preventRoundingUp: true })).toBe('1m')
      expect(formatSeconds(61, { preventRoundingUp: true })).toBe('1m 1s')
      expect(formatSeconds(3600, { preventRoundingUp: true })).toBe('1h')
      expect(formatSeconds(3601, { preventRoundingUp: true })).toBe('1h 1s')
      expect(formatSeconds(3660, { preventRoundingUp: true })).toBe('1h 1m')
      expect(formatSeconds(3661, { preventRoundingUp: true })).toBe('1h 1m 1s')

      expect(formatSeconds(86400, { preventRoundingUp: true })).toBe('1d')
      expect(formatSeconds(86401, { preventRoundingUp: true })).toBe('1d 1s')
      expect(formatSeconds(86460, { preventRoundingUp: true })).toBe('1d 1m')
      expect(formatSeconds(86461, { preventRoundingUp: true })).toBe('1d 1m 1s')
      expect(formatSeconds(90000, { preventRoundingUp: true })).toBe('1d 1h')
      expect(formatSeconds(90060, { preventRoundingUp: true })).toBe('1d 1h 1m')
      expect(formatSeconds(90061, { preventRoundingUp: true })).toBe(
        '1d 1h 1m 1s',
      )

      expect(formatSeconds(31536000, { preventRoundingUp: true })).toBe('1y')
      expect(formatSeconds(2592000, { preventRoundingUp: true })).toBe('1mo')
      expect(formatSeconds(34128000, { preventRoundingUp: true })).toBe(
        '1y 1mo',
      )
      expect(formatSeconds(34214400, { preventRoundingUp: true })).toBe(
        '1y 1mo 1d',
      )
      expect(formatSeconds(34218000, { preventRoundingUp: true })).toBe(
        '1y 1mo 1d 1h',
      )
      expect(formatSeconds(5270461, { preventRoundingUp: true })).toBe(
        '2mo 1d 1m 1s',
      )
    })
  })

  describe('negative and bigint input', () => {
    it('formats negative values with a minus sign', () => {
      expect(formatSeconds(-1)).toBe('-1s')
      expect(formatSeconds(-61)).toBe('-1m 1s')
      expect(formatSeconds(-61, { fullUnit: true })).toBe('-1 minute 1 second')
    })

    it('accepts bigint values', () => {
      expect(formatSeconds(61n)).toBe('1m 1s')
      expect(formatSeconds(0n)).toBe('0s')
      expect(formatSeconds(-61n)).toBe('-1m 1s')
      expect(formatSeconds(-61n, { fullUnit: true })).toBe('-1 minute 1 second')
    })

    it('keeps bigint arithmetic exact above MAX_SAFE_INTEGER', () => {
      expect(
        formatSeconds(9007199254740993n, { preventRoundingUp: true }),
      ).toBe('285616414y 8mo 24d 7h 36m 33s')
    })

    it('formats zero with both rounding styles', () => {
      expect(formatSeconds(0, { preventRoundingUp: true })).toBe('0s')
      expect(
        formatSeconds(0, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('0 seconds')
    })
  })

  describe('full units names', () => {
    it('rounds up seconds to lower unit and pluralize unit', () => {
      expect(formatSeconds(1, { fullUnit: true })).toBe('1 second')
      expect(formatSeconds(2, { fullUnit: true })).toBe('2 seconds')
      expect(formatSeconds(60, { fullUnit: true })).toBe('1 minute')
      expect(formatSeconds(120, { fullUnit: true })).toBe('2 minutes')
      expect(formatSeconds(61, { fullUnit: true })).toBe('1 minute 1 second')
      expect(formatSeconds(121, { fullUnit: true })).toBe('2 minutes 1 second')
      expect(formatSeconds(3600, { fullUnit: true })).toBe('1 hour')
      expect(formatSeconds(3601, { fullUnit: true })).toBe('1 hour')
      expect(formatSeconds(3660, { fullUnit: true })).toBe('1 hour 1 minute')
      expect(formatSeconds(3661, { fullUnit: true })).toBe('1 hour 1 minute')
      expect(formatSeconds(7321, { fullUnit: true })).toBe('2 hours 2 minutes')
      expect(formatSeconds(86400, { fullUnit: true })).toBe('1 day')
      expect(formatSeconds(86401, { fullUnit: true })).toBe('1 day')
      expect(formatSeconds(86401, { fullUnit: true })).toBe('1 day')
      expect(formatSeconds(2 * 86460, { fullUnit: true })).toBe('2 days')
      expect(formatSeconds(86461, { fullUnit: true })).toBe('1 day')
      expect(formatSeconds(90000, { fullUnit: true })).toBe('1 day 1 hour')
      expect(formatSeconds(90060, { fullUnit: true })).toBe('1 day 1 hour')
      expect(formatSeconds(90061, { fullUnit: true })).toBe('1 day 1 hour')

      expect(formatSeconds(31536000, { fullUnit: true })).toBe('1 year')
      expect(formatSeconds(63072000, { fullUnit: true })).toBe('2 years')
      expect(formatSeconds(2592000, { fullUnit: true })).toBe('1 month')
      expect(formatSeconds(5184000, { fullUnit: true })).toBe('2 months')
      expect(formatSeconds(34128000, { fullUnit: true })).toBe('1 year 1 month')
      expect(formatSeconds(34214400, { fullUnit: true })).toBe('1 year 1 month')
      expect(formatSeconds(5270400, { fullUnit: true })).toBe('2 months 1 day')
    })

    it('does not round up', () => {
      expect(
        formatSeconds(1, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 second')
      expect(
        formatSeconds(2, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('2 seconds')
      expect(
        formatSeconds(60, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 minute')
      expect(
        formatSeconds(121, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('2 minutes 1 second')
      expect(
        formatSeconds(3600, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 hour')
      expect(
        formatSeconds(7202, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('2 hours 2 seconds')
      expect(
        formatSeconds(3660, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 hour 1 minute')
      expect(
        formatSeconds(3661, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 hour 1 minute 1 second')

      expect(
        formatSeconds(86400, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day')
      expect(
        formatSeconds(86402, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 2 seconds')
      expect(
        formatSeconds(86460, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 1 minute')
      expect(
        formatSeconds(86521, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 2 minutes 1 second')
      expect(
        formatSeconds(90000, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 1 hour')
      expect(
        formatSeconds(90060, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 1 hour 1 minute')
      expect(
        formatSeconds(90061, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 day 1 hour 1 minute 1 second')

      expect(
        formatSeconds(31536000, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 year')
      expect(
        formatSeconds(63072000, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('2 years')
      expect(
        formatSeconds(2592000, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 month')
      expect(
        formatSeconds(34128000, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 year 1 month')
      expect(
        formatSeconds(34214400, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 year 1 month 1 day')
      expect(
        formatSeconds(34218061, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('1 year 1 month 1 day 1 hour 1 minute 1 second')
      expect(
        formatSeconds(5270461, { preventRoundingUp: true, fullUnit: true }),
      ).toBe('2 months 1 day 1 minute 1 second')
    })
  })
})
