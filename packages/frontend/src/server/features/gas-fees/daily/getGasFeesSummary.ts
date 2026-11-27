import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { toDayRange } from '../days'
import { getGasFeesDays } from './getGasFeesDays'
import { type ChainSummary, summarizeChains } from './summarizeChains'

export const GasFeesSummaryParams = v.object({ range: ChartRange })
export type GasFeesSummaryParams = v.infer<typeof GasFeesSummaryParams>

export async function getGasFeesSummary({
  range,
}: GasFeesSummaryParams): Promise<ChainSummary[]> {
  const [from, to] = toDayRange(range)
  return summarizeChains(await getGasFeesDays(from, to), from)
}
