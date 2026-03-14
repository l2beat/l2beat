import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import { INTEROP_CHAINS } from '@l2beat/config'
import type {
  Database,
  InteropEventSupportBreakdownRecord,
  InteropSuspiciousTransferRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import {
  createAppRouter,
  createKoaMiddleware,
  createTRPCContext,
} from '@l2beat/interop-backoffice'
import { InteropTransferClassifier } from '@l2beat/shared'
import { assert, getInteropTransferValue, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InteropFeatureConfig } from '../../../../config/Config'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import type { InteropBlockProcessor } from '../capture/InteropBlockProcessor'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { renderAnomaliesPage } from './AnomaliesPage'
import { renderAnomalyIdPage } from './AnomalyIdPage'
import { renderAggregatesPage } from './aggregates/AggregatesPage'
import { renderEventsPage } from './EventsPage'
import { renderMainPage } from './MainPage'
import { renderMessagesPage } from './MessagesPage'
import { renderStatusPage } from './StatusPage'
import { renderSupportChartsPage } from './SupportChartsPage'
import { explore, interpret } from './stats'
import { renderTransfersPage } from './TransfersPage'

export function createInteropRouter(
  db: Database,
  config: InteropFeatureConfig,
  processors: InteropBlockProcessor[],
  syncersManager: InteropSyncersManager,
  logger: Logger,
) {
  const router = new Router()
  let coveragePiesCache: string | undefined
  const dangerousOperationsDisabledResponse = {
    error: 'Interop resync and restart operations are disabled',
  }

  const ensureDangerousOperationsEnabled = (
    ctx: Router.RouterContext,
  ): boolean => {
    if (config.dangerousOperationsEnabled) {
      return true
    }

    ctx.status = 403
    ctx.body = dangerousOperationsDisabledResponse
    return false
  }

  router.get('/interop', async (ctx) => {
    const routerStart = performance.now()

    const [events, messages, transfers, missingTokens, uniqueApps] =
      await Promise.all([
        db.interopEvent.getStats(),
        getMessagesStats(db),
        getTransfersStats(db),
        db.interopTransfer.getMissingTokensInfo(),
        db.interopMessage.getUniqueAppsPerPlugin(),
        db.interopPluginSyncedRange.getAll(),
        db.interopPluginSyncState.getAll(),
      ])

    const routerDuration = performance.now() - routerStart

    logger.info('Interop dashboard timings', {
      totalDurationMs: Number(routerDuration.toFixed(2)),
    })

    ctx.body = renderMainPage({
      events,
      messages,
      transfers,
      status: getProcessorsStatus(processors),
      missingTokens,
      uniqueApps,
      pluginSyncStatuses: await syncersManager.getPluginSyncStatuses(),
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
  })

  const trpcMiddleware = createKoaMiddleware({
    router: createAppRouter({
      getPluginSyncStatus: async () => {
        const statuses = await syncersManager.getPluginSyncStatuses()
        return statuses.map((status) => ({
          ...status,
          toBlock: status.toBlock?.toString(),
        }))
      },
      getInteropEventStats: () => {
        return db.interopEvent.getStats()
      },
      getInteropEventDetails: (kind, type) => {
        return getInteropEventDetails(db, kind, type)
      },
      getInteropMessageStats: () => {
        return getMessagesStats(db)
      },
      getInteropMessageDetails: (input) => {
        return getInteropMessageDetails(db, input)
      },
      getInteropTransferStats: () => {
        return getTransfersStats(db)
      },
      getInteropTransferDetails: (input) => {
        return getInteropTransferDetails(db, input)
      },
      getInteropProcessorStatuses: () => {
        return Promise.resolve(getInteropProcessorStatuses(processors))
      },
      requestInteropResync: (input) => {
        return requestInteropResync(db, syncersManager, input)
      },
      restartInteropPluginFromNow: (input) => {
        return restartInteropPluginFromNow(db, syncersManager, input)
      },
      wipeInteropFinancials: () => {
        return wipeInteropFinancials(db)
      },
      getInteropMissingTokensInfo: () => {
        return db.interopTransfer.getMissingTokensInfo()
      },
      getInteropKnownAppsPerPlugin: () => {
        return getInteropKnownAppsPerPlugin(db)
      },
      getInteropCoveragePies: () => {
        return getInteropCoveragePies(db)
      },
      getInteropAggregates: () => {
        return getInteropAggregates(db, config)
      },
      getInteropAnomalies: () => {
        return getInteropAnomalies(db)
      },
      getInteropAnomalySeries: (id) => {
        return getInteropAnomalySeries(db, id)
      },
      getInteropChainMetadata: () => {
        return Promise.resolve(
          INTEROP_CHAINS.map((chain) => ({
            id: chain.id,
            display: chain.display,
            explorerUrl: config.dashboard.getExplorerUrl(chain.id),
          })),
        )
      },
    }),
    prefix: '/interop/trpc',
    allowMethodOverride: true,
    createContext: ({ req }) =>
      createTRPCContext({
        headers: new Headers(req.headers as Record<string, string>),
        db,
      }),
  })

  router.all(['/interop/trpc', '/interop/trpc/(.*)'], trpcMiddleware)

  router.get('/interop/configs', async (ctx) => {
    const configs = await db.interopConfig.getAllLatest()

    ctx.body = configs
  })

  router.get('/interop/status', async (ctx) => {
    const pluginSyncStatuses = await syncersManager.getPluginSyncStatuses()
    const showResyncControls =
      config.dangerousOperationsEnabled && ctx.query.showResync !== undefined

    ctx.body = renderStatusPage({ pluginSyncStatuses, showResyncControls })
  })

  router.get('/interop/anomalies', async (ctx) => {
    const anomalies = await getInteropAnomaliesRaw(db)
    if (ctx.query.raw === 'true') {
      ctx.body = anomalies.stats
    } else {
      ctx.body = renderAnomaliesPage({
        stats: anomalies.stats,
        suspiciousTransfers: anomalies.suspiciousTransfers,
        valueDiffThresholdPercent: anomalies.valueDiffThresholdPercent,
        minimumSideValueUsdThreshold: anomalies.minimumSideValueUsdThreshold,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    }
  })

  router.get('/interop/anomalies/:id', async (ctx) => {
    const params = v.object({ id: v.string() }).validate(ctx.params)
    const series = await getInteropAnomalySeries(db, params.id)
    ctx.body = renderAnomalyIdPage({
      id: params.id,
      series: series.points.map((point) => ({
        id: params.id,
        timestamp: point.timestamp,
        transferCount: point.transferCount,
        totalDurationSum: point.totalDurationSum,
        totalSrcValueUsd: point.totalSrcValueUsd,
        totalDstValueUsd: point.totalDstValueUsd,
      })),
    })
  })

  router.get('/interop/aggregates', async (ctx) => {
    const aggregates = await getInteropAggregatesRaw(db, config)

    if (!aggregates) {
      return (ctx.body = {
        error: 'No latest timestamp found',
      })
    }

    ctx.body = renderAggregatesPage({
      transfers: aggregates.unconsumedTransfers,
      latestTransfers: aggregates.latestTransfers,
      configs: aggregates.configs,
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
  })

  const buildCoveragePiesPage = async () => {
    const rows = await getInteropCoverageBreakdownRows(db)

    return renderSupportChartsPage({
      charts: COVERAGE_PIE_CHART_CONFIGS.map((chart, i) => ({
        id: chart.id,
        title: chart.title,
        centerLabel: chart.centerLabel,
        rows: rows[i] ?? [],
      })),
    })
  }

  const isRefreshRequested = (value: unknown): boolean => {
    if (Array.isArray(value)) {
      return value.includes('1') || value.includes('true')
    }
    return value === '1' || value === 'true'
  }

  const renderCoveragePies = async (ctx: Router.RouterContext) => {
    const refresh = isRefreshRequested(ctx.query.refresh)

    if (refresh) {
      coveragePiesCache = await buildCoveragePiesPage()
      return ctx.redirect('/interop/coverage-pies')
    }

    if (coveragePiesCache === undefined) {
      coveragePiesCache = await buildCoveragePiesPage()
    }

    ctx.body = coveragePiesCache
  }

  router.get('/interop/coverage-pies', renderCoveragePies)

  router.get('/interop/memory', (ctx) => {
    const memoryUsage = process.memoryUsage()

    ctx.body = {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`, // Resident Set Size - total memory allocated
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, // Total heap size
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, // Actual memory used
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`, // Memory used by C++ objects
      arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`, // Memory for ArrayBuffers
    }
  })

  router.get('/interop.json', async (ctx) => {
    const events = await db.interopEvent.getStats()
    const messages = await db.interopMessage.getStats()
    ctx.body = { events, messages }
  })

  const Params = v.object({
    kind: v.enum([
      'all',
      'unmatched',
      'unsupported',
      'transfers',
      'matched',
      'old-unmatched',
    ]),
    type: v.string(),
  })

  const ResyncRequest = v.object({
    pluginName: v.string(),
    resyncRequestedFrom: v.record(
      v.string(),
      v.number().check((value) => {
        try {
          UnixTime(value)
          return true
        } catch (error) {
          return error instanceof Error ? error.message : 'Invalid timestamp'
        }
      }),
    ),
  })

  router.post('/interop/resync', async (ctx) => {
    if (!ensureDangerousOperationsEnabled(ctx)) {
      return
    }

    const payload = ResyncRequest.validate(ctx.request.body)
    ctx.body = await requestInteropResync(db, syncersManager, payload)
  })

  router.post('/interop/restart-from-now', async (ctx) => {
    if (!ensureDangerousOperationsEnabled(ctx)) {
      return
    }

    const payload = v
      .object({ pluginName: v.string() })
      .validate(ctx.request.body)
    ctx.body = await restartInteropPluginFromNow(db, syncersManager, payload)
  })

  router.post('/interop/refresh-financials', async (ctx) => {
    ctx.body = await wipeInteropFinancials(db)
  })

  router.get('/interop/events/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    const status = getProcessorsStatus(processors)

    if (params.kind === 'unmatched') {
      const events = await db.interopEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'unsupported') {
      const events = await db.interopEvent.getByType(params.type, {
        unsupported: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'matched') {
      const events = await db.interopEvent.getByType(params.type, {
        matched: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'old-unmatched') {
      const now = new Date()
      const cutoffTime = new Date(now.toISOString())
      cutoffTime.setUTCHours(cutoffTime.getUTCHours() - 2)

      const events = await db.interopEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
        oldCutoff: UnixTime.fromDate(cutoffTime),
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'all') {
      const events = await db.interopEvent.getByType(params.type)
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    }
  })

  router.get('/interop/messages/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)
    const messages = await db.interopMessage.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderMessagesPage({
      messages,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  router.get('/interop/transfers/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)

    const transfers = await db.interopTransfer.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderTransfersPage({
      transfers,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  return router
}

function getProcessorsStatus(processors: InteropBlockProcessor[]) {
  return processors.flatMap((p) =>
    p.lastProcessed
      ? [
          {
            chain: p.chain,
            block: p.lastProcessed.number,
            timestamp: p.lastProcessed.timestamp,
          },
        ]
      : [],
  )
}

function getInteropProcessorStatuses(processors: InteropBlockProcessor[]) {
  return getProcessorsStatus(processors).sort((a, b) =>
    a.chain.localeCompare(b.chain),
  )
}

async function requestInteropResync(
  db: Database,
  syncersManager: InteropSyncersManager,
  input: {
    pluginName: string
    resyncRequestedFrom: Record<string, number>
  },
) {
  const { pluginName, resyncRequestedFrom } = input
  const defaultFrom = resyncRequestedFrom['*']
  const chains = syncersManager.getChainsForPlugin(pluginName)

  const updatedChains = new Set<string>()
  await db.transaction(async () => {
    for (const chain of chains) {
      const resyncFrom = resyncRequestedFrom[chain] ?? defaultFrom
      if (resyncFrom) {
        await db.interopPluginSyncState.setResyncRequestedFrom(
          pluginName,
          chain,
          resyncFrom,
        )
        updatedChains.add(chain)
      }
    }
  })

  return {
    updatedChains: Array.from(updatedChains),
  }
}

async function restartInteropPluginFromNow(
  db: Database,
  syncersManager: InteropSyncersManager,
  input: {
    pluginName: string
  },
) {
  const { pluginName } = input
  const chains = syncersManager.getChainsForPlugin(pluginName)

  await db.transaction(async () => {
    for (const chain of chains) {
      await db.interopPluginSyncState.upsert({
        pluginName,
        chain,
        lastError: null,
        resyncRequestedFrom: null,
        wipeRequired: true,
      })
    }
  })

  return { updatedChains: chains }
}

async function wipeInteropFinancials(db: Database) {
  const updatedTransfers = await db.interopTransfer.markAllAsUnprocessed()
  return { updatedTransfers }
}

async function getInteropEventDetails(
  db: Database,
  kind: 'all' | 'matched' | 'unmatched' | 'old-unmatched' | 'unsupported',
  type: string,
) {
  let events

  if (kind === 'matched') {
    events = await db.interopEvent.getByType(type, { matched: true })
  } else if (kind === 'unmatched') {
    events = await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
    })
  } else if (kind === 'unsupported') {
    events = await db.interopEvent.getByType(type, { unsupported: true })
  } else if (kind === 'old-unmatched') {
    const now = new Date()
    const cutoffTime = new Date(now.toISOString())
    cutoffTime.setUTCHours(cutoffTime.getUTCHours() - 2)
    events = await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
      oldCutoff: UnixTime.fromDate(cutoffTime),
    })
  } else {
    events = await db.interopEvent.getByType(type)
  }

  return events.map((event) => {
    const srcChain = (event.args as { $srcChain?: string }).$srcChain
    const dstChain = (event.args as { $dstChain?: string }).$dstChain

    return {
      plugin: event.plugin,
      type: event.type,
      direction: event.direction,
      timestamp: event.timestamp,
      chain: event.chain,
      txHash: event.ctx.txHash,
      logIndex: event.ctx.logIndex,
      srcChain,
      dstChain,
      args: JSON.stringify(event.args, (_, value) =>
        typeof value === 'bigint' ? `BigInt(${value})` : value,
      ),
    }
  })
}

async function getMessagesStats(db: Database) {
  const stats = await db.interopMessage.getStats()
  const detailedStats = await db.interopMessage.getDetailedStats()
  const chainsByType = new Map<
    string,
    {
      plugin: string
      type: string
      srcChain: string
      dstChain: string
      count: number
      avgDuration: number
    }[]
  >()

  for (const chain of detailedStats) {
    assert(chain.srcChain && chain.dstChain)
    const key = `${chain.plugin}:${chain.type}`
    const chains = chainsByType.get(key) ?? []
    chains.push({
      plugin: chain.plugin,
      type: chain.type,
      srcChain: chain.srcChain,
      dstChain: chain.dstChain,
      count: Number(chain.count),
      avgDuration: Number(chain.avgDuration),
    })
    chainsByType.set(key, chains)
  }

  return stats.map((overall) => {
    const key = `${overall.plugin}:${overall.type}`

    return {
      plugin: overall.plugin,
      type: overall.type,
      count: Number(overall.count),
      avgDuration: Number(overall.avgDuration),
      knownAppCount: Number(overall.knownAppCount),
      chains: chainsByType.get(key) ?? [],
    }
  })
}

async function getInteropMessageDetails(
  db: Database,
  input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  },
) {
  const messages = await db.interopMessage.getByType(input.type, {
    plugin: input.plugin,
    srcChain: input.srcChain,
    dstChain: input.dstChain,
  })

  return messages.map((message) => ({
    plugin: message.plugin,
    type: message.type,
    messageId: message.messageId,
    app: message.app,
    duration: message.duration,
    timestamp: message.timestamp,
    srcChain: message.srcChain,
    srcTxHash: message.srcTxHash,
    srcLogIndex: message.srcLogIndex,
    dstChain: message.dstChain,
    dstTxHash: message.dstTxHash,
    dstLogIndex: message.dstLogIndex,
  }))
}

async function getInteropTransferDetails(
  db: Database,
  input: {
    type: string
    plugin?: string
    srcChain?: string
    dstChain?: string
  },
) {
  const transfers = await db.interopTransfer.getByType(input.type, {
    plugin: input.plugin,
    srcChain: input.srcChain,
    dstChain: input.dstChain,
  })

  return transfers.map(mapInteropTransferDetails)
}

async function getInteropKnownAppsPerPlugin(db: Database) {
  const rows = await db.interopMessage.getUniqueAppsPerPlugin()

  return rows
    .map((row) => ({
      plugin: row.plugin,
      apps: [...row.apps].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.plugin.localeCompare(b.plugin))
}

function mapInteropTransferDetails(transfer: InteropTransferRecord) {
  return {
    plugin: transfer.plugin,
    type: transfer.type,
    transferId: transfer.transferId,
    bridgeType: transfer.bridgeType,
    duration: transfer.duration,
    timestamp: transfer.timestamp,
    srcChain: transfer.srcChain,
    srcTxHash: transfer.srcTxHash,
    srcLogIndex: transfer.srcLogIndex,
    srcTokenAddress: transfer.srcTokenAddress,
    srcAbstractTokenId: transfer.srcAbstractTokenId,
    srcSymbol: transfer.srcSymbol,
    srcAmount: transfer.srcAmount,
    srcValueUsd: transfer.srcValueUsd,
    srcWasBurned: transfer.srcWasBurned,
    dstChain: transfer.dstChain,
    dstTxHash: transfer.dstTxHash,
    dstLogIndex: transfer.dstLogIndex,
    dstTokenAddress: transfer.dstTokenAddress,
    dstAbstractTokenId: transfer.dstAbstractTokenId,
    dstSymbol: transfer.dstSymbol,
    dstAmount: transfer.dstAmount,
    dstValueUsd: transfer.dstValueUsd,
    dstWasMinted: transfer.dstWasMinted,
  }
}

const COVERAGE_COLLAPSE_THRESHOLD_PCT = 2

const COVERAGE_CHAIN_ALIASES: Record<string, string> = {
  Unknown_792703809: 'solana',
  Unknown_30367: 'hyperevm',
  Unknown_30383: 'plasma',
  Unknown_30385: 'dinari',
  Unknown_30390: 'monad',
  Unknown_30396: 'stable',
  Unknown_30292: 'etherlink',
  Unknown_30403: 'citrea',
  Unknown_30420: 'tron',
  Unknown_30362: 'berachain',
}

const COVERAGE_PIE_CHART_CONFIGS = [
  {
    id: 'layerzero-packet-oft-sent',
    title: 'layerzero-v2.PacketOFTSent destination chains',
    centerLabel: 'PacketOFTSent events',
    type: 'layerzero-v2.PacketOFTSent',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'layerzero-packet-oft-delivered',
    title: 'layerzero-v2.PacketOFTDelivered source chains',
    centerLabel: 'PacketOFTDelivered events',
    type: 'layerzero-v2.PacketOFTDelivered',
    chainArg: '$srcChain' as const,
  },
  {
    id: 'relay-token-sent',
    title: 'relay.TokenSent destination chains',
    centerLabel: 'relay.TokenSent events',
    type: 'relay.TokenSent',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'relay-token-received',
    title: 'relay.TokenReceived source chains',
    centerLabel: 'relay.TokenReceived events',
    type: 'relay.TokenReceived',
    chainArg: '$srcChain' as const,
  },
  {
    id: 'ccip-send-requested',
    title: 'ccip.CCIPSendRequested destination chains',
    centerLabel: 'CCIPSendRequested events',
    type: 'ccip.CCIPSendRequested',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'ccip-execution-state-changed',
    title: 'ccip.ExecutionStateChanged source chains',
    centerLabel: 'ExecutionStateChanged events',
    type: 'ccip.ExecutionStateChanged',
    chainArg: '$srcChain' as const,
  },
]

type InteropCoveragePieSlice = {
  label: string
  rawChains: string[]
  isSupported: boolean
  count: number
  pctOfTotal: number
  color: string
}

type InteropCoveragePieChart = {
  id: string
  title: string
  centerLabel: string
  totalCount: number
  supportedCount: number
  unsupportedCount: number
  supportedPct: number
  unsupportedPct: number
  slices: InteropCoveragePieSlice[]
}

function resolveCoverageChainAlias(chain: string): string {
  return COVERAGE_CHAIN_ALIASES[chain] ?? chain
}

function coverageHsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`
}

function addCoverageSliceColors(
  rows: Omit<InteropCoveragePieSlice, 'color'>[],
): InteropCoveragePieSlice[] {
  const supported = rows.filter((row) => row.isSupported)
  const unsupported = rows.filter((row) => !row.isSupported)

  let supportedIndex = 0
  let unsupportedIndex = 0

  return rows.map((row) => {
    if (row.isSupported) {
      const t =
        supported.length <= 1 ? 0.5 : supportedIndex / (supported.length - 1)
      supportedIndex++
      return { ...row, color: coverageHsl(136, 65, 30 + t * 40) }
    }

    const t =
      unsupported.length <= 1
        ? 0.5
        : unsupportedIndex / (unsupported.length - 1)
    unsupportedIndex++
    return { ...row, color: coverageHsl(0, 75, 30 + t * 40) }
  })
}

function getInteropCoverageBreakdownRows(db: Database) {
  return Promise.all(
    COVERAGE_PIE_CHART_CONFIGS.map((chart) =>
      db.interopEvent.getSupportBreakdownByChainArg(chart.type, chart.chainArg),
    ),
  )
}

function buildCoveragePieChartData(input: {
  id: string
  title: string
  centerLabel: string
  rows: InteropEventSupportBreakdownRecord[]
}): InteropCoveragePieChart {
  const grouped = new Map<
    string,
    {
      count: number
      supportedCount: number
      unsupportedCount: number
      rawChains: Set<string>
    }
  >()

  for (const row of input.rows) {
    const label = resolveCoverageChainAlias(row.chain)
    const current = grouped.get(label) ?? {
      count: 0,
      supportedCount: 0,
      unsupportedCount: 0,
      rawChains: new Set<string>(),
    }

    current.count += row.count
    if (row.isSupported) {
      current.supportedCount += row.count
    } else {
      current.unsupportedCount += row.count
    }
    current.rawChains.add(row.chain)
    grouped.set(label, current)
  }

  const merged = Array.from(grouped.entries())
    .map(([label, value]) => ({
      label,
      rawChains: Array.from(value.rawChains).sort(),
      count: value.count,
      isSupported: value.unsupportedCount === 0,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const totalCount = merged.reduce((acc, row) => acc + row.count, 0)
  const withPct = merged.map((row) => ({
    ...row,
    pctOfTotal: totalCount === 0 ? 0 : (100 * row.count) / totalCount,
  }))

  const large = withPct.filter(
    (slice) => slice.pctOfTotal >= COVERAGE_COLLAPSE_THRESHOLD_PCT,
  )
  const small = withPct.filter(
    (slice) => slice.pctOfTotal < COVERAGE_COLLAPSE_THRESHOLD_PCT,
  )

  const smallSupported = small.filter((slice) => slice.isSupported)
  const smallUnsupported = small.filter((slice) => !slice.isSupported)

  const collapsed: Omit<InteropCoveragePieSlice, 'color'>[] = [...large]

  if (smallSupported.length > 0) {
    const count = smallSupported.reduce((acc, slice) => acc + slice.count, 0)
    collapsed.push({
      label: `Other supported (<${COVERAGE_COLLAPSE_THRESHOLD_PCT}%, ${smallSupported.length} chains)`,
      rawChains: smallSupported.flatMap((slice) => slice.rawChains),
      isSupported: true,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  if (smallUnsupported.length > 0) {
    const count = smallUnsupported.reduce((acc, slice) => acc + slice.count, 0)
    collapsed.push({
      label: `Other unsupported (<${COVERAGE_COLLAPSE_THRESHOLD_PCT}%, ${smallUnsupported.length} chains)`,
      rawChains: smallUnsupported.flatMap((slice) => slice.rawChains),
      isSupported: false,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  const slices = addCoverageSliceColors(
    collapsed.sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    ),
  )

  const supportedCount = slices
    .filter((slice) => slice.isSupported)
    .reduce((acc, slice) => acc + slice.count, 0)
  const unsupportedCount = totalCount - supportedCount

  return {
    id: input.id,
    title: input.title,
    centerLabel: input.centerLabel,
    totalCount,
    supportedCount,
    unsupportedCount,
    supportedPct: totalCount === 0 ? 0 : (100 * supportedCount) / totalCount,
    unsupportedPct:
      totalCount === 0 ? 0 : (100 * unsupportedCount) / totalCount,
    slices,
  }
}

async function getInteropCoveragePies(db: Database) {
  const rowsByChart = await getInteropCoverageBreakdownRows(db)

  return {
    collapseThresholdPct: COVERAGE_COLLAPSE_THRESHOLD_PCT,
    generatedAt: new Date().toISOString(),
    charts: COVERAGE_PIE_CHART_CONFIGS.map((chart, index) =>
      buildCoveragePieChartData({
        id: chart.id,
        title: chart.title,
        centerLabel: chart.centerLabel,
        rows: rowsByChart[index] ?? [],
      }),
    ),
  }
}

const VALUE_DIFF_THRESHOLD_PERCENT = 15
const MINIMUM_SIDE_VALUE_USD_THRESHOLD = 50

function mapInteropSuspiciousTransfer(
  transfer: InteropSuspiciousTransferRecord,
) {
  return {
    plugin: transfer.plugin,
    transferId: transfer.transferId,
    type: transfer.type,
    timestamp: transfer.timestamp,
    srcChain: transfer.srcChain,
    dstChain: transfer.dstChain,
    srcTokenAddress: transfer.srcTokenAddress,
    dstTokenAddress: transfer.dstTokenAddress,
    srcSymbol: transfer.srcSymbol,
    dstSymbol: transfer.dstSymbol,
    srcValueUsd: transfer.srcValueUsd,
    dstValueUsd: transfer.dstValueUsd,
    srcTxHash: transfer.srcTxHash,
    dstTxHash: transfer.dstTxHash,
    valueDifferencePercent: transfer.valueDifferencePercent,
  }
}

async function getInteropAnomalies(db: Database) {
  const anomalies = await getInteropAnomaliesRaw(db)
  return {
    ...anomalies,
    stats: anomalies.stats.map((row) => ({
      ...row,
      interpretation: interpret(row),
    })),
    suspiciousTransfers: anomalies.suspiciousTransfers.map(
      mapInteropSuspiciousTransfer,
    ),
  }
}

async function getInteropAnomaliesRaw(db: Database) {
  const rows = await db.aggregatedInteropTransfer.getDailySeries()
  const stats = explore(rows)
  const suspiciousTransfers =
    await db.interopTransfer.getValueMismatchTransfers(
      VALUE_DIFF_THRESHOLD_PERCENT,
      MINIMUM_SIDE_VALUE_USD_THRESHOLD,
    )

  return {
    stats,
    suspiciousTransfers,
    valueDiffThresholdPercent: VALUE_DIFF_THRESHOLD_PERCENT,
    minimumSideValueUsdThreshold: MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  }
}

async function getInteropAnomalySeries(db: Database, id: string) {
  const series = await db.aggregatedInteropTransfer.getDailySeriesById(id)

  return {
    id,
    points: series.map((point) => ({
      timestamp: point.timestamp,
      transferCount: point.transferCount,
      totalDurationSum: point.totalDurationSum,
      totalSrcValueUsd: point.totalSrcValueUsd,
      totalDstValueUsd: point.totalDstValueUsd,
    })),
  }
}

async function getInteropAggregates(
  db: Database,
  config: InteropFeatureConfig,
) {
  const aggregates = await getInteropAggregatesRaw(db, config)
  if (!aggregates) {
    return null
  }

  return {
    fromTimestamp: aggregates.fromTimestamp,
    toTimestamp: aggregates.toTimestamp,
    configCount: aggregates.configs.length,
    latestTransfersCount: aggregates.latestTransfers.length,
    unconsumedTransfers: aggregates.unconsumedTransfers.map(
      mapInteropTransferDetails,
    ),
    notIncludedByPlugin: buildNotIncludedInAggregatesRows(
      aggregates.unconsumedTransfers,
    ),
    durationSplitCoverage: buildDurationSplitCoverageRows(
      aggregates.latestTransfers,
      aggregates.configs,
    ),
  }
}

async function getInteropAggregatesRaw(
  db: Database,
  config: InteropFeatureConfig,
) {
  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (!latestTimestamp) {
    return null
  }

  const fromTimestamp = latestTimestamp - UnixTime.DAY
  const latestTransfers = await db.interopTransfer.getByRange(
    fromTimestamp,
    latestTimestamp,
  )
  const configs = config.aggregation ? config.aggregation.configs : []

  const classifier = new InteropTransferClassifier()
  const consumedIds = new Set<string>()

  for (const aggConfig of configs) {
    const classified = classifier.classifyTransfers(
      latestTransfers,
      aggConfig.plugins,
    )
    for (const records of Object.values(classified)) {
      for (const record of records) {
        consumedIds.add(record.transferId)
      }
    }
  }

  const unconsumedTransfers = latestTransfers.filter(
    (transfer) => !consumedIds.has(transfer.transferId),
  )

  return {
    fromTimestamp,
    toTimestamp: latestTimestamp,
    latestTransfers,
    unconsumedTransfers,
    configs,
  }
}

function buildNotIncludedInAggregatesRows(transfers: InteropTransferRecord[]) {
  const grouped = new Map<string, { count: number; totalValueUsd: number }>()

  for (const transfer of transfers) {
    const bridgeType =
      transfer.bridgeType ?? InteropTransferClassifier.inferBridgeType(transfer)
    const key = `${transfer.plugin}:${bridgeType}`
    const valueUsd = getInteropTransferValue(transfer) ?? 0
    const existing = grouped.get(key)

    if (existing) {
      existing.count += 1
      existing.totalValueUsd += valueUsd
    } else {
      grouped.set(key, {
        count: 1,
        totalValueUsd: valueUsd,
      })
    }
  }

  return Array.from(grouped.entries())
    .map(([key, value]) => {
      const separatorIndex = key.indexOf(':')
      const plugin = separatorIndex === -1 ? key : key.slice(0, separatorIndex)
      const bridgeType =
        separatorIndex === -1 ? 'unknown' : key.slice(separatorIndex + 1)
      return {
        plugin,
        bridgeType,
        count: value.count,
        totalValueUsd: value.totalValueUsd,
      }
    })
    .sort((a, b) => b.totalValueUsd - a.totalValueUsd || b.count - a.count)
}

function buildDurationSplitCoverageRows(
  transfers: InteropTransferRecord[],
  configs: InteropAggregationConfig[],
) {
  const classifier = new InteropTransferClassifier()
  const rows: {
    projectId: string
    projectName: string
    bridgeType: string
    observedTransferTypes: string[]
    includedSplits: {
      label: string
      transferTypes: string[]
    }[]
    notIncludedTransferTypes: string[]
  }[] = []

  for (const config of configs) {
    if (!config.durationSplit) {
      continue
    }

    const classifiedTransfers = classifier.classifyTransfers(
      transfers,
      config.plugins,
    )
    const entries = Object.entries(config.durationSplit) as Array<
      [string, { label: string; transferTypes: string[] }[]]
    >

    for (const [bridgeType, durationSplit] of entries) {
      const includedSplits = durationSplit.map((split) => ({
        label: split.label,
        transferTypes: [...new Set(split.transferTypes)].sort(),
      }))
      const includedTransferTypes = new Set(
        includedSplits.flatMap((split) => split.transferTypes),
      )
      const observedTransferTypes = [
        ...new Set(
          (
            classifiedTransfers[
              bridgeType as keyof typeof classifiedTransfers
            ] ?? []
          ).map((transfer) => transfer.type),
        ),
      ].sort()

      rows.push({
        projectId: config.id,
        projectName: config.shortName ?? config.name ?? config.id,
        bridgeType,
        observedTransferTypes,
        includedSplits,
        notIncludedTransferTypes: observedTransferTypes.filter(
          (transferType) => !includedTransferTypes.has(transferType),
        ),
      })
    }
  }

  return rows.sort(
    (a, b) =>
      b.notIncludedTransferTypes.length - a.notIncludedTransferTypes.length ||
      a.projectName.localeCompare(b.projectName) ||
      a.bridgeType.localeCompare(b.bridgeType),
  )
}

async function getTransfersStats(db: Database) {
  const stats = await db.interopTransfer.getStats()
  const detailedStats = await db.interopTransfer.getDetailedStats()
  const chainsByType = new Map<
    string,
    {
      plugin: string
      type: string
      srcChain: string
      dstChain: string
      count: number
      avgDuration: number
      srcValueSum: number
      dstValueSum: number
    }[]
  >()

  for (const chain of detailedStats) {
    const key = `${chain.plugin}:${chain.type}`
    const chains = chainsByType.get(key) ?? []
    chains.push({
      plugin: chain.plugin,
      type: chain.type,
      srcChain: chain.srcChain,
      dstChain: chain.dstChain,
      count: chain.count,
      avgDuration: chain.avgDuration,
      srcValueSum: chain.srcValueSum,
      dstValueSum: chain.dstValueSum,
    })
    chainsByType.set(key, chains)
  }

  return stats.map((overall) => {
    const key = `${overall.plugin}:${overall.type}`
    return {
      plugin: overall.plugin,
      type: overall.type,
      count: overall.count,
      avgDuration: overall.avgDuration,
      srcValueSum: overall.srcValueSum,
      dstValueSum: overall.dstValueSum,
      chains: chainsByType.get(key) ?? [],
    }
  })
}
