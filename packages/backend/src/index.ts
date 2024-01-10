import { Application } from './Application'
import { getConfig } from './config'
import { initializeErrorReporting, reportError } from './tools/ErrorReporter'

main().catch((e: unknown) => {
  console.error(e)

  // TODO: Bugsnag can handle unhandled error before the app exit, so maybe we can get rid of it
  // but top-level await is not supported yet
  if (typeof e === 'string') {
    reportError({ message: e })
  } else if (e instanceof Error) {
    reportError({ error: e })
  } else {
    reportError({ message: 'unknown error', parameters: e })
  }

  process.exit(1)
})

async function main() {
  initializeErrorReporting()
  const config = getConfig()
  const app = new Application(config)
  await app.start()
}
