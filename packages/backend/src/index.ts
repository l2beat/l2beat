import { Application } from './Application'
import { handleCli } from './cli/handleCli'
import { getConfig } from './config'
import { flushErrors, reportError } from './tools/ErrorReporter'

main()
  .catch((e) => {
    console.error(e)
    reportError(e)

    return flushErrors()
  })
  .finally(() => {
    process.exit(1)
  })

async function main() {
  const cli = handleCli()
  const config = getConfig(cli)
  const app = new Application(config)
  await app.start()
}
