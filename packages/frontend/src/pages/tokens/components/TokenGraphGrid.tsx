import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useInfiniteScrollTrigger } from '~/pages/interop/components/tokens/infiniteScroll'
import type { TokenGraphTile as Tile } from '~/server/features/tokens/buildTokenGraphTiles'
import type { TokenGraphTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { useTRPC } from '~/trpc/React'
import { TokenGraphTile } from './TokenGraphTile'

export function TokenGraphGrid({
  firstPage,
  onOpen,
}: {
  firstPage: TokenGraphTilesPage
  onOpen: (tile: Tile) => void
}) {
  const trpc = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tokens.tiles.infiniteQueryOptions(
        {},
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          // The server already rendered page one; reusing it avoids
          // refetching what is already in the document.
          initialData: { pages: [firstPage], pageParams: [null] },
        },
      ),
    )
  const tiles = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )
  const loadMoreRef = useInfiniteScrollTrigger({
    canLoadMore: !!hasNextPage && !isFetchingNextPage,
    loadMore: fetchNextPage,
  })

  if (tiles.length === 0) {
    return (
      <p className="rounded-lg bg-surface-primary px-4 py-8 text-center font-medium text-label-value-14 text-secondary">
        No token relations observed yet.
      </p>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tiles.map((tile) => (
          <TokenGraphTile
            key={tile.id}
            tile={tile}
            onOpen={() => onOpen(tile)}
          />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[236px] rounded-lg" />
          ))}
      </div>
      <div ref={loadMoreRef} className="h-px" />
      <p className="mt-4 text-center text-label-value-13 text-secondary">
        Showing {tiles.length} of {firstPage.total} tokens with relations.
      </p>
    </div>
  )
}
