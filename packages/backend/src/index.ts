import { Application } from './Application'
import { getCliParameters } from './cli/getCliParameters'
import { exitWithUsage, printUsage } from './cli/usage'
import { getConfig } from './config'
import { reportError } from './tools/ErrorReporter'

main().catch((e) => {
  console.error(e)
  reportError(e)

  process.exit(1)
})

async function main() {
  const cli = getCliParameters()
  if (cli.mode === 'help') {
    if (cli.error) {
      exitWithUsage(cli.error)
    } else {
      printUsage()
    }
  }

  const config = getConfig(cli)
  const app = new Application(config)
  await app.start()
}
