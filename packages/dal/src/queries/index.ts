import { getTvsChartQuery } from './getTvsChartQuery'
import { getTvsTableQuery } from './getTvsTableQuery'
import { getSummedByTimestampTvsPerProjectQuery } from './tvl/getSummedByTimestampTvsPerProjectQuery'
import { getSummedByTimestampTvsValuesQuery } from './tvl/getSummedByTimestampTvsValuesQuery'
import type { DropFirst } from './types'

export type Queries = typeof queries
export const queries = {
  getTvsChartQuery,
  getTvsTableQuery,
  getSummedByTimestampTvsValuesQuery,
  getSummedByTimestampTvsPerProjectQuery,
}

export type QueryOf<N extends keyof Queries> = {
  name: N
  args: DropFirst<Parameters<Queries[N]>>
}

export type Query = {
  [K in keyof Queries]: QueryOf<K>
}[keyof Queries]

export type QueryResult<N extends keyof Queries> = Awaited<
  ReturnType<Queries[N]>
>
