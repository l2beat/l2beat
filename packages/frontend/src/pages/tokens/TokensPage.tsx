import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/core/Dialog'
import { Skeleton } from '~/components/core/Skeleton'
import { MainPageHeader } from '~/components/MainPageHeader'
import { RelationsDiagram } from '~/components/projects/sections/interop/token-relations/RelationsDiagram'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import type { TokenTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { useTRPC } from '~/trpc/React'
import { TokenGraphGrid } from './components/TokenGraphGrid'

interface Props extends AppLayoutProps {
  firstPage: TokenTilesPage
}

export function TokensPage({ firstPage, ...props }: Props) {
  const [opened, setOpened] = useState<TokenGraphTile | undefined>(undefined)

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="How each token exists across chains: which deployments are backed by another, and which are in a burn-mint relation.">
          Tokens
        </MainPageHeader>
        <div className="max-md:px-4">
          <TokenGraphGrid firstPage={firstPage} onOpen={setOpened} />
        </div>
        <TokenDialog tile={opened} onClose={() => setOpened(undefined)} />
      </SideNavLayout>
    </AppLayout>
  )
}

/**
 * The card payload is deliberately too thin to drive the real diagram, so the
 * full graph is fetched when one is opened — and the diagram itself is the
 * same component the token page uses, not a second implementation.
 */
function TokenDialog({
  tile,
  onClose,
}: {
  tile: TokenGraphTile | undefined
  onClose: () => void
}) {
  const trpc = useTRPC()
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined,
  )
  const { data, isLoading } = useQuery(
    trpc.tokens.relationsGraph.queryOptions(
      { tokenId: tile?.id ?? '' },
      { enabled: tile !== undefined },
    ),
  )

  return (
    <Dialog
      open={tile !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedNodeId(undefined)
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[min(1400px,95vw)]">
        <DialogTitle>
          {tile?.symbol}
          {tile?.issuer && (
            <span className="ml-2 font-normal text-label-value-14 text-secondary">
              Issued by <span className="capitalize">{tile.issuer}</span>
            </span>
          )}
        </DialogTitle>
        <DialogDescription className="sr-only">
          How this token's deployments back one another.
        </DialogDescription>

        {isLoading || !data ? (
          <Skeleton className="h-[520px] w-full rounded-lg" />
        ) : (
          <RelationsDiagram
            graph={data}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
          />
        )}

        {tile && (
          <a
            href={`/interop/tokens/${tile.slug}`}
            className="font-bold text-brand text-label-value-14 hover:underline"
          >
            Open the full {tile.symbol} page
          </a>
        )}
      </DialogContent>
    </Dialog>
  )
}
