import { getEnv } from '@l2beat/backend-tools'
import apm from 'elastic-apm-node'
import { Application } from './Application'
import { getConfig } from './config'
import { createLogger } from './tools/createLogger'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const env = getEnv()

  const logger = createLogger(env)

  apm.start({
    active: process.env.ES_APM_ENABLED === 'true',
    environment: env.optionalString('DEPLOYMENT_ENV') ?? 'local',
    secretToken: process.env.ES_APM_SECRET_TOKEN ?? '',
    serverUrl: process.env.ES_APM_SERVER_URL ?? 'http://localhost:8200',
    serviceName: process.env.ES_APM_SERVICE_NAME ?? 'l2beat-local',
  })

  try {
    const config = await getConfig()
    const app = new Application(config, logger)
    await app.start()
  } catch (e) {
    logger.critical('Failed to start the application', e)

    // flush logs and wait for the error to be reported
    await logger.flush()

    throw e
  }
}
