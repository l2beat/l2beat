import { Application } from './Application'
import { getConfig } from './config'
import { flushErrors, reportError } from './tools/ErrorReporter'

main().catch((e) => {
  console.error(e)
  reportError(e)

  // Need to flush errors to sentry before exiting otherwise they will be lost
  return flushErrors().finally(() => {
    process.exit(1)
  })
})

async function main() {
  const config = getConfig()
  const app = new Application(config)
  await app.start()
}
