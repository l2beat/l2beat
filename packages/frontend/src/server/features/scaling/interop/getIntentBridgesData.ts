import type { Project } from '@l2beat/config'
import {
  getInteropTransferValue,
  type ProjectId,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type {
  AverageDuration,
  InteropSelectionInput,
  ProtocolDisplayable,
  ProtocolEntry,
  TokenData,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getIntentProjects } from './utils/getIntentProjects'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getProtocolEntries } from './utils/getProtocolEntries'
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
  averageDuration: AverageDuration | null
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
  const activityEntries = getActivityEntries(
    intentProjects,
    table.entries,
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
  }
}

function getActivityEntries(
  intentProjects: Project<'interopConfig'>[],
  tableEntries: ProtocolEntry[],
  previousProtocolData: Map<string, { volume: number; transferCount: number }>,
): IntentBridgeActivityEntry[] {
  const tableEntriesById = new Map(
    tableEntries.map((entry) => [entry.id, entry]),
  )

  return intentProjects.map((project) => {
    const entry = tableEntriesById.get(project.id)
    const previous = previousProtocolData.get(project.id)

    if (!entry) {
      return {
        id: project.id,
        volume: 0,
        transferCount: 0,
        previousVolume: previous?.volume ?? null,
        previousTransferCount: previous?.transferCount ?? null,
        averageDuration: null,
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
      averageValue: entry.averageValue,
    }
  })
}

async function getPreviousProtocolData(
  snapshotTimestamp: UnixTime | undefined,
  params: InteropSelectionInput,
  intentProjectIds: string[],
): Promise<Map<string, { volume: number; transferCount: number }>> {
  const result = new Map<string, { volume: number; transferCount: number }>()
  if (!snapshotTimestamp) return result

  const db = getDb()
  const previousTimestamp = snapshotTimestamp - UnixTime.DAY
  const previousRecords =
    await db.aggregatedInteropTransfer.getByChainsAndTimestamp(
      previousTimestamp,
      params.from,
      params.to,
      undefined,
      intentProjectIds,
    )

  for (const record of previousRecords) {
    const current = result.get(record.id) ?? { volume: 0, transferCount: 0 }
    current.volume += getInteropTransferValue(record) ?? 0
    current.transferCount += record.transferCount ?? 0
    result.set(record.id, current)
  }

  return result
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
  }
}
