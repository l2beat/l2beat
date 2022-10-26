import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getLastDay } from '../../../../src/core/transaction-count/starkex/getLastDay'

describe(getLastDay.name, () => {
  it('return start of previous day', () => {
    const now = UnixTime.fromDays(1)
    const delay = 0
    const lastDay = getLastDay(now, delay)
    expect(lastDay).toEqual(0)
  })

  it('takes api delay into consideration', () => {
    const now = UnixTime.fromDays(3).add(4, 'hours')
    const delay = 6
    const lastDay = getLastDay(now, delay)
    expect(lastDay).toEqual(1)
  })
})
