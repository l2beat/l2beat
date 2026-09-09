import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { NoDataBanner } from '~/components/NoDataBanner'
import {
  InfiniteScrollTrigger,
  useInfiniteScrollTrigger,
} from '~/pages/interop/components/tokens/infiniteScroll'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { useTRPC } from '~/trpc/React'
import { TokenGraphTileCard } from './TokenGraphTileCard'

export function TokenGraphGrid({
  onOpen,
}: {
  onOpen: (tile: TokenGraphTile) => void
}) {
  const trpc = useTRPC()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tokens.tiles.infiniteQueryOptions(
        {},
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
      ),
    )
  const tiles = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )
  const total = data?.pages[0]?.total ?? tiles.length
  const loadMoreRef = useInfiniteScrollTrigger({
    canLoadMore: !!hasNextPage && !isFetchingNextPage,
    loadMore: fetchNextPage,
  })

  if (tiles.length === 0) {
    return <NoDataBanner content="No token relations observed yet." />
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tiles.map((tile) => (
          <TokenGraphTileCard
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
      {hasNextPage && <InfiniteScrollTrigger triggerRef={loadMoreRef} />}
      <p className="mt-4 text-center text-label-value-13 text-secondary">
        Showing {tiles.length} of {total} tokens with relations.
      </p>
    </div>
  )
}
