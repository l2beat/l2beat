import {
  keepPreviousData,
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'
import type {
  DecorateQueryProcedure,
  inferInput,
  inferOutput,
} from '@trpc/tanstack-react-query'
import { useEffect, useRef } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: any query procedure; callers get its types through inferInput and inferOutput
type QueryProcedure = DecorateQueryProcedure<any>

/**
 * A chart's query. While a new input loads, it keeps the previous data
 * (`isPlaceholderData`) instead of an empty chart, and `shownInput` is the
 * input that data was fetched with. Derive everything that describes the
 * data on screen (resolution, labels, filters) from `shownInput`, so the
 * previous data is never read with the new input.
 */
export function useChartQuery<P extends QueryProcedure>(
  procedure: P,
  input: inferInput<P>,
) {
  // tRPC's options do not narrow for a generic procedure, so the output is
  // named here once for every caller.
  const options = procedure.queryOptions(input) as UseQueryOptions<
    inferOutput<P>,
    Error,
    inferOutput<P>,
    QueryKey
  >
  const query = useQuery({ ...options, placeholderData: keepPreviousData })
  const shownInput = useValueOfShownData(input, query)
  return { ...query, shownInput }
}

/**
 * The value the shown data was fetched with. While a chart shows the previous
 * query's data, the current value already belongs to the query still loading,
 * so a resolution derived from it would not match the buckets on screen.
 * A value is kept only once its own query brought data: TanStack keeps the
 * last data it had, so a request that failed must not claim it. It is kept
 * after commit, so a render React throws away cannot leave one either.
 */
function useValueOfShownData<T>(
  value: T,
  query: { data: unknown; isPlaceholderData: boolean },
) {
  const shown = useRef(value)
  const hasOwnData = !query.isPlaceholderData && query.data !== undefined
  useEffect(() => {
    if (hasOwnData) shown.current = value
  })
  return query.isPlaceholderData ? shown.current : value
}
