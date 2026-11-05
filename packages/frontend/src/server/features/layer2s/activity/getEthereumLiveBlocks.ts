import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { type LiveBlock, toLiveBlocks } from './utils/liveBlocks'

/** Short enough that each new block visibly moves the chart */
const LIVE_BLOCKS_WINDOW_SECONDS = 5 * UnixTime.MINUTE

/** Empty while the backend does not follow the head */
export async function getEthereumLiveBlocks(): Promise<LiveBlock[]> {
  if (env.MOCK) return []
  const records = await getDb().activityHeadBlock.getByProject(
    ProjectId.ETHEREUM,
  )
  return toLiveBlocks(records, LIVE_BLOCKS_WINDOW_SECONDS)
}
