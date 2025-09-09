import type { Database } from '@l2beat/database'
import { assertUnreachable } from '@l2beat/shared-pure'
import { getTvsChartQuery } from './getTvsChartQuery'
import { getTvsTableQuery } from './getTvsTableQuery'
import type { DropFirst } from './types'

export type Query =
  | {
      name: 'getTvsChartQuery'
      args: DropFirst<Parameters<typeof getTvsChartQuery>>
      expires?: 10
    }
  | {
      name: 'getTvsTableQuery'
      args: DropFirst<Parameters<typeof getTvsTableQuery>>
      expires?: 10
    }

// Map command `type` to return type
export type QueryResult<T extends Query['name']> = T extends 'getTvsChartQuery'
  ? ReturnType<typeof getTvsChartQuery>
  : T extends 'getTvsTableQuery'
    ? ReturnType<typeof getTvsTableQuery>
    : never

export async function execute<Q extends Query>(
  db: Database,
  query: Q,
): Promise<QueryResult<Q['name']>> {
  switch (query.name) {
    case 'getTvsChartQuery':
      // biome-ignore lint/suspicious/noExplicitAny: need any here
      return (await getTvsChartQuery(db, ...query.args)) as any
    case 'getTvsTableQuery':
      // biome-ignore lint/suspicious/noExplicitAny: need any here
      return (await getTvsTableQuery(db, ...query.args)) as any
    default:
      assertUnreachable(query)
  }
}
