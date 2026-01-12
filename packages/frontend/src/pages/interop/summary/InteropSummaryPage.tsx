import type { InteropChain } from '@l2beat/config'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChainSelector } from './components/ChainSelector'
import { TopPathsWidget } from './components/TopPathsWidget'
import { InteropSelectedChainsProvider } from './utils/InteropSelectedChainsContext'

interface Props extends AppLayoutProps {
  interopChains: InteropChain[]
}

export function InteropSummaryPage({ interopChains, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout fullWidth>
        <MainPageHeader>Ethereum Ecosystem Interop</MainPageHeader>
        <InteropSelectedChainsProvider interopChains={interopChains}>
          <ChainSelector chains={interopChains} />
          <div className="mt-5 grid grid-cols-3 gap-5">
            <TopPathsWidget interopChains={interopChains} />
          </div>
        </InteropSelectedChainsProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
