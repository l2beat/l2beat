import type { Database } from '@l2beat/database'
import { getTvsChartQuery } from './getTvsChartQuery'
import { getTvsTableQuery } from './getTvsTableQuery'
import type { DropFirst } from './types'

const queries = {
  getTvsChartQuery,
  getTvsTableQuery,
}

type Queries = typeof queries

type QueryOf<N extends keyof Queries> = {
  name: N
  args: DropFirst<Parameters<Queries[N]>>
}

export type Query = {
  [K in keyof Queries]: QueryOf<K>
}[keyof Queries]

export type QueryResult<N extends keyof Queries> = Awaited<
  ReturnType<Queries[N]>
>

export async function execute<N extends keyof Queries>(
  db: Database,
  query: QueryOf<N>,
): Promise<QueryResult<N>> {
  const fn = queries[query.name] as (
    db: Database,
    ...args: DropFirst<Parameters<Queries[N]>>
    // biome-ignore lint/suspicious/noExplicitAny: need any here
  ) => any

  return await fn(db, ...query.args)
}
