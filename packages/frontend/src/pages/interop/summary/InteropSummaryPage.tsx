import type { InteropChain } from '@l2beat/config'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChainSelector } from './components/ChainSelector'
import { LockMintCard } from './components/table-widgets/LockMintCard'
import { NonMintingCard } from './components/table-widgets/NonMintingCard'
import { OmniChainCard } from './components/table-widgets/OmniChainCard'
import { MobileTopProtocolsWidget } from './components/widgets/protocols/MobileTopProtocolsWidget'
import { TopProtocolsByTransfers } from './components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './components/widgets/protocols/TopProtocolsByVolume'
import { TopPathsWidget } from './components/widgets/TopPathsWidget'
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
          <div
            className="mt-5 grid grid-cols-1 gap-5 min-[1024px]:grid-cols-2 min-[1600px]:grid-cols-3"
            data-hide-overflow-x
          >
            <div className="z-10 max-[1024px]:hidden">
              <TopPathsWidget interopChains={interopChains} />
            </div>
            <div className="h-full max-[1600px]:hidden">
              <TopProtocolsByVolume />
            </div>
            <div className="h-full max-[1600px]:hidden">
              <TopProtocolsByTransfers />
            </div>
            <MobileTopProtocolsWidget />
            <NonMintingCard />
            <LockMintCard />
            <OmniChainCard />
          </div>
        </InteropSelectedChainsProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
