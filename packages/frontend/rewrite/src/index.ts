import { env } from '~/env'
import './dotenv'
import { createServer } from './server/server'
import { setupDevReload } from './server/devReload'

createServer()
if (env.NODE_ENV !== 'production') {
  setupDevReload()
}
