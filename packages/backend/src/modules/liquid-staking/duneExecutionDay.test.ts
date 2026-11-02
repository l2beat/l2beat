import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  type ExecutionDayDune,
  getExecutionDaySql,
  readExecutionDayFromDune,
} from './duneExecutionDay'

const DAY = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
const FROM = 26093738
const TO = 26100913

describe(readExecutionDayFromDune.name, () => {
  it('reads the day from one row', async () => {
    const dune = mockDune([row()])

    expect(
      await readExecutionDayFromDune(dune, Logger.SILENT, DAY, FROM, TO),
    ).toEqual({
      withdrawals: 17783987752533n * 10n ** 9n,
      builderPayments: 109499241721763035748n,
      priorityFees: 11342204523998130812n,
      directTransfers: 9248098868536388n,
      blockCount: 7176,
      builderBlockCount: 6157,
    })
    expect(dune.query).toHaveBeenOnlyCalledWith(
      getExecutionDaySql(DAY, FROM, TO),
      'medium',
      expect.anything(),
    )
  })

  it('logs large builder payments', async () => {
    const logger = mockObject<Logger>({ warn: mockFn().returns(undefined) })
    const dune = mockDune([row({ large_builder_payment_blocks: [FROM + 5] })])

    await readExecutionDayFromDune(dune, logger, DAY, FROM, TO)

    expect(logger.warn).toHaveBeenOnlyCalledWith('Large builder payments', {
      day: DAY,
      blocks: [FROM + 5],
    })
  })

  const incomplete: [string, object][] = [
    ['a block is missing', { blocks: 7175, last_block: TO - 1 }],
    ['the range is shifted', { first_block: FROM + 1, last_block: TO + 1 }],
    ["a block's transactions are missing", { incomplete_blocks: 1 }],
    ['withdrawals have a gap', { withdrawal_count: 114815 }],
    [
      'the last block has no withdrawals yet',
      { last_withdrawal_block: TO - 1 },
    ],
    [
      'the first block has no withdrawals',
      { first_withdrawal_block: FROM + 1 },
    ],
  ]
  for (const [name, change] of incomplete) {
    it(`fails when ${name}`, async () => {
      await expect(
        readExecutionDayFromDune(
          mockDune([row(change)]),
          Logger.SILENT,
          DAY,
          FROM,
          TO,
        ),
      ).toBeRejectedWith('Dune execution day incomplete')
    })
  }

  it('fails without exactly one row', async () => {
    await expect(
      readExecutionDayFromDune(mockDune([]), Logger.SILENT, DAY, FROM, TO),
    ).toBeRejectedWith('Dune execution day incomplete')
  })
})

describe(getExecutionDaySql.name, () => {
  it('reads only the day, by partition and by block', () => {
    const sql = getExecutionDaySql(DAY, FROM, TO)

    expect(sql).toInclude(
      `where date = date '2026-10-01' and number between ${FROM} and ${TO}`,
    )
    for (const table of ['transactions', 'withdrawals']) {
      expect(sql).toInclude(
        `from ethereum.${table}\n  where block_date = date '2026-10-01' and block_number between ${FROM} and ${TO}`,
      )
    }
  })
})

function mockDune(rows: unknown[]) {
  return mockObject<ExecutionDayDune>({
    query: async (_sql, _performance, schema) => schema.parse(rows),
  })
}

/** 2026-10-01 as Dune returned it, matching the blocks read over RPC. */
function row(change: object = {}) {
  return {
    blocks: 7176,
    first_block: FROM,
    last_block: TO,
    incomplete_blocks: 0,
    builder_blocks: 6157,
    large_builder_payment_blocks: null,
    builder_payments: '109499241721763035748',
    priority_fees: '11342204523998130812',
    direct_transfers: '9248098868536388',
    withdrawal_count: 114816,
    withdrawal_span: 114816,
    first_withdrawal_block: FROM,
    last_withdrawal_block: TO,
    withdrawals_gwei: '17783987752533',
    ...change,
  }
}
