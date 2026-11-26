import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { type BurnsDune, getBurnsQuery, readDuneBurns } from './readDuneBurns'

const DAY = UnixTime.fromDate(new Date('2026-11-01T00:00:00Z'))
const NEXT = UnixTime(DAY + UnixTime.DAY)

describe(readDuneBurns.name, () => {
  it('reads each day, whatever order Dune returns them in', async () => {
    const dune = mockDune([
      row('2026-11-02', 101, 200, '7'),
      row('2026-11-01', 1, 100, '5'),
    ])

    expect(await readDuneBurns(dune, DAY, NEXT)).toEqual(
      new Map([
        [DAY, { burn: 5n, blockCount: 100 }],
        [NEXT, { burn: 7n, blockCount: 100 }],
      ]),
    )
  })

  it('throws when a day is missing', async () => {
    const dune = mockDune([row('2026-11-01', 1, 100, '5')])

    await expect(readDuneBurns(dune, DAY, NEXT)).toBeRejectedWith(
      'Dune burns incomplete',
    )
  })

  it('throws when a day misses a block', async () => {
    const dune = mockDune([{ ...row('2026-11-01', 1, 100, '5'), blocks: 99 }])

    await expect(readDuneBurns(dune, DAY, DAY)).toBeRejectedWith(
      'Dune burns incomplete',
    )
  })

  it("throws when a day doesn't start where the day before ended", async () => {
    const dune = mockDune([
      row('2026-11-01', 1, 100, '5'),
      row('2026-11-02', 102, 201, '7'),
    ])

    await expect(readDuneBurns(dune, DAY, NEXT)).toBeRejectedWith(
      'Dune burns incomplete',
    )
  })
})

describe(getBurnsQuery.name, () => {
  it('reads the days by literal dates, with blob fees', () => {
    const sql = getBurnsQuery(DAY, NEXT)

    expect(sql).toInclude(
      "where b.date between date '2026-11-01' and date '2026-11-02'",
    )
    expect(sql).toInclude('b.excess_blob_gas')
  })
})

function row(day: string, first: number, last: number, burn: string) {
  return {
    day,
    blocks: last - first + 1,
    first_block: first,
    last_block: last,
    burn,
  }
}

function mockDune(rows: ReturnType<typeof row>[]): BurnsDune {
  return { query: mockFn().resolvesTo(rows) } as unknown as BurnsDune
}
