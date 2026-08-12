import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import type { TokenGraphTile as Tile } from '~/server/features/tokens/buildTokenGraphTiles'
import type { TokenTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { useTRPC } from '~/trpc/React'
import {
  type TokenGraphFilterState,
  TokenGraphFilters,
} from './TokenGraphFilters'
import { TokenGraphTile } from './TokenGraphTile'

export function TokenGraphGrid({
  firstPage,
  onOpen,
}: {
  firstPage: TokenTilesPage
  onOpen: (tile: Tile) => void
}) {
  const trpc = useTRPC()
  const [filters, setFilters] = useState<TokenGraphFilterState>({
    chain: undefined,
    plugin: undefined,
    mechanism: undefined,
    includeWithoutRelations: false,
  })

  const isDefaultFilter =
    !filters.chain &&
    !filters.plugin &&
    !filters.mechanism &&
    !filters.includeWithoutRelations

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    trpc.tokens.tiles.infiniteQueryOptions(
      {
        chain: filters.chain,
        plugin: filters.plugin,
        mechanism: filters.mechanism,
        includeWithoutRelations: filters.includeWithoutRelations,
      },
      {
        getNextPageParam: (page: TokenTilesPage) => page.nextCursor,
        // The server already rendered page one of the unfiltered view; reusing
        // it avoids refetching what is already in the document.
        initialData: isDefaultFilter
          ? { pages: [firstPage], pageParams: [null] }
          : undefined,
      },
    ),
  )

  const tiles = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )
  const total = data?.pages[0]?.total ?? 0
  const facets = data?.pages[0]?.facets ?? firstPage.facets

  return (
    <div>
      <TokenGraphFilters
        facets={facets}
        value={filters}
        onChange={setFilters}
        resultCount={total}
      />

      {tiles.length === 0 && !isFetching ? (
        <p className="rounded-lg bg-surface-secondary px-4 py-8 text-center font-medium text-label-value-14 text-secondary">
          No tokens match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tiles.map((tile) => (
            <TokenGraphTile
              key={tile.id}
              tile={tile}
              onOpen={() => onOpen(tile)}
            />
          ))}
          {isFetching &&
            Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={`skeleton-${index}`}
                className="h-[248px] rounded-lg"
              />
            ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-4 text-center">
          <p className="text-label-value-13 text-secondary">
            Showing the {tiles.length} busiest of {total} tokens.
          </p>
          <button
            type="button"
            disabled={isFetching}
            onClick={() => void fetchNextPage()}
            className="mt-1 font-bold text-brand text-label-value-14 hover:underline disabled:opacity-50"
          >
            {isFetching ? 'Loading…' : 'Show more'}
          </button>
        </div>
      )}
    </div>
  )
}
