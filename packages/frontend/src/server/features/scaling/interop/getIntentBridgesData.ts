import type { Project } from '@l2beat/config'
import { type ProjectId, UnixTime, unique } from '@l2beat/shared-pure'
import { env } from '~/env'
import { ps } from '~/server/projects'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import type {
  AverageDuration,
  InteropSelectionInput,
  ProtocolDisplayable,
  ProtocolEntry,
  TokenData,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAverageDurationSeconds } from './utils/getAverageDuration'
import { getIntentProjects } from './utils/getIntentProjects'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getPreviousProtocolData } from './utils/getPreviousProtocolData'
import { getProtocolEntries } from './utils/getProtocolEntries'
import {
  getProtocolsDataMap,
  type ProtocolData,
} from './utils/getProtocolsDataMap'
import { getSummaryTokensData } from './utils/getSummaryTokensData'
import { getTopItems, type TopItems } from './utils/getTopItems'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'

const TOP_ITEMS_LIMIT = 5

export type IntentBridgeActivityEntry = {
  id: ProjectId
  volume: number
  transferCount: number
  previousVolume: number | null
  previousTransferCount: number | null
  /** Per-bridge-type breakdown, for the split-aware table cell display. */
  averageDuration: AverageDuration | null
  /** Overall count-weighted average, matching the token frameworks scalar. */
  averageDurationSeconds: number | null
  averageValue: number | null
}

export type IntentBridgesActivity = {
  totalVolume: number
  totalTransferCount: number
  entries: IntentBridgeActivityEntry[]
}

export type IntentBridgeTableData = {
  entries: ProtocolEntry[]
  zeroTransferProtocols: ProtocolDisplayable[]
}

export type IntentBridgesData = {
  activity: IntentBridgesActivity
  topTokens: TopItems<TokenData>
  table: IntentBridgeTableData
  transferSizeChartData: TransferSizeDataPoint[] | undefined
  snapshotTimestamp: number | undefined
  changePeriod: PercentageChangePeriod
}

export async function getIntentBridgesData(
  params: InteropSelectionInput,
): Promise<IntentBridgesData> {
  if (env.MOCK) {
    return getMockIntentBridgesData()
  }

  const interopProjects = await ps.getProjects({ select: ['interopConfig'] })
  const intentProjects = getIntentProjects(interopProjects)
  const intentProjectIds = intentProjects.map((project) =>
    project.id.toString(),
  )

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens({
      selection: params,
      protocolIds: intentProjectIds,
    })

  const previousProtocolData = await getPreviousProtocolData(
    snapshotTimestamp,
    params,
    intentProjectIds,
  )

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const summaryTokens = getSummaryTokensData(
    records,
    tokensDetailsMap,
    intentProjects,
  )
  const table = getProtocolEntries(
    records,
    tokensDetailsMap,
    intentProjects,
    undefined,
    snapshotTimestamp,
    params,
    TOP_ITEMS_LIMIT,
  )
  const protocolsDataMap = getProtocolsDataMap(records)
  const activityEntries = getActivityEntries(
    intentProjects,
    table.entries,
    protocolsDataMap,
    previousProtocolData,
  )

  return {
    activity: {
      totalVolume: activityEntries.reduce(
        (sum, entry) => sum + entry.volume,
        0,
      ),
      totalTransferCount: activityEntries.reduce(
        (sum, entry) => sum + entry.transferCount,
        0,
      ),
      entries: activityEntries.toSorted((a, b) => b.volume - a.volume),
    },
    topTokens: getTopItems(summaryTokens, TOP_ITEMS_LIMIT),
    table,
    transferSizeChartData: getTransferSizeChartData(records, intentProjects),
    snapshotTimestamp,
    changePeriod: 'last24h',
  }
}

function getActivityEntries(
  intentProjects: Project<'interopConfig'>[],
  tableEntries: ProtocolEntry[],
  protocolsDataMap: Map<string, ProtocolData>,
  previousProtocolData: Map<string, { volume: number; transferCount: number }>,
): IntentBridgeActivityEntry[] {
  const tableEntriesById = new Map(
    tableEntries.map((entry) => [entry.id, entry]),
  )

  return intentProjects.map((project) => {
    const entry = tableEntriesById.get(project.id)
    const previous = previousProtocolData.get(project.id)
    const data = protocolsDataMap.get(project.id)
    const averageDurationSeconds = data
      ? getAverageDurationSeconds(data, project)
      : null

    if (!entry) {
      return {
        id: project.id,
        volume: 0,
        transferCount: 0,
        previousVolume: previous?.volume ?? null,
        previousTransferCount: previous?.transferCount ?? null,
        averageDuration: null,
        averageDurationSeconds,
        averageValue: null,
      }
    }

    return {
      id: project.id,
      volume: entry.volume,
      transferCount: entry.transferCount,
      previousVolume: previous?.volume ?? null,
      previousTransferCount: previous?.transferCount ?? null,
      averageDuration: entry.averageDuration,
      averageDurationSeconds,
      averageValue: entry.averageValue,
    }
  })
}

function getMockIntentBridgesData(): IntentBridgesData {
  return {
    activity: {
      totalVolume: 0,
      totalTransferCount: 0,
      entries: [],
    },
    topTokens: { items: [], remainingCount: 0 },
    table: { entries: [], zeroTransferProtocols: [] },
    transferSizeChartData: undefined,
    snapshotTimestamp: UnixTime.now(),
    changePeriod: 'last24h',
  }
}
