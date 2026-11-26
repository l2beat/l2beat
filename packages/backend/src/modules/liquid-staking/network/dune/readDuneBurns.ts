import type { DuneQueryService, IRpcClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ethereumBlobGasPrice } from '../../../../tools/ethereumBlobGasPrice'

export type BurnsDune = Pick<DuneQueryService, 'query'>
export type BurnsRpc = Pick<IRpcClient, 'getFeeHistory'>

/** The ETH a UTC day's blocks burned. */
export interface BurnDay {
  /** Base fee × gas used, plus blob gas used × blob gas price, wei. */
  burn: bigint
  blockCount: number
}

const DuneBurnRow = v.object({
  day: v.string(),
  blocks: v.number(),
  first_block: v.number(),
  last_block: v.number(),
  burn: v.string(),
  blob_check_block: v.union([v.number(), v.null()]),
  blob_check_price: v.union([v.string(), v.null()]),
})

/**
 * The ETH burned on each UTC day from `fromDay` to `toDay`, both included, in
 * one Dune query over `ethereum.blocks`. Throws unless every day is there,
 * with its blocks in an unbroken run that continues the day before's, and
 * spot-checks a computed blob gas price against the RPC so a future BPO fork
 * fails loud instead of skewing cumulative supply.
 */
export async function readDuneBurns(
  dune: BurnsDune,
  rpc: BurnsRpc,
  fromDay: UnixTime,
  toDay: UnixTime,
): Promise<Map<UnixTime, BurnDay>> {
  const rows = await dune.query(
    getBurnsQuery(fromDay, toDay),
    'medium',
    v.array(DuneBurnRow),
  )
  const byDay = new Map(rows.map((row) => [row.day, row]))
  const burns = new Map<UnixTime, BurnDay>()
  let previousLastBlock: number | undefined
  let blobCheck: { block: number; price: bigint } | undefined
  let fallbackBlobCheck: { block: number; price: bigint } | undefined
  for (let day = fromDay; day <= toDay; day = UnixTime(day + UnixTime.DAY)) {
    const row = byDay.get(UnixTime.toYYYYMMDD(day))
    if (
      row === undefined ||
      row.blocks !== row.last_block - row.first_block + 1 ||
      (previousLastBlock !== undefined &&
        row.first_block !== previousLastBlock + 1)
    ) {
      throw new Error('Dune burns incomplete', {
        cause: { day, row, previousLastBlock },
      })
    }
    previousLastBlock = row.last_block
    burns.set(day, { burn: BigInt(row.burn), blockCount: row.blocks })
    if (row.blob_check_block !== null && row.blob_check_price !== null) {
      const check = {
        block: row.blob_check_block,
        price: BigInt(row.blob_check_price),
      }
      fallbackBlobCheck = check
      if (check.price > 1n) {
        blobCheck = check
      }
    }
  }
  const check = blobCheck ?? fallbackBlobCheck
  if (check) {
    const history = await rpc.getFeeHistory(1, check.block, [])
    const actual = history.baseFeePerBlobGas[0]
    if (history.oldestBlock !== check.block || actual !== check.price) {
      throw new Error('Blob gas price does not match RPC', {
        cause: {
          block: check.block,
          computed: check.price.toString(),
          actual: actual?.toString(),
          oldestBlock: history.oldestBlock,
        },
      })
    }
  }
  return burns
}

export function getBurnsQuery(fromDay: UnixTime, toDay: UnixTime): string {
  const checkKey =
    'if(excess_blob_gas > 0, cast(excess_blob_gas as decimal(38, 0)) * 1000000000000 + cast(number as decimal(38, 0)), null)'
  return `
with blocks as (
  select
    cast(b.date as varchar) as day,
    b.number,
    b.base_fee_per_gas,
    b.gas_used,
    b.blob_gas_used,
    b.excess_blob_gas,
    if(
      coalesce(b.blob_gas_used, 0) = 0 and coalesce(b.excess_blob_gas, 0) = 0,
      null,
      ${ethereumBlobGasPrice('b')}
    ) as blob_gas_price
  from ethereum.blocks as b
  where b.date between date '${UnixTime.toYYYYMMDD(fromDay)}' and date '${UnixTime.toYYYYMMDD(toDay)}'
)
select
  day,
  count(*) as blocks,
  min(number) as first_block,
  max(number) as last_block,
  cast(sum(
    cast(base_fee_per_gas as decimal(38, 0)) * cast(gas_used as decimal(38, 0))
    + if(
      coalesce(blob_gas_used, 0) = 0,
      0,
      cast(blob_gas_used as decimal(38, 0)) * blob_gas_price
    )
  ) as varchar) as burn,
  max_by(number, ${checkKey}) as blob_check_block,
  cast(max_by(blob_gas_price, ${checkKey}) as varchar) as blob_check_price
from blocks
group by 1
`
}
