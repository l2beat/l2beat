import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropSelectedChainsProvider } from '../summary/utils/InteropSelectedChainsContext'

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
          <MainPageHeader>Non-minting Protocols</MainPageHeader>
          <InteropSelectedChainsProvider interopChains={interopChains}>
            <ChainSelector chains={interopChains} />
            <div
              className="mt-5 grid grid-cols-1 min-[1024px]:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
              data-hide-overflow-x
            >
              {/* <div className="z-10 max-[1024px]:hidden">
                <TopPathsWidget interopChains={interopChains} />
              </div>
              <div className="h-full max-[1600px]:hidden">
                <TopProtocolsByVolume />
              </div>
              <div className="h-full max-[1600px]:hidden">
                <TopProtocolsByTransfers />
              </div>
              <MobileCarouselWidget interopChains={interopChains} />
              <NonMintingCard />
              <LockAndMintCard />
              <OmniChainCard />
              <AllProtocolsCard /> */}
            </div>
          </InteropSelectedChainsProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
