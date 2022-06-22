import { Application } from './Application'
import { getConfig } from './config'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'local'
  const config = getConfig(env)
  const app = new Application(config)
  await app.start()
}
