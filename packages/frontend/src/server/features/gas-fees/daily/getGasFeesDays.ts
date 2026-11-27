import type { GasFeesDailyRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { type GasFeesChainId, isGasFeesChain } from '../chains'
import { getMockGasFeesDays } from '../mock/mockDays'

export type GasFeesDay = GasFeesDailyRecord & { chain: GasFeesChainId }

/** The stored chain-days, oldest first. A chain-day without a row is missing */
export async function getGasFeesDays(
  from: UnixTime,
  to: UnixTime,
): Promise<GasFeesDay[]> {
  if (env.MOCK) return getMockGasFeesDays(from, to)
  const records = await getDb().gasFeesDaily.getInRange(from, to)
  return records.filter((r): r is GasFeesDay => isGasFeesChain(r.chain))
}
