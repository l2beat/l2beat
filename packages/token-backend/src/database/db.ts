import { createTokenDatabase } from '@l2beat/database'
import { config } from '../config'

export const db = createTokenDatabase(config.database)
