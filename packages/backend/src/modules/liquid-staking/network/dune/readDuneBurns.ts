import type { DuneQueryService } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ethereumBlobGasPrice } from '../../../../tools/ethereumBlobGasPrice'

export type BurnsDune = Pick<DuneQueryService, 'query'>

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
})

/**
 * The ETH burned on each UTC day from `fromDay` to `toDay`, both included, in
 * one Dune query over `ethereum.blocks`. Throws unless every day is there,
 * with its blocks in an unbroken run that continues the day before's.
 */
export async function readDuneBurns(
  dune: BurnsDune,
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
  }
  return burns
}

export function getBurnsQuery(fromDay: UnixTime, toDay: UnixTime): string {
  return `
select
  cast(b.date as varchar) as day,
  count(*) as blocks,
  min(b.number) as first_block,
  max(b.number) as last_block,
  cast(sum(
    cast(b.base_fee_per_gas as decimal(38, 0)) * cast(b.gas_used as decimal(38, 0))
    + if(
      coalesce(b.blob_gas_used, 0) = 0,
      0,
      cast(b.blob_gas_used as decimal(38, 0)) * ${ethereumBlobGasPrice('b')}
    )
  ) as varchar) as burn
from ethereum.blocks as b
where b.date between date '${UnixTime.toYYYYMMDD(fromDay)}' and date '${UnixTime.toYYYYMMDD(toDay)}'
group by 1
`
}
