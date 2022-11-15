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
  const env =
    process.env.DEPLOYMENT_ENV ??
    (process.env.NODE_ENV === 'production' ? 'production' : 'local')
  console.log('Loading config for:', env)
  const config = getConfig(env, cli)

  if (cli.mode === 'help') {
    if (cli.error) {
      exitWithUsage(cli.error)
    } else {
      printUsage()
    }
  }

  const app = new Application(config)
  await app.start()
}
