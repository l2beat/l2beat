import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
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

const TOKEN_DIALOG_INSET = 24
const TOKEN_DIALOG_MAX_WIDTH = 1600
const TOKEN_DIALOG_MAX_HEIGHT = 960
// Dialog padding, gaps, title, and footer link outside the graph.
const TOKEN_DIALOG_CHROME_HEIGHT = 120

export function TokensPage({ firstPage, ...props }: Props) {
  const [opened, setOpened] = useState<TokenGraphTile | undefined>(undefined)

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="How each token exists across chains: which deployments are backed by another, and which are in a burn-mint relation. Volume values show past 24h crosschain volume.">
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
  const graphHeight =
    typeof window === 'undefined'
      ? 640
      : Math.min(
          TOKEN_DIALOG_MAX_HEIGHT - TOKEN_DIALOG_CHROME_HEIGHT,
          Math.max(
            320,
            window.innerHeight -
              TOKEN_DIALOG_INSET * 2 -
              TOKEN_DIALOG_CHROME_HEIGHT,
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
      <DialogContent
        className="max-w-none bg-surface-primary"
        style={{
          maxWidth: `min(${TOKEN_DIALOG_MAX_WIDTH}px, calc(100vw - ${TOKEN_DIALOG_INSET * 2}px))`,
        }}
      >
        <DialogClose />
        <DialogTitle className="flex items-center gap-2">
          {tile?.iconUrl && (
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
          How this token's deployments back one another.
        </DialogDescription>

        {isLoading || !data ? (
          <Skeleton
            className="w-full rounded-lg"
            style={{ height: graphHeight }}
          />
        ) : (
          <RelationsDiagram
            graph={data}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            heightOverride={graphHeight}
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
