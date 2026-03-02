import { getEnv, Logger } from '@l2beat/backend-tools'
import { DefidiscoMonitorApplication } from './modules/defi-update-monitor/defidisco/DefidiscoMonitorApplication'
import { getMonitorConfig } from './modules/defi-update-monitor/defidisco/monitorConfig'

async function main() {
  const env = getEnv()
  const logLevel = env.string('LOG_LEVEL', 'INFO') as
    | 'DEBUG'
    | 'INFO'
    | 'WARN'
    | 'ERROR'
    | 'CRITICAL'

  const logger = new Logger({ level: logLevel })
  const appLogger = logger.for('DefidiscoMonitor')

  appLogger.info('Initializing DeFiDisco Monitor')

  const config = getMonitorConfig(env)
  const app = new DefidiscoMonitorApplication(config, logger)

  // Run-once mode: single cycle then exit (used by GitHub Actions cron)
  if (env.boolean('RUN_ONCE', false)) {
    appLogger.info('Running in run-once mode')
    await app.runOnce()
    process.exit(0)
  }

  // Long-running mode: Clock-based scheduling
  const shutdown = async (signal: string) => {
    appLogger.info(`Received ${signal}, shutting down...`)
    await app.stop()
    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  await app.start()
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
