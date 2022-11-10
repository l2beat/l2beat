import { Application } from './Application'
import { getCliParameters } from './cli/getCliParameters'
import { exitWithUsage, printUsage } from './cli/usage'
import { getConfig } from './config'
import { Discovery } from './Discovery'
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
  const config = getConfig(env)

  if (cli.mode === 'help') {
    if (cli.error) {
      exitWithUsage(cli.error)
    } else {
      printUsage()
    }
  } else if (cli.mode === 'server') {
    const app = new Application(config)
    await app.start()
  } else {
    console.log('DISCOVER', cli.project)
    const discovery = new Discovery()
    await discovery.discover(cli.project, config)
  }
}
