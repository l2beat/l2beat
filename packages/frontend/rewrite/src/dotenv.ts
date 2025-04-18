import dotenv from 'dotenv'
import { join } from 'node:path'

dotenv.config({ path: join(process.cwd(), '.env.local') })
