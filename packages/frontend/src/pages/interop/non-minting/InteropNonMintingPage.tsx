import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopPathsWidget } from '../components/widgets/TopPathsWidget'
import { InteropSelectedChainsProvider } from '../utils/InteropSelectedChainsContext'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
}

export function InteropNonMintingPage({
  interopChains,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout fullWidth>
          <MainPageHeader
            description="In-light risk only. Tokens are therefore first bridged using a different
        minting bridge that needs to be separately assessed."
          >
            Non-minting Protocols
          </MainPageHeader>
          <InteropSelectedChainsProvider interopChains={interopChains}>
            <ChainSelector chains={interopChains} />
            <div
              className="mt-5 grid grid-cols-1 min-[1024px]:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
              data-hide-overflow-x
            >
              <div className="z-10 max-[1024px]:hidden">
                <TopPathsWidget
                  interopChains={interopChains}
                  type="nonMinting"
                />
              </div>
              <div className="h-full max-[1600px]:hidden">
                <TopProtocolsByVolume type="nonMinting" />
              </div>
              <div className="h-full max-[1600px]:hidden">
                <TopProtocolsByTransfers type="nonMinting" />
              </div>
              <MobileCarouselWidget
                interopChains={interopChains}
                type="nonMinting"
              />
              <AllProtocolsCard type="nonMinting" />
            </div>
          </InteropSelectedChainsProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
