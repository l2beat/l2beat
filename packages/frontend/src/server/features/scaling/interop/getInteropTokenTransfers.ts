import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { env } from '~/env'
import { ps } from '~/server/projects'
import {
  getTransferBridge,
  toInteropProtocolTransferDetailsItem,
} from './getInteropProtocolTransfers'
import type {
  InteropProtocolTransfersResponse,
  InteropTokenTransfersParams,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAbstractTokenIds } from './utils/getAbstractTokenIds'
import { getFilteredInteropTransfersPage } from './utils/getFilteredInteropTransfersPage'
import { getMockInteropTransfers } from './utils/getMockInteropTransfers'
import { INTEROP_CHAIN_DETAILS } from './utils/interopChainDetails'

export async function getInteropTokenTransfers({
  tokenId,
  from,
  to,
  snapshotTimestamp,
  limit,
  cursor,
}: InteropTokenTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return { items: [], nextCursor: undefined }
  }

  if (env.MOCK) {
    return getMockInteropTransfers({ tokenId, from, to })
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const plugins = interopProjects.flatMap(
    (project) => project.interopConfig.plugins,
  )
  if (plugins.length === 0) {
    return { items: [], nextCursor: undefined }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]

  const result = await getFilteredInteropTransfersPage({
    tokenId,
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    matcher,
    limit,
    cursor,
  })
  const tokensDetailsMap = await buildTokensDetailsMap(
    getAbstractTokenIds(result.items),
  )

  return {
    items: result.items.map((transfer) => {
      const bridge = getTransferBridge(transfer, interopProjects)
      return toInteropProtocolTransferDetailsItem(
        transfer,
        INTEROP_CHAIN_DETAILS,
        tokensDetailsMap,
        bridge,
      )
    }),
    nextCursor: result.nextCursor,
  }
}
