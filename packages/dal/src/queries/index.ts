import type { Database } from '@l2beat/database'
import { getTvsChartQuery } from './getTvsChartQuery'
import { getTvsTableQuery } from './getTvsTableQuery'
import type { DropFirst } from './types'

export type Query = TvsQuery

export type QueryResult<T extends Query['name']> = TvsQueryResult<T>

export type TvsQuery =
  | {
      name: 'getTvsChartQuery'
      args: DropFirst<Parameters<typeof getTvsChartQuery>>
    }
  | {
      name: 'getTvsTableQuery'
      args: DropFirst<Parameters<typeof getTvsTableQuery>>
    }

export type TvsQueryResult<T extends Query['name']> =
  T extends 'getTvsChartQuery'
    ? ReturnType<typeof getTvsChartQuery>
    : T extends 'getTvsTableQuery'
      ? ReturnType<typeof getTvsTableQuery>
      : never

// biome-ignore lint/complexity/noBannedTypes: needed
const queries: { [K: string]: Function } = {
  getTvsChartQuery: getTvsChartQuery,
  getTvsTableQuery: getTvsTableQuery,
}

export async function execute<Q extends Query>(
  db: Database,
  query: Q,
): Promise<QueryResult<Q['name']>> {
  return await queries[query.name](db, ...query.args)
}
