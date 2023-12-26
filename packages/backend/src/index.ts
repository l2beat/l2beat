import { Application } from './Application'
import { getConfig } from './config'
import { flushErrors, reportError } from './tools/ErrorReporter'

main().catch(async (e: unknown) => {
  console.error(e)

  if (typeof e === 'string') {
    reportError({ message: e })
  } else if (e instanceof Error) {
    reportError({ error: e })
  } else {
    reportError({ parameters: e })
  }

  try {
    // Need to flush errors to sentry before exiting otherwise they will be lost
    await flushErrors()
  } finally {
    process.exit(1)
  }
})

async function main() {
  const config = getConfig()
  const app = new Application(config)
  await app.start()
}
