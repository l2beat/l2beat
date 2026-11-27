import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { parseReportDate } from './parseReportDate'

describe(parseReportDate.name, () => {
  it('parses ISO days and falls back to the id suffix', () => {
    expect(parseReportDate('2024-03-01')).toEqual(UnixTime(1709251200))
    expect(parseReportDate(null, 'consensys-umbra-2021-03')).toEqual(
      UnixTime(1614556800),
    )
    expect(parseReportDate(undefined, 'no-date-here')).toEqual(undefined)
    expect(parseReportDate('not a date', 'x-2021-03')).toEqual(undefined)
  })
})
