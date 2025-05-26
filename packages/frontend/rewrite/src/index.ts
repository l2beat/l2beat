// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { env } from '~/env'
import { setupDevReload } from './server/devReload'
import { createServer } from './server/server'

createServer()
if (env.NODE_ENV !== 'production') {
  setupDevReload()
}
