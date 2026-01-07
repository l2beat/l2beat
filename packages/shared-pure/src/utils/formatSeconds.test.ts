import { expect } from 'earl'

import { formatSeconds } from './formatSeconds.js'

describe(formatSeconds.name, () => {
  describe('short units', () => {
    it('rounds up seconds to lower unit', () => {
      expect(formatSeconds(1)).toEqual('1s')
      expect(formatSeconds(60)).toEqual('1m')
      expect(formatSeconds(61)).toEqual('1m 1s')
      expect(formatSeconds(3600)).toEqual('1h')
      expect(formatSeconds(3601)).toEqual('1h')
      expect(formatSeconds(3660)).toEqual('1h 1m')
      expect(formatSeconds(3661)).toEqual('1h 1m')

      expect(formatSeconds(86400)).toEqual('1d')
      expect(formatSeconds(86401)).toEqual('1d')
      expect(formatSeconds(86460)).toEqual('1d')
      expect(formatSeconds(86461)).toEqual('1d')
      expect(formatSeconds(90000)).toEqual('1d 1h')
      expect(formatSeconds(90060)).toEqual('1d 1h')
      expect(formatSeconds(90061)).toEqual('1d 1h')

      expect(formatSeconds(31536000)).toEqual('1y')
      expect(formatSeconds(63072000)).toEqual('2y')
      expect(formatSeconds(2592000)).toEqual('1mo')
      expect(formatSeconds(5184000)).toEqual('2mo')
      expect(formatSeconds(34128000)).toEqual('1y 1mo')
      expect(formatSeconds(34214400)).toEqual('1y 1mo')
      expect(formatSeconds(5270400)).toEqual('2mo 1d')
      expect(formatSeconds(5443200)).toEqual('2mo 3d')
      expect(formatSeconds(34218000)).toEqual('1y 1mo')
    })

    it('does not round up', () => {
      expect(formatSeconds(1, { preventRoundingUp: true })).toEqual('1s')
      expect(formatSeconds(60, { preventRoundingUp: true })).toEqual('1m')
      expect(formatSeconds(61, { preventRoundingUp: true })).toEqual('1m 1s')
      expect(formatSeconds(3600, { preventRoundingUp: true })).toEqual('1h')
      expect(formatSeconds(3601, { preventRoundingUp: true })).toEqual('1h 1s')
      expect(formatSeconds(3660, { preventRoundingUp: true })).toEqual('1h 1m')
      expect(formatSeconds(3661, { preventRoundingUp: true })).toEqual(
        '1h 1m 1s',
      )

      expect(formatSeconds(86400, { preventRoundingUp: true })).toEqual('1d')
      expect(formatSeconds(86401, { preventRoundingUp: true })).toEqual('1d 1s')
      expect(formatSeconds(86460, { preventRoundingUp: true })).toEqual('1d 1m')
      expect(formatSeconds(86461, { preventRoundingUp: true })).toEqual(
        '1d 1m 1s',
      )
      expect(formatSeconds(90000, { preventRoundingUp: true })).toEqual('1d 1h')
      expect(formatSeconds(90060, { preventRoundingUp: true })).toEqual(
        '1d 1h 1m',
      )
      expect(formatSeconds(90061, { preventRoundingUp: true })).toEqual(
        '1d 1h 1m 1s',
      )

      expect(formatSeconds(31536000, { preventRoundingUp: true })).toEqual('1y')
      expect(formatSeconds(2592000, { preventRoundingUp: true })).toEqual('1mo')
      expect(formatSeconds(34128000, { preventRoundingUp: true })).toEqual(
        '1y 1mo',
      )
      expect(formatSeconds(34214400, { preventRoundingUp: true })).toEqual(
        '1y 1mo 1d',
      )
      expect(formatSeconds(34218000, { preventRoundingUp: true })).toEqual(
        '1y 1mo 1d 1h',
      )
      expect(formatSeconds(5270461, { preventRoundingUp: true })).toEqual(
        '2mo 1d 1m 1s',
      )
    })
  })

  describe('full units names', () => {
    it('rounds up seconds to lower unit and pluralize unit', () => {
      expect(formatSeconds(1, { fullUnit: true })).toEqual('1 second')
      expect(formatSeconds(2, { fullUnit: true })).toEqual('2 seconds')
      expect(formatSeconds(60, { fullUnit: true })).toEqual('1 minute')
      expect(formatSeconds(120, { fullUnit: true })).toEqual('2 minutes')
      expect(formatSeconds(61, { fullUnit: true })).toEqual('1 minute 1 second')
      expect(formatSeconds(121, { fullUnit: true })).toEqual(
        '2 minutes 1 second',
      )
      expect(formatSeconds(3600, { fullUnit: true })).toEqual('1 hour')
      expect(formatSeconds(3601, { fullUnit: true })).toEqual('1 hour')
      expect(formatSeconds(3660, { fullUnit: true })).toEqual('1 hour 1 minute')
      expect(formatSeconds(3661, { fullUnit: true })).toEqual('1 hour 1 minute')
      expect(formatSeconds(7321, { fullUnit: true })).toEqual(
        '2 hours 2 minutes',
      )
      expect(formatSeconds(86400, { fullUnit: true })).toEqual('1 day')
      expect(formatSeconds(86401, { fullUnit: true })).toEqual('1 day')
      expect(formatSeconds(86401, { fullUnit: true })).toEqual('1 day')
      expect(formatSeconds(2 * 86460, { fullUnit: true })).toEqual('2 days')
      expect(formatSeconds(86461, { fullUnit: true })).toEqual('1 day')
      expect(formatSeconds(90000, { fullUnit: true })).toEqual('1 day 1 hour')
      expect(formatSeconds(90060, { fullUnit: true })).toEqual('1 day 1 hour')
      expect(formatSeconds(90061, { fullUnit: true })).toEqual('1 day 1 hour')

      expect(formatSeconds(31536000, { fullUnit: true })).toEqual('1 year')
      expect(formatSeconds(63072000, { fullUnit: true })).toEqual('2 years')
      expect(formatSeconds(2592000, { fullUnit: true })).toEqual('1 month')
      expect(formatSeconds(5184000, { fullUnit: true })).toEqual('2 months')
      expect(formatSeconds(34128000, { fullUnit: true })).toEqual(
        '1 year 1 month',
      )
      expect(formatSeconds(34214400, { fullUnit: true })).toEqual(
        '1 year 1 month',
      )
      expect(formatSeconds(5270400, { fullUnit: true })).toEqual(
        '2 months 1 day',
      )
    })

    it('does not round up', () => {
      expect(
        formatSeconds(1, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 second')
      expect(
        formatSeconds(2, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('2 seconds')
      expect(
        formatSeconds(60, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 minute')
      expect(
        formatSeconds(121, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('2 minutes 1 second')
      expect(
        formatSeconds(3600, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 hour')
      expect(
        formatSeconds(7202, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('2 hours 2 seconds')
      expect(
        formatSeconds(3660, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 hour 1 minute')
      expect(
        formatSeconds(3661, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 hour 1 minute 1 second')

      expect(
        formatSeconds(86400, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day')
      expect(
        formatSeconds(86402, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 2 seconds')
      expect(
        formatSeconds(86460, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 1 minute')
      expect(
        formatSeconds(86521, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 2 minutes 1 second')
      expect(
        formatSeconds(90000, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 1 hour')
      expect(
        formatSeconds(90060, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 1 hour 1 minute')
      expect(
        formatSeconds(90061, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 day 1 hour 1 minute 1 second')

      expect(
        formatSeconds(31536000, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 year')
      expect(
        formatSeconds(63072000, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('2 years')
      expect(
        formatSeconds(2592000, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 month')
      expect(
        formatSeconds(34128000, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 year 1 month')
      expect(
        formatSeconds(34214400, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 year 1 month 1 day')
      expect(
        formatSeconds(34218061, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('1 year 1 month 1 day 1 hour 1 minute 1 second')
      expect(
        formatSeconds(5270461, { preventRoundingUp: true, fullUnit: true }),
      ).toEqual('2 months 1 day 1 minute 1 second')
    })
  })
})
