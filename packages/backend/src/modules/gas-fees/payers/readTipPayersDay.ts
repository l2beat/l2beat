import type { DuneQueryService } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import {
  getTipPayersDayQuery,
  type TipPayersDayQueryInput,
} from './getTipPayersDayQuery'

export type TipPayersDune = Pick<DuneQueryService, 'query'>

const TipPayersRow = v.object({
  blocks: v.number(),
  incomplete_blocks: v.number(),
  low_count: v.number(),
  low_tip_eth: v.number(),
  middle_count: v.number(),
  middle_tip_eth: v.number(),
  high_count: v.number(),
  high_tip_eth: v.number(),
  round_tip_count: v.number(),
  at_fast_tip_eth: v.number(),
  non_ordinary_count: v.number(),
  non_ordinary_tip_eth: v.number(),
  unknown_count: v.number(),
})
export type TipPayersDay = v.infer<typeof TipPayersRow>

export async function readTipPayersDay(
  dune: TipPayersDune,
  input: TipPayersDayQueryInput,
): Promise<TipPayersDay> {
  const rows = await dune.query(
    getTipPayersDayQuery(input),
    'medium',
    v.array(TipPayersRow),
  )
  const row = rows[0]
  if (rows.length !== 1 || row === undefined) {
    throw new Error('Tip payers day malformed', { cause: { day: input.day } })
  }
  return row
}

/** Whether Dune has every block of the day and all of each block's transactions */
export function isWholeTipPayersDay(
  day: TipPayersDay,
  input: Pick<TipPayersDayQueryInput, 'firstBlock' | 'lastBlock'>,
): boolean {
  return (
    day.blocks === input.lastBlock - input.firstBlock + 1 &&
    day.incomplete_blocks === 0 &&
    day.unknown_count === 0
  )
}
