import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  getLiveActivityRates,
  LIVE_RATE_FULL_HOURS,
  type LiveActivityRates,
} from './utils/liveActivity'

/** Null until the indexer counts a latest block, as after an invalidation */
export async function getEthereumLiveRates(): Promise<LiveActivityRates | null> {
  if (env.MOCK) return null
  const latestHours = await getDb().hourlyActivity.getLatestHours(
    ProjectId.ETHEREUM,
    LIVE_RATE_FULL_HOURS,
  )
  return latestHours ? getLiveActivityRates(latestHours) : null
}
