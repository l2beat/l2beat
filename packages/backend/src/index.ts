import { Application } from './Application'
import { getConfig } from './config'

const env = process.env.NODE_ENV === 'production' ? 'production' : 'local'

try {
  const config = getConfig(env)
  const app = new Application(config)
  app.start()
} catch (e) {
  console.error(e)
  process.exit(1)
}
