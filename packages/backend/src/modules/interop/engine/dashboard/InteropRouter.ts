import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import type { InteropFeatureConfig } from '../../../../config/Config'
import type { InteropBlockProcessor } from '../capture/InteropBlockProcessor'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { renderAnomaliesPage } from './AnomaliesPage'
import { renderAnomalyIdPage } from './AnomalyIdPage'
import { renderAggregatesPage } from './aggregates/AggregatesPage'
import {
  MINIMUM_SIDE_VALUE_USD_THRESHOLD,
  VALUE_DIFF_THRESHOLD_PERCENT,
} from './anomalies/constants'
import { renderBlockStatsPage } from './BlockStatsPage'
import { renderEventsPage } from './EventsPage'
import { getInteropCoveragePiesData } from './impls/coveragePies'
import { getInteropEventsByType } from './impls/events'
import { getMemoryUsage } from './impls/memory'
import { getInteropMessageStats } from './impls/messages'
import { getProcessorsStatus } from './impls/processors'
import {
  getInteropTransferDetails,
  getInteropTransferStats,
} from './impls/transfers'
import { renderMainPage } from './MainPage'
import { renderMessagesPage } from './MessagesPage'
import { renderStatusPage } from './StatusPage'
import { renderSupportChartsPage } from './SupportChartsPage'
import { explore } from './stats'
import { renderTransfersPage } from './TransfersPage'
import { createInteropTrpc } from './trpc/server/middleware'

export function createInteropRouter(
  db: Database,
  config: InteropFeatureConfig,
  tokenDbClient: TokenDbClient,
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

  router.all(
    ['/trpc', '/trpc/(.*)'],
    createInteropTrpc(
      {
        aggregationConfigs: config.aggregation,
        db,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        syncersManager,
        getProcessorStatuses: () => getProcessorsStatus(processors),
        dashboard: config.dashboard,
        chains: config.capture.chains,
        tokenDbClient,
      },
      { prefix: '/trpc' },
    ),
  )

  router.get('/interop', async (ctx) => {
    const routerStart = performance.now()

    const [events, messages, transfers, missingTokens, uniqueApps] =
      await Promise.all([
        db.interopEvent.getStats(),
        getInteropMessageStats(db),
        getInteropTransferStats(db),
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
    const rows = await db.aggregatedInteropTransfer.getDailySeries()
    const explored = explore(rows)
    if (ctx.query.raw === 'true') {
      ctx.body = explored
    } else {
      const suspiciousTransfers =
        await db.interopTransfer.getValueMismatchTransfers(
          VALUE_DIFF_THRESHOLD_PERCENT,
          MINIMUM_SIDE_VALUE_USD_THRESHOLD,
        )
      ctx.body = renderAnomaliesPage({
        stats: explored,
        suspiciousTransfers,
        valueDiffThresholdPercent: VALUE_DIFF_THRESHOLD_PERCENT,
        minimumSideValueUsdThreshold: MINIMUM_SIDE_VALUE_USD_THRESHOLD,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    }
  })

  router.get('/interop/anomalies/:id', async (ctx) => {
    const params = v.object({ id: v.string() }).validate(ctx.params)
    const series = await db.aggregatedInteropTransfer.getDailySeriesById(
      params.id,
    )
    ctx.body = renderAnomalyIdPage({ id: params.id, series })
  })

  router.get('/interop/aggregates', async (ctx) => {
    const latestTimestamp =
      await db.aggregatedInteropTransfer.getLatestTimestamp()
    if (!latestTimestamp) {
      return (ctx.body = {
        error: 'No latest timestamp found',
      })
    }
    const from = latestTimestamp - UnixTime.DAY
    const transfers = await db.interopTransfer.getByRange(from, latestTimestamp)
    const configs = config.aggregation ? config.aggregation.configs : []

    const classifier = new InteropTransferClassifier()
    const consumedIds = new Set<string>()
    for (const aggConfig of configs) {
      const classified = classifier.classifyTransfers(
        transfers,
        aggConfig.plugins,
      )
      for (const records of Object.values(classified)) {
        for (const r of records) {
          consumedIds.add(r.transferId)
        }
      }
    }

    const unconsumed = transfers.filter((t) => !consumedIds.has(t.transferId))

    ctx.body = renderAggregatesPage({
      transfers: unconsumed,
      latestTransfers: transfers,
      configs,
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
  })

  const buildCoveragePiesPage = async () =>
    renderSupportChartsPage(await getInteropCoveragePiesData(db))

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
    ctx.body = getMemoryUsage()
  })

  router.get('/interop/block-stats', (ctx) => {
    ctx.body = renderBlockStatsPage(syncersManager.getBlockProcessingStats())
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
    const { pluginName, resyncRequestedFrom } = payload

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

    ctx.body = {
      updatedChains: Array.from(updatedChains),
    }
  })

  router.post('/interop/restart-from-now', async (ctx) => {
    if (!ensureDangerousOperationsEnabled(ctx)) {
      return
    }

    const payload = v
      .object({ pluginName: v.string() })
      .validate(ctx.request.body)
    const { pluginName } = payload

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

    ctx.body = { updatedChains: chains }
  })

  router.post('/interop/refresh-financials', async (ctx) => {
    const updatedTransfers = await db.interopTransfer.markAllAsUnprocessed()

    ctx.body = { updatedTransfers }
  })

  router.get('/interop/events/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    const status = getProcessorsStatus(processors)

    const events = await getInteropEventsByType(db, params.kind, params.type)

    ctx.body = renderEventsPage({
      events,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  router.get('/interop/messages/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        plugin: v.string().optional(),
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)
    const messages = await db.interopMessage.getByType(params.type, {
      plugin: query.plugin,
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
        plugin: v.string().optional(),
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)

    const transfers = await getInteropTransferDetails(db, params.type, {
      plugin: query.plugin,
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
