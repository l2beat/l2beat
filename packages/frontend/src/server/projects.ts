import { ProjectService } from '@l2beat/config'
import { resolve } from 'path'

const DB_PATH = resolve(process.cwd(), '../config/build/db.sqlite')
export const ps = new ProjectService(DB_PATH)
