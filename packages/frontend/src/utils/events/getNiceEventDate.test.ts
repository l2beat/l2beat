import { expect } from 'earl'

import { getNiceEventDate } from './getNiceEventDate'
import type { OneTimeEvent } from './getOneTimeEvents'
import { oneTimeEventMock } from './mocks'

describe(getNiceEventDate.name, () => {
  it('should return a date range if the start and end dates are different', () => {
    const event: OneTimeEvent = oneTimeEventMock({
      data: {
        startDate: new Date('2021-01-13T13:00:00.000Z'),
        endDate: new Date('2021-01-20T13:00:00.000Z'),
      },
    })
    expect(getNiceEventDate(event)).toEqual('2021 Jan 13 - 2021 Jan 20')
  })

  it('should return a date and time range if the start and end dates are the same', () => {
    const event: OneTimeEvent = oneTimeEventMock({
      data: {
        startDate: new Date('2021-01-13T13:00:00.000Z'),
        endDate: new Date('2021-01-13T14:00:00.000Z'),
      },
    })
    expect(getNiceEventDate(event)).toEqual('2021 Jan 13\n13:00 - 14:00 UTC')
  })

  it('should return startDate date and time if there is no end date', () => {
    const event: OneTimeEvent = oneTimeEventMock({
      data: {
        startDate: new Date('2021-01-13T13:00:00.000Z'),
      },
    })
    expect(getNiceEventDate(event)).toEqual('2021 Jan 13, 13:00 UTC')
  })
})
