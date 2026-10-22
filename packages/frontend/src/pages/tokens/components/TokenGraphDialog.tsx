import { useQuery } from '@tanstack/react-query'
import { Button } from '~/components/core/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/core/Dialog'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Legend,
  TokenRelationsGraphView,
} from '~/components/projects/sections/interop/onchain-deployments/relations-graph/TokenRelationsGraphView'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'

// The graph fills the full-screen dialog; on mobile it shares the space with
// the details panel below it.
const FILL_CLASS_NAME = 'flex min-h-0 flex-1 flex-col'
const DIAGRAM_CLASS_NAME = 'h-full'

export function TokenGraphDialog({
  tile,
  onClose,
}: {
  tile: TokenGraphTile | undefined
  onClose: () => void
}) {
  const trpc = useTRPC()
  const { data, isPending, isError, refetch } = useQuery(
    trpc.tokens.relationsGraph.queryOptions(
      { tokenId: tile?.id ?? '' },
      { enabled: tile !== undefined },
    ),
  )

  return (
    <Dialog
      open={tile !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        className="flex flex-col gap-3 bg-surface-primary p-4 max-md:pt-0"
        fullScreen
      >
        <DialogClose />
        {/* The title row is a sticky bar at the very top because iOS Safari only
            re-tints its status bar from a sticky or fixed bar at the top. */}
        <DialogTitle className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-8 max-md:sticky max-md:top-0 max-md:bg-surface-primary max-md:pt-4">
          {tile && (
            <img
              src={tile.iconUrl}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0 rounded-full"
            />
          )}
          {tile?.symbol}
          {tile?.issuer && (
            <span className="font-normal text-label-value-14 text-secondary">
              Issued by <span className="capitalize">{tile.issuer}</span>
            </span>
          )}
          {tile?.href && (
            <a
              href={tile.href}
              title={`Open the full ${tile.symbol} page`}
              className="group flex items-center gap-1 rounded-full bg-brand/10 py-1 pr-2 pl-2.5 font-medium text-brand text-label-value-12 transition-colors hover:bg-brand hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Token page
              <ArrowRightIcon className="size-3 fill-current transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Which deployments of this token back which others.
        </DialogDescription>

        {isPending ? (
          <div className={FILL_CLASS_NAME}>
            <div className="mb-3 flex min-h-8 items-center">
              <Legend />
            </div>
            <div className="min-h-0 flex-1">
              <Skeleton className={cn(DIAGRAM_CLASS_NAME, 'rounded-lg')} />
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-label-value-14 text-secondary">
            Could not load the graph.
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : data ? (
          <TokenRelationsGraphView
            graph={data}
            diagramClassName={DIAGRAM_CLASS_NAME}
            className={FILL_CLASS_NAME}
            embedded
          />
        ) : (
          <p className="flex flex-1 items-center justify-center py-8 text-center text-label-value-14 text-secondary">
            No deployments found for this token.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
