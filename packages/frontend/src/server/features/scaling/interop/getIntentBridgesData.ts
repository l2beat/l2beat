import type { InteropIntentAttribute, Project } from '@l2beat/config'
import {
  getInteropTransferValue,
  type InteropBridgeType,
  type ProjectId,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import sumBy from 'lodash/sumBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  InteropSelectionInput,
  TokenFlowData,
} from './types'
import {
  buildTokensDataMap,
  type TokenInteropData,
} from './utils/buildTokensDataMap'
import {
  buildTokensDetailsMap,
  type TokensDetailsMap,
} from './utils/buildTokensDetailsMap'
import { getInteropChains } from './utils/getInteropChains'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  getProtocolsDataMap,
  type ProtocolData,
} from './utils/getProtocolsDataMap'
import {
  getTransferSizeChartData,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'

const TOP_TOKENS_LIMIT = 5
const INTENT_BRIDGE_COLORS = [
  '#6D5EF6',
  '#1E88E5',
  '#00A86B',
  '#F97316',
  '#64748B',
  '#00B8D9',
  '#EC4899',
  '#F59E0B',
  '#14B8A6',
  '#8B5CF6',
  '#2A5ADA',
]
const MOCK_INTENT_BRIDGE_IDS = [
  'across',
  'cbridge',
  'debridge-dln',
  'fusionplus',
  'gaszip',
  'lifi',
  'mayan',
  'meson',
  'relay',
  'squid',
  'stargate',
]

export type IntentBridgeMetadata = {
  id: string
  projectId: ProjectId
  name: string
  slug: string
  iconUrl: string
  description: string | undefined
  color: string
  intentModel: InteropIntentAttribute
  userRecovery: InteropIntentAttribute
  solverAccess: InteropIntentAttribute
  settlement: InteropIntentAttribute
}

export type IntentBridgeDominanceEntry = {
  id: string
  volume: number
  transferCount: number
  previousVolume: number | null
  previousTransferCount: number | null
  averageDurationSeconds: number | null
  averageValue: number | null
  activeChainCount: number
  activeTokenCount: number
}

export type IntentBridgeDominanceMetric = {
  total: number
  entries: IntentBridgeDominanceEntry[]
}

export type IntentBridgeTopTokenRoute = {
  src: { id: string; iconUrl: string | undefined }
  dst: { id: string; iconUrl: string | undefined }
}

export type IntentBridgeTopTokenItem = {
  id: string
  symbol: string
  issuer: string | null
  iconUrl: string
  volume: number
  transferCount: number
  topRoute: IntentBridgeTopTokenRoute | undefined
  bridgeId: string | undefined
  isUnknown?: boolean
}

export type IntentBridgeChainPathItem = {
  src: { id: string; iconUrl: string | undefined }
  dst: { id: string; iconUrl: string | undefined }
  volume: number
  transferCount: number
}

export type IntentBridgeTypeItem = {
  type: InteropBridgeType
  volume: number
  transferCount: number
}

export type IntentBridgeTableEntry = {
  id: string
  tokens: IntentBridgeTopTokenItem[]
  chainPaths: IntentBridgeChainPathItem[]
  bridgingTypeBreakdown: IntentBridgeTypeItem[]
}

export type IntentBridgesData = {
  bridgeDominance: {
    transfers: IntentBridgeDominanceMetric
    volume: IntentBridgeDominanceMetric
  }
  topTokens: IntentBridgeTopTokenItem[]
  bridgeTable: IntentBridgeTableEntry[]
  transferSizeChartData: TransferSizeDataPoint[] | undefined
  snapshotTimestamp: number | undefined
}

export async function getIntentBridgesData(
  params: InteropSelectionInput,
): Promise<IntentBridgesData> {
  if (env.MOCK) {
    return getMockIntentBridgesData()
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
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

  const protocolsDataMap = getProtocolsDataMap(records)
  const entries: IntentBridgeDominanceEntry[] = intentProjects.map((project) =>
    buildIntentBridgeEntry(
      project,
      protocolsDataMap.get(project.id),
      previousProtocolData.get(project.id.toString()),
    ),
  )

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const topTokens = buildTopTokens(records, tokensDetailsMap, TOP_TOKENS_LIMIT)

  const recordsByProtocol = groupBy(records, (record) => record.id)
  const bridgeTable: IntentBridgeTableEntry[] = intentProjects.map(
    (project) => {
      const projectRecords = recordsByProtocol[project.id.toString()] ?? []
      return {
        id: project.id.toString(),
        tokens: buildTopTokens(projectRecords, tokensDetailsMap),
        chainPaths: buildChainPaths(projectRecords),
        bridgingTypeBreakdown: buildBridgingTypeBreakdown(projectRecords),
      }
    },
  )

  return {
    bridgeDominance: {
      transfers: {
        total: sumBy(entries, (entry) => entry.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (entry) => entry.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
    topTokens,
    bridgeTable,
    transferSizeChartData: getTransferSizeChartData(records, interopProjects),
    snapshotTimestamp,
  }
}

export async function getIntentBridgeMetadata(): Promise<
  IntentBridgeMetadata[]
> {
  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })

  return getIntentProjects(interopProjects).map((project, index) => {
    const intent = project.interopConfig.intent
    return {
      id: project.id.toString(),
      projectId: project.id,
      name: project.interopConfig.name ?? project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      description: project.interopConfig.description,
      color:
        INTENT_BRIDGE_COLORS[index % INTENT_BRIDGE_COLORS.length] ?? '#64748B',
      intentModel: intent?.intentModel ?? unknownAttribute,
      userRecovery: intent?.userRecovery ?? unknownAttribute,
      solverAccess: intent?.solverAccess ?? unknownAttribute,
      settlement: intent?.settlement ?? unknownAttribute,
    }
  })
}

function getIntentProjects(projects: Project<'interopConfig'>[]) {
  return projects
    .filter((project) => project.interopConfig.type === 'intent')
    .toSorted((a, b) => a.name.localeCompare(b.name))
}

function buildIntentBridgeEntry(
  project: Project<'interopConfig'>,
  data: ProtocolData | undefined,
  previous: { volume: number; transferCount: number } | undefined,
): IntentBridgeDominanceEntry {
  if (!data) {
    return {
      id: project.id.toString(),
      volume: 0,
      transferCount: 0,
      previousVolume: previous?.volume ?? null,
      previousTransferCount: previous?.transferCount ?? null,
      averageDurationSeconds: null,
      averageValue: null,
      activeChainCount: 0,
      activeTokenCount: 0,
    }
  }

  return {
    id: project.id.toString(),
    volume: data.volume,
    transferCount: data.transferCount,
    previousVolume: previous?.volume ?? null,
    previousTransferCount: previous?.transferCount ?? null,
    averageDurationSeconds: getSingleAverageDurationSeconds(data, project),
    averageValue:
      data.identifiedTransferCount > 0
        ? data.volume / data.identifiedTransferCount
        : null,
    activeChainCount: data.chains.size,
    activeTokenCount: data.tokens.size,
  }
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

function getSingleAverageDurationSeconds(
  data: ProtocolData,
  project: Project<'interopConfig'>,
): number | null {
  if (project.interopConfig.transfersTimeMode === 'unknown') return null
  if (data.transfersWithDurationCount <= 0) return null
  return Math.floor(data.totalDurationSum / data.transfersWithDurationCount)
}

function buildTopTokens(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
  limit?: number,
): IntentBridgeTopTokenItem[] {
  const tokenDataMap = buildTokensDataMap(records)
  const ranked = [...tokenDataMap.entries()].sort(
    ([, a], [, b]) => b.volume - a.volume,
  )
  const sliced = limit !== undefined ? ranked.slice(0, limit) : ranked

  const items: IntentBridgeTopTokenItem[] = []
  for (const [abstractTokenId, data] of sliced) {
    const details = tokensDetailsMap.get(abstractTokenId)
    if (!details) continue

    items.push({
      id: abstractTokenId,
      symbol: details.symbol,
      issuer: details.issuer,
      iconUrl: details.iconUrl,
      volume: data.volume,
      transferCount: data.transferCount,
      topRoute: getTopRoute(data),
      bridgeId: pickTopProtocolId(data.protocols),
    })
  }
  return items
}

const chainIconMap = new Map(
  getInteropChains().map((chain) => [
    chain.id,
    manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  ]),
)

function buildChainPaths(
  records: AggregatedInteropTransferWithTokens[],
): IntentBridgeChainPathItem[] {
  const map = new Map<string, IntentBridgeChainPathItem>()
  for (const record of records) {
    const key = `${record.srcChain}->${record.dstChain}`
    const volume = getInteropTransferValue(record) ?? 0
    const current = map.get(key)
    if (current) {
      current.volume += volume
      current.transferCount += record.transferCount ?? 0
    } else {
      map.set(key, {
        src: {
          id: record.srcChain,
          iconUrl: chainIconMap.get(record.srcChain),
        },
        dst: {
          id: record.dstChain,
          iconUrl: chainIconMap.get(record.dstChain),
        },
        volume,
        transferCount: record.transferCount ?? 0,
      })
    }
  }
  return [...map.values()].sort((a, b) => b.volume - a.volume)
}

function buildBridgingTypeBreakdown(
  records: AggregatedInteropTransferWithTokens[],
): IntentBridgeTypeItem[] {
  const map = new Map<InteropBridgeType, IntentBridgeTypeItem>()
  for (const record of records) {
    const volume = getInteropTransferValue(record) ?? 0
    const current = map.get(record.bridgeType)
    if (current) {
      current.volume += volume
      current.transferCount += record.transferCount ?? 0
    } else {
      map.set(record.bridgeType, {
        type: record.bridgeType,
        volume,
        transferCount: record.transferCount ?? 0,
      })
    }
  }
  return [...map.values()].sort((a, b) => b.volume - a.volume)
}

function getTopRoute(
  data: TokenInteropData,
): IntentBridgeTopTokenRoute | undefined {
  let topFlow: TokenFlowData | undefined
  for (const flow of data.flows.values()) {
    if (!topFlow || flow.volume > topFlow.volume) {
      topFlow = flow
    }
  }
  if (!topFlow) return undefined
  return {
    src: topFlow.srcChain,
    dst: topFlow.dstChain,
  }
}

function pickTopProtocolId(protocols: Map<string, number>): string | undefined {
  return [...protocols.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
}

const unknownAttribute = {
  value: 'Needs research',
  description: 'This protocol-specific detail has not been added yet.',
}

function getMockIntentBridgesData(): IntentBridgesData {
  const entries: IntentBridgeDominanceEntry[] = MOCK_INTENT_BRIDGE_IDS.map(
    (id, i) => ({
      id,
      volume: 18_000_000 - i * 1_200_000,
      transferCount: 5000 - i * 300,
      previousVolume: 16_000_000 - i * 1_000_000,
      previousTransferCount: 4500 - i * 250,
      averageDurationSeconds: 180 - i * 8,
      averageValue: 3600 - i * 120,
      activeChainCount: Math.max(3, 18 - i),
      activeTokenCount: Math.max(2, 24 - i * 2),
    }),
  )

  const topTokens: IntentBridgeTopTokenItem[] = [
    {
      id: 'usdc',
      symbol: 'USDC',
      issuer: 'circle',
      iconUrl:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      volume: 78_000_000,
      transferCount: 4200,
      topRoute: {
        src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
        dst: { id: 'base', iconUrl: '/icons/base.png' },
      },
      bridgeId: 'across',
    },
    {
      id: 'eth',
      symbol: 'ETH',
      issuer: 'ethereum',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      volume: 42_000_000,
      transferCount: 2600,
      topRoute: {
        src: { id: 'arbitrum', iconUrl: '/icons/arbitrum.png' },
        dst: { id: 'base', iconUrl: '/icons/base.png' },
      },
      bridgeId: 'relay',
    },
  ]

  const bridgeTable: IntentBridgeTableEntry[] = MOCK_INTENT_BRIDGE_IDS.map(
    (id, i) => ({
      id,
      tokens: topTokens,
      chainPaths: [
        {
          src: { id: 'ethereum', iconUrl: '/icons/ethereum.png' },
          dst: { id: 'base', iconUrl: '/icons/base.png' },
          volume: 10_000_000 - i * 500_000,
          transferCount: 1200 - i * 40,
        },
      ],
      bridgingTypeBreakdown: [
        {
          type: 'nonMinting',
          volume: 10_000_000 - i * 500_000,
          transferCount: 1200 - i * 40,
        },
      ],
    }),
  )

  const transferSizeChartData: TransferSizeDataPoint[] =
    MOCK_INTENT_BRIDGE_IDS.map((id, i) => ({
      name: id,
      iconUrl: `/icons/${id}.png`,
      countUnder100: 35 - i,
      percentageUnder100: 35 - i,
      count100To1K: 30,
      percentage100To1K: 30,
      count1KTo10K: 25,
      percentage1KTo10K: 25,
      count10KTo100K: 8,
      percentage10KTo100K: 8,
      countOver100K: 2 + i,
      percentageOver100K: 2 + i,
      minTransferValueUsd: 10,
      maxTransferValueUsd: 250_000,
      averageTransferSizeUsd: 4000,
    }))

  return {
    bridgeDominance: {
      transfers: {
        total: sumBy(entries, (entry) => entry.transferCount),
        entries: [...entries].sort((a, b) => b.transferCount - a.transferCount),
      },
      volume: {
        total: sumBy(entries, (entry) => entry.volume),
        entries: [...entries].sort((a, b) => b.volume - a.volume),
      },
    },
    topTokens,
    bridgeTable,
    transferSizeChartData,
    snapshotTimestamp: undefined,
  }
}
