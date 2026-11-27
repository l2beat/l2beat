import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { pastYear } from '../days'
import { getMockTippingInputs } from '../mock/mockTipping'
import { type PriceOfSpeed, toPriceOfSpeed } from './toPriceOfSpeed'
import { type TipPayers, toTipPayers } from './toTipPayers'

export interface GasFeesTipping {
  payers: TipPayers | undefined
  speed: PriceOfSpeed | undefined
}

/** The past year's complete days */
export async function getGasFeesTipping(
  now = UnixTime.now(),
): Promise<GasFeesTipping> {
  const [from, to] = pastYear(now)
  const inputs = env.MOCK
    ? getMockTippingInputs(from, to)
    : await readTippingInputs(from, to)
  return {
    payers: toTipPayers(inputs.payers),
    speed: toPriceOfSpeed({
      completeDays: inputs.mempoolDays
        .filter((d) => d.status === 'complete')
        .map((d) => d.timestamp),
      levelWaits: inputs.levelWaits,
      tierWaits: inputs.tierWaits,
      hourlyTips: inputs.hourlyTips,
    }),
  }
}

export type TippingInputs = Awaited<ReturnType<typeof readTippingInputs>>

async function readTippingInputs(from: UnixTime, to: UnixTime) {
  const db = getDb()
  const end = UnixTime(to + UnixTime.DAY - 1)
  const [payers, mempoolDays, levelWaits, tierWaits, hourlyTips] =
    await Promise.all([
      db.gasFeesTipPayersDaily.getInRange(from, to),
      db.gasFeesMempool.getDays(from, to),
      db.gasFeesMempool.getCompleteTipLevelWaitTotals(from, to),
      db.gasFeesMempool.getCompleteTierWaitTotals(from, to),
      db.gasFeesTipHourly.getInRange(from, end),
    ])
  return { payers, mempoolDays, levelWaits, tierWaits, hourlyTips }
}
