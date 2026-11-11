import { getConfig } from './config/config'
import { Application } from './services/Application'

async function main() {
  const config = await getConfig()
  const app = new Application(config)
  await app.start()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
