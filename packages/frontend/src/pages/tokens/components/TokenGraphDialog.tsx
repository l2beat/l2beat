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
import { TokenRelationsGraphView } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/TokenRelationsGraphView'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'

const DIAGRAM_CLASS_NAME = 'h-[min(60vh,720px)]'

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
        className="bg-surface-primary max-md:overflow-y-auto md:max-w-[min(1400px,95vw)]"
        fullScreenMobile
      >
        <DialogClose />
        <DialogTitle className="flex items-center gap-2">
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
        </DialogTitle>
        <DialogDescription className="sr-only">
          Which deployments of this token back which others.
        </DialogDescription>

        {isPending ? (
          <Skeleton className={cn(DIAGRAM_CLASS_NAME, 'rounded-lg')} />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-8 text-label-value-14 text-secondary">
            Could not load the graph.
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : data ? (
          <TokenRelationsGraphView
            graph={data}
            diagramClassName={DIAGRAM_CLASS_NAME}
            embedded
          />
        ) : (
          <p className="py-8 text-center text-label-value-14 text-secondary">
            No deployments found for this token.
          </p>
        )}

        {tile?.href && (
          <a
            href={tile.href}
            className="font-bold text-brand text-label-value-14 hover:underline"
          >
            Open the full {tile.symbol} page
          </a>
        )}
      </DialogContent>
    </Dialog>
  )
}
