import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import { TokenGraphDialog } from './components/TokenGraphDialog'
import { TokenGraphGrid } from './components/TokenGraphGrid'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
}

export function TokensPage({ queryState, ...props }: Props) {
  const [opened, setOpened] = useState<TokenGraphTile>()

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="How each token exists across chains: which deployments are backed by another, and which are in a burn-and-mint relation. Volumes are past 24h crosschain volume.">
          Tokens
        </MainPageHeader>
        <HydrationBoundary state={queryState}>
          <div className="max-md:px-4">
            <TokenGraphGrid onOpen={setOpened} />
          </div>
          <TokenGraphDialog
            tile={opened}
            onClose={() => setOpened(undefined)}
          />
        </HydrationBoundary>
      </SideNavLayout>
    </AppLayout>
  )
}
