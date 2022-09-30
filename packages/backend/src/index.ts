import { Application } from './Application'
import { getConfig } from './config'
import { reportError } from './tools/ErrorReporter'

main().catch((e) => {
  console.error(e)
  reportError(e)

  process.exit(1)
})

async function main() {
  const env =
    process.env.DEPLOYMENT_ENV ??
    (process.env.NODE_ENV === 'production' ? 'production' : 'local')

  console.log('Loading config for:', env)
  const config = getConfig(env)
  const app = new Application(config)
  await app.start()
}
