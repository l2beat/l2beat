import { expect } from 'earl'
import { withTimezone } from '../withTimezone'
import { getNiceEventDate } from './getNiceEventDate'
import { oneTimeEventMock } from './mocks'

// Method: build events from UTC instants and compare the rendered string, so
// each case pins the format users see in the governance events list.
function niceDate(startIso: string, endIso?: string) {
  const event = oneTimeEventMock({
    data: {
      startDate: new Date(startIso),
      endDate: endIso ? new Date(endIso) : undefined,
    },
  })
  return getNiceEventDate(event)
}

describe(getNiceEventDate.name, () => {
  it('shows the start date and time when there is no end', () => {
    expect(niceDate('2021-01-13T13:00:00Z')).toEqual('13 Jan 2021, 13:00 UTC')
  })

  it('shows one date and a time range for an event within a UTC day', () => {
    expect(niceDate('2021-01-13T13:00:00Z', '2021-01-13T14:00:00Z')).toEqual(
      '13 Jan 2021, 13:00 — 14:00 UTC',
    )
  })

  it('shows a date range for an event over several days', () => {
    expect(niceDate('2021-01-13T13:00:00Z', '2021-01-20T13:00:00Z')).toEqual(
      '13 —\n20 Jan 2021',
    )
  })

  it('shows a date range for a short event that crosses UTC midnight', () => {
    expect(niceDate('2021-01-13T22:00:00Z', '2021-01-14T02:00:00Z')).toEqual(
      '13 —\n14 Jan 2021',
    )
  })

  it('compares UTC days west of UTC, where local days differ', () => {
    // 23:00 and 01:00 in New York: two local days, one UTC day
    withTimezone('America/New_York', () => {
      expect(niceDate('2021-01-13T04:00:00Z', '2021-01-13T06:00:00Z')).toEqual(
        '13 Jan 2021, 04:00 — 06:00 UTC',
      )
    })
  })
})
