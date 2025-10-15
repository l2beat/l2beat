import { makeQueryExecutor } from '@l2beat/dal'
import { getDb } from './database'
import { getLogger } from './utils/logger'

export const queryExecutor = makeQueryExecutor(getDb(), getLogger())
