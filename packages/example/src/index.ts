import { Application } from './Application'
import { getConfig } from './Config'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main(): Promise<void> {
  const config = getConfig()
  const application = new Application(config)
  await application.start()
}
