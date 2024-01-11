import { getEnv, Logger, LoggerOptions } from '@l2beat/backend-tools'

import { Application } from './Application'
import { getConfig } from './config'
import { initializeErrorReporting, reportError } from './tools/ErrorReporter'

main().catch((e: unknown) => {
  const loggerOptions: Partial<LoggerOptions> = {
    logLevel: 'ERROR',
    format: 'pretty',
    colors: true,
    reportError,
  }
  const logger = new Logger(loggerOptions)

  logger.error(e)

  // wait 10 seconds for the error to be reported
  setTimeout(() => process.exit(1), 10_000).unref()
})

async function main() {
  const bugsnagApiKey = getEnv().optionalString('BUGSNAG_API_KEY')
  const environment = getEnv().optionalString('DEPLOYMENT_ENV') ?? 'local'

  if (bugsnagApiKey) {
    initializeErrorReporting(bugsnagApiKey, environment)
  } else {
    console.log('Bugsnag integration disabled')
  }

  const config = getConfig()
  const app = new Application(config)
  await app.start()
}
