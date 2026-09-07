import { useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import type { TokenGraphTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { TokenGraphDialog } from './components/TokenGraphDialog'
import { TokenGraphGrid } from './components/TokenGraphGrid'

interface Props extends AppLayoutProps {
  firstPage: TokenGraphTilesPage
}

export function TokensPage({ firstPage, ...props }: Props) {
  const [opened, setOpened] = useState<TokenGraphTile>()

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="How each token exists across chains: which deployments are backed by another, and which are in a burn-and-mint relation. Volumes are past 24h crosschain volume.">
          Tokens
        </MainPageHeader>
        <div className="max-md:px-4">
          <TokenGraphGrid firstPage={firstPage} onOpen={setOpened} />
        </div>
        <TokenGraphDialog tile={opened} onClose={() => setOpened(undefined)} />
      </SideNavLayout>
    </AppLayout>
  )
}
