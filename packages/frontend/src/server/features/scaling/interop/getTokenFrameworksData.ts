import type { Project } from '@l2beat/config'
import sumBy from 'lodash/sumBy'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type { InteropSelectionInput } from './types'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  getProtocolsDataMap,
  type ProtocolData,
} from './utils/getProtocolsDataMap'
import {
  TOKEN_FRAMEWORKS,
  type TokenFrameworkDefinition,
} from './utils/tokenFrameworksList'

export type FrameworkDominanceEntry = {
  id: string
  volume: number
  transferCount: number
  averageDurationSeconds: number | null
  averageValue: number | null
}

export type FrameworkDominanceMetric = {
  total: number
  entries: FrameworkDominanceEntry[]
}

export type TokenFrameworksData = {
  frameworkDominance: {
    transfers: FrameworkDominanceMetric
    volume: FrameworkDominanceMetric
  }
}

export async function getTokenFrameworksData(
  params: InteropSelectionInput,
): Promise<TokenFrameworksData> {
  if (env.MOCK) {
    return getMockTokenFrameworksData()
  }

  const frameworkProjectIds = TOKEN_FRAMEWORKS.map((f) => f.projectId)

  const [interopProjects, { records }] = await Promise.all([
    ps.getProjects({ select: ['interopConfig'] }),
    getLatestAggregatedInteropTransferWithTokens(
      params,
      undefined,
      frameworkProjectIds,
    ),
  ])

  const protocolsDataMap = getProtocolsDataMap(records)
  const projectsById = new Map(interopProjects.map((p) => [p.id, p]))

  const entries: FrameworkDominanceEntry[] = TOKEN_FRAMEWORKS.map((framework) =>
    buildFrameworkEntry(
      framework,
      protocolsDataMap.get(framework.projectId),
      projectsById.get(framework.projectId),
    ),
  )

  return {
    frameworkDominance: {
      transfers: {
        total: sumBy(entries, (e) => e.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (e) => e.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
  }
}

function buildFrameworkEntry(
  framework: TokenFrameworkDefinition,
  data: ProtocolData | undefined,
  project: Project<'interopConfig'> | undefined,
): FrameworkDominanceEntry {
  if (!data) {
    return {
      id: framework.id,
      volume: 0,
      transferCount: 0,
      averageDurationSeconds: null,
      averageValue: null,
    }
  }

  return {
    id: framework.id,
    volume: data.volume,
    transferCount: data.transferCount,
    averageDurationSeconds: getSingleAverageDurationSeconds(data, project),
    averageValue:
      data.identifiedTransferCount > 0
        ? data.volume / data.identifiedTransferCount
        : null,
  }
}

function getSingleAverageDurationSeconds(
  data: ProtocolData,
  project: Project<'interopConfig'> | undefined,
): number | null {
  if (project?.interopConfig.transfersTimeMode === 'unknown') return null
  if (data.transfersWithDurationCount <= 0) return null
  return Math.floor(data.totalDurationSum / data.transfersWithDurationCount)
}

function getMockTokenFrameworksData(): TokenFrameworksData {
  const entries: FrameworkDominanceEntry[] = TOKEN_FRAMEWORKS.map(
    (framework, i) => ({
      id: framework.id,
      volume: 20_000_000 - i * 3_000_000,
      transferCount: 5000 - i * 800,
      averageDurationSeconds: 100_000 - i * 10_000,
      averageValue: 4000 - i * 500,
    }),
  )

  return {
    frameworkDominance: {
      transfers: {
        total: sumBy(entries, (e) => e.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (e) => e.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
  }
}
