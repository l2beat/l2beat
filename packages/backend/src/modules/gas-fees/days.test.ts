import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { nextDays } from './days'

describe(nextDays.name, () => {
  const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))

  it('starts after the stored days and stops at the last finished one', () => {
    // Height: the end of 2026-10-01, `to`: midday of 2026-10-04
    expect(
      nextDays(day('2026-10-02') + 1, day('2026-10-04') + 12 * 3600, 10),
    ).toEqual([day('2026-10-02'), day('2026-10-03')])
  })

  it('starts at the first day from the initial height', () => {
    expect(nextDays(day('2026-10-02'), day('2026-10-09'), 2)).toEqual([
      day('2026-10-01'),
      day('2026-10-02'),
    ])
  })

  it('stays in one month', () => {
    expect(nextDays(day('2026-10-31') + 1, day('2026-11-05'), 10)).toEqual([
      day('2026-10-31'),
    ])
  })

  it('returns no day before one has finished', () => {
    expect(nextDays(day('2026-10-02') + 1, day('2026-10-02') + 3600)).toEqual(
      [],
    )
  })
})
