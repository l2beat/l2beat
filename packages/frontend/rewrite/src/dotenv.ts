import { join } from 'node:path'
import dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env.local') })
