import http from 'node:http'
import { Logger } from '@l2beat/backend-tools'
import { type Config, getConfig } from './config'
import { formatSummary, postDiscord } from './discord'
import { Elastic } from './elastic'
import { evaluateTile, type TileResult } from './evaluate'
import { investigate } from './investigate'
import { Kibana } from './kibana'
import { loadControlPlane, type SkippedTile } from './tiles'

const logger = Logger.INFO.for('DailyCheck')

async function main(): Promise<void> {
  const config = getConfig()
  const once = process.argv.includes('--once')
  const dryRun = process.argv.includes('--dry-run')
  if (!dryRun && !config.discordWebhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL is required (or pass --dry-run)')
  }

  if (once || dryRun) {
    await runDailyCheck(config, dryRun)
    return
  }

  startHealthServer(config.port)
  logger.info('Daemon started', { runAt: config.runAt, tz: process.env.TZ })
  while (true) {
    const delay = msUntilNextRun(config.runAt)
    logger.info('Next run scheduled', {
      inHours: Math.round(delay / 36000) / 100,
    })
    await sleep(delay)
    try {
      await runDailyCheck(config, false)
    } catch (error) {
      logger.error('Daily check failed', { error })
      await tryReportFailure(config, error)
    }
  }
}

async function runDailyCheck(config: Config, dryRun: boolean): Promise<void> {
  const kibana = new Kibana(config.kibanaUrl, config.kibanaApiKey)
  const es = new Elastic(config.elasticsearchUrl, config.elasticsearchApiKey)
  const send = async (content: string): Promise<void> => {
    if (dryRun || !config.discordWebhookUrl) {
      console.log(`\n${content}\n`)
      return
    }
    await postDiscord(config.discordWebhookUrl, content)
  }

  logger.info('Loading dashboard', { id: config.dashboardId })
  const controlPlane = await loadControlPlane(kibana, config.dashboardId)

  const results: TileResult[] = []
  const skipped: SkippedTile[] = [...controlPlane.skipped]
  for (const tile of controlPlane.tiles) {
    try {
      results.push(await evaluateTile(es, tile))
    } catch (error) {
      skipped.push({
        title: tile.title,
        section: tile.section,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const red = results.filter((result) => result.status === 'red')
  logger.info('Checks evaluated', {
    tiles: results.length,
    red: red.length,
    amber: results.filter((result) => result.status === 'amber').length,
    skipped: skipped.length,
  })

  const summary = formatSummary(
    controlPlane.title,
    controlPlane.timeFrom,
    controlPlane.timeTo,
    controlPlane.controls,
    results,
    skipped,
  )
  await send(summary)

  if (red.length === 0) {
    return
  }

  logger.info('Investigating red tiles', { count: red.length })
  try {
    const report = await investigate(red, controlPlane.controls, config.model)
    await send(`🔍 **Investigation**\n${report}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error('Investigation failed', { error })
    await send(`🔍 AI investigation failed: ${message}`)
  }
}

async function tryReportFailure(config: Config, error: unknown): Promise<void> {
  if (!config.discordWebhookUrl) {
    return
  }
  try {
    const message = error instanceof Error ? error.message : String(error)
    await postDiscord(
      config.discordWebhookUrl,
      `❌ Daily check failed to run: ${message}`,
    )
  } catch {
    // Discord itself is down; the error is already logged.
  }
}

function msUntilNextRun(runAt: string, now = new Date()): number {
  const [hours = 9, minutes = 0] = runAt.split(':').map(Number)
  const next = new Date(now)
  next.setHours(hours, minutes, 0, 0)
  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }
  return next.getTime() - now.getTime()
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function startHealthServer(port: number): void {
  http
    .createServer((_, response) => {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end('{"status":"ok"}')
    })
    .listen(port)
}

main().catch((error) => {
  logger.error('Fatal', { error })
  process.exit(1)
})
