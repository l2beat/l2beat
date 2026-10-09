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
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'

// On desktop the graph fills the full-screen dialog. On mobile the details
// panel sits below the graph, so the graph keeps a fixed height and the dialog scrolls.
const FILL_ON_DESKTOP_CLASS_NAME = 'md:flex md:min-h-0 md:flex-1 md:flex-col'
const DIAGRAM_CLASS_NAME = 'h-[min(60vh,720px)] md:h-full'

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
        className="bg-surface-primary max-md:overflow-y-auto md:flex md:flex-col md:gap-3 md:p-4"
        fullScreen
      >
        <DialogClose />
        <DialogTitle className="flex items-center gap-2 pr-8">
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
          <div className={FILL_ON_DESKTOP_CLASS_NAME}>
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
            className={FILL_ON_DESKTOP_CLASS_NAME}
            embedded
          />
        ) : (
          <p className="flex flex-1 items-center justify-center py-8 text-center text-label-value-14 text-secondary">
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
