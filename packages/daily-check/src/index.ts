import { Logger } from '@l2beat/backend-tools'
import { runDaemon } from './application/runDaemon'
import { runDailyCheck } from './application/runDailyCheck'
import { getConfig } from './config'

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

  await runDaemon(config)
}

main().catch((error) => {
  logger.error('Fatal', { error })
  process.exit(1)
})
