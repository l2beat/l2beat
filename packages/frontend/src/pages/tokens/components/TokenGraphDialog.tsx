import { useQuery } from '@tanstack/react-query'
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

const DIAGRAM_CLASS_NAME = 'h-[min(60vh,720px)]'

/**
 * A card is deliberately too thin to drive the real graph, so the full one is
 * fetched when a card opens — and it is the same view the token page shows,
 * not a second implementation.
 */
export function TokenGraphDialog({
  tile,
  onClose,
}: {
  tile: TokenGraphTile | undefined
  onClose: () => void
}) {
  const trpc = useTRPC()
  const { data, isPending } = useQuery(
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
        className="max-w-[min(1400px,95vw)] bg-surface-primary"
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
          <Skeleton className={`${DIAGRAM_CLASS_NAME} rounded-lg`} />
        ) : data ? (
          <TokenRelationsGraphView
            graph={data}
            diagramClassName={DIAGRAM_CLASS_NAME}
            expandable={false}
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
