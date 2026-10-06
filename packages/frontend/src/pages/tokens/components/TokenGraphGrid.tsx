import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Button } from '~/components/core/Button'
import { Skeleton } from '~/components/core/Skeleton'
import {
  InfiniteScrollTrigger,
  useInfiniteScrollTrigger,
} from '~/components/InfiniteScroll'
import { NoDataBanner } from '~/components/NoDataBanner'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { useTRPC } from '~/trpc/React'
import { TokenGraphTileCard } from './TokenGraphTileCard'

const GRID_CLASS_NAME =
  'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export function TokenGraphGrid({
  onOpen,
}: {
  onOpen: (tile: TokenGraphTile) => void
}) {
  const trpc = useTRPC()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery(
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

  if (!data) {
    return isError ? (
      <div className="flex flex-col items-center gap-3 py-8 text-label-value-14 text-secondary">
        Could not load the tokens.
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    ) : (
      <div className={GRID_CLASS_NAME}>
        <TileSkeletons count={8} />
      </div>
    )
  }

  if (tiles.length === 0) {
    return <NoDataBanner content="No token relations observed yet." />
  }

  return (
    <div>
      <div className={GRID_CLASS_NAME}>
        {tiles.map((tile) => (
          <TokenGraphTileCard
            key={tile.id}
            tile={tile}
            onOpen={() => onOpen(tile)}
          />
        ))}
        {isFetchingNextPage && <TileSkeletons count={4} />}
      </div>
      {hasNextPage && <InfiniteScrollTrigger triggerRef={loadMoreRef} />}
      <p className="mt-4 text-center text-label-value-13 text-secondary">
        Showing {tiles.length} of {total} tokens with relations.
      </p>
    </div>
  )
}

function TileSkeletons({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <Skeleton key={index} className="h-[236px] rounded-lg" />
  ))
}
