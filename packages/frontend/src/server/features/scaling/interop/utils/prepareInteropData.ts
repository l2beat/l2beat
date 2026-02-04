import type { Project } from '@l2beat/config'
import type { InteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getTokenDb } from '~/server/tokenDb'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getLatestAggregatedInteropTransferWithTokens } from './getLatestAggregatedInteropTransferWithTokens'

export type PreparedInteropData = {
  records: AggregatedInteropTransferWithTokens[]
  tokensDetailsMap: Map<string, { symbol: string; iconUrl: string | null }>
  interopProjects: Project<'interopConfig'>[]
  subgroupProjects: Set<ProjectId>
}

export async function prepareInteropData(
  from: string[],
  to: string[],
  type?: InteropBridgeType,
): Promise<PreparedInteropData> {
  const tokenDb = getTokenDb()
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  const records = await getLatestAggregatedInteropTransferWithTokens(
    from,
    to,
    type,
  )

  const tokensDetailsData = await tokenDb.abstractToken.getByIds(
    records.flatMap((r) => r.tokens.map((token) => token.abstractTokenId)),
  )
  const tokensDetailsMap = new Map<
    string,
    { symbol: string; iconUrl: string | null }
  >(tokensDetailsData.map((t) => [t.id, t]))

  // Projects that are part of other projects
  const subgroupProjects = new Set(
    interopProjects.filter((p) => p.interopConfig.subgroupId).map((p) => p.id),
  )

  return {
    records,
    tokensDetailsMap,
    interopProjects,
    subgroupProjects,
  }
}
