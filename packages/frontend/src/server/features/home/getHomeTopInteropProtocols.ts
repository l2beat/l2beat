import { getLogger } from '../../utils/logger'
import {
  getInteropDashboardData,
  type InteropDashboardData,
} from '../layer2s/interop/getInteropDashboardData'
import type { CompactProtocolEntry } from '../layer2s/interop/types'
import { pickTopProtocolEntries } from '../layer2s/interop/utils/pickTopProtocolEntries'

/**
 * Picks the home card's rows on the server, so the page ships five slim rows
 * instead of the whole interop dashboard (every entry's tokens and chains).
 */
export async function getHomeTopInteropProtocols(
  chainIds: string[],
): Promise<CompactProtocolEntry[]> {
  if (chainIds.length === 0) {
    return []
  }
  // Interop reads its own tables, which should not take the home page down.
  try {
    const data = await getInteropDashboardData({ from: chainIds, to: chainIds })
    return selectHomeTopInteropProtocols(data)
  } catch (error) {
    getLogger().warn('Home top interop protocols failed', { error })
    return []
  }
}

export function selectHomeTopInteropProtocols(
  data: Pick<InteropDashboardData, 'entries' | 'topProtocols'> | null,
): CompactProtocolEntry[] {
  return pickTopProtocolEntries(data).map((entry) => ({
    slug: entry.slug,
    iconUrl: entry.iconUrl,
    name: entry.name,
    description: entry.description,
    type: entry.type,
    isAggregate: entry.isAggregate,
    subgroup: entry.subgroup,
    volume: entry.volume,
  }))
}
