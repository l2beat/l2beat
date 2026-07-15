import http from 'node:http'
import { Logger } from '@l2beat/backend-tools'
import { DiscordClient } from '../clients/DiscordClient'
import type { Config } from '../config'
import { runDailyCheck } from './runDailyCheck'

const logger = Logger.INFO.for('DailyCheck')

export async function runDaemon(config: Config): Promise<void> {
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

async function tryReportFailure(config: Config, error: unknown): Promise<void> {
  if (!config.discordWebhookUrl) {
    return
  }
  try {
    const message = error instanceof Error ? error.message : String(error)
    const discord = new DiscordClient(config.discordWebhookUrl)
    await discord.sendMessage(`❌ Daily check failed to run: ${message}`)
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
