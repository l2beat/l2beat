import Bugsnag from '@bugsnag/js'
import { getEnv } from '@l2beat/backend-tools'

import { Application } from './Application'
import { getConfig } from './config'
import { initializeErrorReporting } from './tools/ErrorReporter'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const bugsnagApiKey = getEnv().optionalString('BUGSNAG_API_KEY')
  const environment = getEnv().optionalString('DEPLOYMENT_ENV') ?? 'local'

  const isErrorReportingEnabled = initializeErrorReporting(
    bugsnagApiKey,
    environment,
  )

  try {
    const config = getConfig()
    const app = new Application(config)
    await app.start()
  } catch (e) {
    console.error(e)

    if (isErrorReportingEnabled) {
      await reportError(e)
    }

    throw e
  }
}

async function reportError(e: unknown) {
  if (typeof e === 'string') {
    Bugsnag.notify(e, (event) => {
      event.context = 'Backend index.ts'
    })
  } else if (e instanceof Error) {
    Bugsnag.notify(e, (event) => {
      event.context = 'Backend index.ts'
    })
  } else {
    Bugsnag.notify('Unknown error', (event) => {
      event.context = 'Backend index.ts'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      event.addMetadata('error', { message: e })
    })
  }
  // wait 10 seconds for the error to be reported
  console.log('Waiting 10 seconds for the error to be reported')
  await new Promise((resolve) => setTimeout(resolve, 10000))
}
