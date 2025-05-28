import { resolve } from 'path'
import { ProjectService } from '@l2beat/config'

const DB_PATH = resolve(process.cwd(), '../config/build/db.sqlite')
export const ps = new ProjectService(DB_PATH)
