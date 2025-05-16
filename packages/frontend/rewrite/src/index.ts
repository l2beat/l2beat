import { join } from 'node:path'
import dotenv from 'dotenv'

import { createServer } from './server/server'

dotenv.config({ path: join(process.cwd(), '.env.local') })

createServer()
