import type { GasFeesDailyRecord } from '@l2beat/database'
import type { GasFeesChainId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getLogger } from '~/server/utils/logger'
import { isGasFeesChain } from '../chains'
import { getMockGasFeesDays } from '../mock/mockDays'

export type GasFeesDay = GasFeesDailyRecord & { chain: GasFeesChainId }

/** The stored chain-days, oldest first. A chain-day without a row is missing */
export async function getGasFeesDays(
  from: UnixTime,
  to: UnixTime,
): Promise<GasFeesDay[]> {
  if (env.MOCK) return getMockGasFeesDays(from, to)
  const records = await getDb().gasFeesDaily.getInRange(from, to)
  const unknown = new Set(
    records.flatMap((r) => (isGasFeesChain(r.chain) ? [] : [r.chain])),
  )
  if (unknown.size > 0) {
    getLogger()
      .for('getGasFeesDays')
      .warn('Stored gas fees of chains the page does not know', {
        chains: [...unknown],
      })
  }
  return records.filter((r): r is GasFeesDay => isGasFeesChain(r.chain))
}
