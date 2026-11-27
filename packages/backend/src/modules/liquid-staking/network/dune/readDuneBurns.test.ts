import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import {
  type BurnsDune,
  type BurnsRpc,
  getBurnsQuery,
  readDuneBurns,
} from './readDuneBurns'

const DAY = UnixTime.fromDate(new Date('2026-11-01T00:00:00Z'))
const NEXT = UnixTime(DAY + UnixTime.DAY)

describe(readDuneBurns.name, () => {
  it('reads each day, whatever order Dune returns them in', async () => {
    const dune = mockDune([
      row('2026-11-02', 101, 200, '7', 150, '42'),
      row('2026-11-01', 1, 100, '5', 50, '10'),
    ])
    const rpc = mockRpc(150, 42n)

    expect(await readDuneBurns(dune, rpc, DAY, NEXT)).toEqual(
      new Map([
        [DAY, { burn: 5n, blockCount: 100 }],
        [NEXT, { burn: 7n, blockCount: 100 }],
      ]),
    )
    expect(rpc.getFeeHistory).toHaveBeenOnlyCalledWith(1, 150, [])
  })

  it('skips the RPC check when no day had excess blob gas', async () => {
    const dune = mockDune([row('2026-11-01', 1, 100, '5')])
    const rpc = mockRpc(1, 1n)

    expect(await readDuneBurns(dune, rpc, DAY, DAY)).toEqual(
      new Map([[DAY, { burn: 5n, blockCount: 100 }]]),
    )
    expect(rpc.getFeeHistory).not.toHaveBeenCalled()
  })

  it('reads whole wei from scaled decimals without losing precision', async () => {
    const dune = mockDune([
      row('2026-11-01', 1, 100, '9007199254740993.00', 50, '1.00'),
    ])
    const rpc = mockRpc(50, 1n)

    expect(await readDuneBurns(dune, rpc, DAY, DAY)).toEqual(
      new Map([[DAY, { burn: 9007199254740993n, blockCount: 100 }]]),
    )
    expect(rpc.getFeeHistory).toHaveBeenOnlyCalledWith(1, 50, [])
  })

  it('rejects fractional wei', async () => {
    const dune = mockDune([row('2026-11-01', 1, 100, '5', 50, '1.01')])
    const rpc = mockRpc(50, 1n)

    await expect(readDuneBurns(dune, rpc, DAY, DAY)).toBeRejectedWith(
      SyntaxError,
    )
    expect(rpc.getFeeHistory).not.toHaveBeenCalled()
  })

  it('prefers the latest day whose blob gas price exceeds 1 wei', async () => {
    const dune = mockDune([
      row('2026-11-01', 1, 100, '5', 50, '42'),
      row('2026-11-02', 101, 200, '7', 150, '1'),
    ])
    const rpc = mockRpc(50, 42n)

    await readDuneBurns(dune, rpc, DAY, NEXT)
    expect(rpc.getFeeHistory).toHaveBeenOnlyCalledWith(1, 50, [])
  })

  it('throws when the RPC blob gas price disagrees with Dune SQL', async () => {
    const dune = mockDune([row('2026-11-01', 1, 100, '5', 50, '42')])
    const rpc = mockRpc(50, 41n)

    await expect(readDuneBurns(dune, rpc, DAY, DAY)).toBeRejectedWith(
      'Blob gas price does not match RPC',
    )
  })

  it('throws when a day is missing', async () => {
    const dune = mockDune([row('2026-11-01', 1, 100, '5')])

    await expect(
      readDuneBurns(dune, mockRpc(1, 1n), DAY, NEXT),
    ).toBeRejectedWith('Dune burns incomplete')
  })

  it('throws when a day misses a block', async () => {
    const dune = mockDune([{ ...row('2026-11-01', 1, 100, '5'), blocks: 99 }])

    await expect(
      readDuneBurns(dune, mockRpc(1, 1n), DAY, DAY),
    ).toBeRejectedWith('Dune burns incomplete')
  })

  it("throws when a day doesn't start where the day before ended", async () => {
    const dune = mockDune([
      row('2026-11-01', 1, 100, '5'),
      row('2026-11-02', 102, 201, '7'),
    ])

    await expect(
      readDuneBurns(dune, mockRpc(1, 1n), DAY, NEXT),
    ).toBeRejectedWith('Dune burns incomplete')
  })
})

describe(getBurnsQuery.name, () => {
  it('reads the days by literal dates, with blob fees and spot-check columns', () => {
    const sql = getBurnsQuery(DAY, NEXT)

    expect(sql).toInclude(
      "where b.date between date '2026-11-01' and date '2026-11-02'",
    )
    expect(sql).toInclude('b.excess_blob_gas')
    expect(sql).toInclude('blob_check_block')
    expect(sql).toInclude('blob_check_price')
  })
})

function row(
  day: string,
  first: number,
  last: number,
  burn: string,
  blobCheckBlock: number | null = null,
  blobCheckPrice: string | null = null,
) {
  return {
    day,
    blocks: last - first + 1,
    first_block: first,
    last_block: last,
    burn,
    blob_check_block: blobCheckBlock,
    blob_check_price: blobCheckPrice,
  }
}

function mockDune(rows: ReturnType<typeof row>[]): BurnsDune {
  return { query: mockFn().resolvesTo(rows) } as unknown as BurnsDune
}

function mockRpc(oldestBlock: number, blobGasPrice: bigint) {
  return {
    getFeeHistory: mockFn<BurnsRpc['getFeeHistory']>().resolvesTo({
      oldestBlock,
      baseFeePerGas: [0n, 0n],
      gasUsedRatio: [0],
      baseFeePerBlobGas: [blobGasPrice, blobGasPrice],
      blobGasUsedRatio: [0],
    }),
  }
}
