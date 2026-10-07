import { getConfig } from './config/config'
import { Application } from './services/Application'

const config = getConfig()
const app = new Application(config)
app.start().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
