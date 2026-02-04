import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { api } from '~/trpc/React'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopPathsWidget } from '../components/widgets/TopPathsWidget'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import { InteropEmptyState } from './components/InteropEmptyState'
import { TransferSizeChartCard } from './components/TransferSizeChartCard'
import { LockAndMintCard } from './components/table-widgets/LockAndMintCard'
import { NonMintingCard } from './components/table-widgets/NonMintingCard'
import { OmniChainCard } from './components/table-widgets/OmniChainCard'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  initialSelectedChains: { from: string[]; to: string[] }
}

export function InteropSummaryPage({
  interopChains,
  queryState,
  initialSelectedChains,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider
          interopChains={interopChains}
          initialSelectedChains={initialSelectedChains}
        >
          <SideNavLayout maxWidth="wide">
            <div className="flex min-h-screen flex-col">
              <MainPageHeader>Ethereum Ecosystem Interop</MainPageHeader>
              <ChainSelector chains={interopChains} />
              <Widgets interopChains={interopChains} />
            </div>
          </SideNavLayout>
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { selectedChains, isDirty } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  if (
    data?.allProtocolsEntries.length === 0 &&
    !data?.top5Cards &&
    data.top3Paths.length === 0 &&
    data.topProtocols.length === 0
  ) {
    return <InteropEmptyState isDirty={isDirty} />
  }

  return (
    <div
      className="mt-5 grid grid-cols-1 min-[1024px]:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
      data-hide-overflow-x
    >
      <div className="z-10 max-[1024px]:hidden">
        <TopPathsWidget
          interopChains={interopChains}
          isLoading={isLoading}
          top3Paths={data?.top3Paths}
        />
      </div>
      <div className="h-full max-[1600px]:hidden">
        <TopProtocolsByVolume
          topProtocols={data?.topProtocols}
          isLoading={isLoading}
        />
      </div>
      <div className="h-full max-[1600px]:hidden">
        <TopProtocolsByTransfers
          topProtocols={data?.topProtocols}
          isLoading={isLoading}
        />
      </div>
      <MobileCarouselWidget
        interopChains={interopChains}
        top3Paths={data?.top3Paths}
        topProtocols={data?.topProtocols}
        isLoading={isLoading}
      />
      <div className="col-span-full grid grid-cols-1 min-[1024px]:grid-cols-2 min-md:gap-5">
        <NonMintingCard
          entries={data?.top5Cards?.nonMinting}
          isLoading={isLoading}
        />
        <LockAndMintCard
          entries={data?.top5Cards?.lockAndMint}
          isLoading={isLoading}
        />
        <OmniChainCard
          entries={data?.top5Cards?.omnichain}
          isLoading={isLoading}
        />
        <TransferSizeChartCard
          transferSizeChartData={data?.transferSizeChartData}
          isLoading={isLoading}
        />
      </div>
      <AllProtocolsCard
        entries={data?.allProtocolsEntries}
        isLoading={isLoading}
      />
    </div>
  )
}
