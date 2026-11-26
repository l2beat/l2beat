import type { GasFeesTipPayersStats } from '@l2beat/database'
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
export type TipPayersRow = v.infer<typeof TipPayersRow>

/** The day's figures before pricing: ethUsd and the fast tip come from our hourly tips */
export type TipPayersFigures = Omit<
  GasFeesTipPayersStats,
  'ethUsd' | 'fastTipGwei'
>

export interface TipPayersDay {
  /** Whether Dune has every block of the day and all of each block's transactions */
  whole: boolean
  /** What that check found */
  check: { blocks: number; incompleteBlocks: number; unknownCount: number }
  figures: TipPayersFigures
}

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
  return toTipPayersDay(row, input)
}

export function toTipPayersDay(
  row: TipPayersRow,
  input: Pick<TipPayersDayQueryInput, 'firstBlock' | 'lastBlock'>,
): TipPayersDay {
  return {
    whole:
      row.blocks === input.lastBlock - input.firstBlock + 1 &&
      row.incomplete_blocks === 0 &&
      row.unknown_count === 0,
    check: {
      blocks: row.blocks,
      incompleteBlocks: row.incomplete_blocks,
      unknownCount: row.unknown_count,
    },
    figures: {
      low: { txCount: row.low_count, tipEth: row.low_tip_eth },
      middle: { txCount: row.middle_count, tipEth: row.middle_tip_eth },
      high: { txCount: row.high_count, tipEth: row.high_tip_eth },
      roundTipTxCount: row.round_tip_count,
      atFastTipEth: row.at_fast_tip_eth,
      nonOrdinary: {
        txCount: row.non_ordinary_count,
        tipEth: row.non_ordinary_tip_eth,
      },
    },
  }
}
