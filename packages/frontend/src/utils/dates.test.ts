import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  formatDate,
  formatLocalDateTime,
  formatPublicationDate,
  formatRange,
  formatTimestamp,
  getNextDateForDayOfWeek,
} from './dates'

const at = (iso: string) => UnixTime.fromDate(new Date(iso))
const TIMEZONES = ['UTC', 'America/New_York', 'Asia/Tokyo']

function withTimezone(tz: string, fn: () => void) {
  const original = process.env.TZ
  process.env.TZ = tz
  try {
    fn()
  } finally {
    if (original === undefined) Reflect.deleteProperty(process.env, 'TZ')
    else process.env.TZ = original
  }
}

describe('dates', () => {
  describe(formatTimestamp.name, () => {
    it('formats a date as day, short month and year', () => {
      expect(formatTimestamp(at('2021-04-21T12:00:00Z'))).toEqual('21 Apr 2021')
      expect(formatTimestamp(at('2030-01-01T05:00:00Z'))).toEqual('1 Jan 2030')
      expect(
        formatTimestamp(at('1968-12-31T11:30:00Z'), { mode: 'date' }),
      ).toEqual('31 Dec 1968')
    })

    it('adds a 24-hour UTC time in datetime mode', () => {
      expect(
        formatTimestamp(at('2021-04-21T13:00:00Z'), { mode: 'datetime' }),
      ).toEqual('21 Apr 2021, 13:00 UTC')
      expect(
        formatTimestamp(at('2030-01-01T00:05:00Z'), { mode: 'datetime' }),
      ).toEqual('1 Jan 2030, 00:05 UTC')
    })

    it('formats only the UTC time in time mode', () => {
      expect(
        formatTimestamp(at('2030-01-01T05:00:00Z'), { mode: 'time' }),
      ).toEqual('05:00 UTC')
    })
  })

  describe(formatRange.name, () => {
    it('drops the month and year the start shares with the end', () => {
      expect(
        formatRange(at('2026-07-01T00:00:00Z'), at('2026-07-02T00:00:00Z')),
      ).toEqual('1 —\n2 Jul 2026')
      expect(
        formatRange(at('2026-06-30T00:00:00Z'), at('2026-07-07T00:00:00Z')),
      ).toEqual('30 Jun —\n7 Jul 2026')
      expect(
        formatRange(at('2025-12-31T00:00:00Z'), at('2026-01-01T00:00:00Z')),
      ).toEqual('31 Dec 2025 —\n1 Jan 2026')
    })

    it('formats ranges shorter than a day as UTC hours', () => {
      expect(
        formatRange(at('2026-06-30T01:00:00Z'), at('2026-06-30T02:00:00Z')),
      ).toEqual('30 Jun 2026, 01:00 — 02:00 UTC')
    })
  })

  describe(formatDate.name, () => {
    it('formats a YYYY-MM-DD date', () => {
      expect(formatDate('2024-08-01')).toEqual('1 Aug 2024')
    })
  })

  describe(formatLocalDateTime.name, () => {
    it('formats the instant in the visitor zone with its UTC offset', () => {
      withTimezone('America/New_York', () => {
        expect(formatLocalDateTime(at('2026-07-01T02:00:00Z'))).toEqual(
          '30 Jun 2026, 22:00 UTC-4',
        )
      })
      withTimezone('Asia/Kolkata', () => {
        expect(formatLocalDateTime(at('2026-07-01T14:00:00Z'))).toEqual(
          '1 Jul 2026, 19:30 UTC+5:30',
        )
      })
    })

    it('returns nothing when the visitor zone is at UTC+0', () => {
      withTimezone('Europe/London', () => {
        expect(formatLocalDateTime(at('2026-12-01T14:00:00Z'))).toEqual(
          undefined,
        )
      })
    })
  })

  describe(getNextDateForDayOfWeek.name, () => {
    it('returns next date for given day of the week', () => {
      const date = new Date('2021-04-21T12:00:00Z')
      const nextThursday = getNextDateForDayOfWeek(4, date)
      expect(nextThursday.toISOString()).toEqual('2021-04-22T00:00:00.000Z')
    })

    for (const tz of TIMEZONES) {
      it(`uses the UTC day regardless of process timezone (TZ=${tz})`, () => {
        withTimezone(tz, () => {
          // Wednesday 20:00 UTC is already Thursday in Asia/Tokyo
          expect(
            getNextDateForDayOfWeek(
              4,
              new Date('2021-04-21T20:00:00Z'),
            ).toISOString(),
          ).toEqual('2021-04-22T00:00:00.000Z')
          // Saturday 02:00 UTC is still Friday, 30 April in America/New_York
          expect(
            getNextDateForDayOfWeek(
              6,
              new Date('2021-05-01T02:00:00Z'),
            ).toISOString(),
          ).toEqual('2021-05-08T00:00:00.000Z')
        })
      })
    }
  })

  describe(formatPublicationDate.name, () => {
    for (const tz of TIMEZONES) {
      it(`formats the UTC day regardless of process timezone (TZ=${tz})`, () => {
        withTimezone(tz, () => {
          // Still 31 July in America/New_York
          expect(formatPublicationDate(new Date('2024-08-01'))).toEqual(
            '1 Aug 2024',
          )
          // Already 1 January 2025 in Asia/Tokyo
          expect(
            formatPublicationDate(new Date('2024-12-31T23:30:00Z')),
          ).toEqual('31 Dec 2024')
        })
      })
    }
  })
})
