import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import groupBy from 'lodash/groupBy'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProtocolEntry } from '~/server/features/scaling/interop/utils/getProtocolEntries'
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
    data?.entries.length === 0 &&
    data.top3Paths.length === 0 &&
    data.topProtocols.length === 0
  ) {
    return <InteropEmptyState isDirty={isDirty} />
  }

  const groupedEntries = Object.fromEntries(
    Object.entries(groupBy(data?.entries, (e) => e.bridgeType)).map(
      ([key, value]) => [key, value.slice(0, 5)],
    ),
  ) as Record<ProtocolEntry['bridgeType'], ProtocolEntry[]>

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
      <NonMintingCard
        entries={groupedEntries.nonMinting}
        isLoading={isLoading}
      />
      <LockAndMintCard
        entries={groupedEntries.lockAndMint}
        isLoading={isLoading}
      />
      <OmniChainCard entries={groupedEntries.omnichain} isLoading={isLoading} />
      <AllProtocolsCard entries={data?.entries} isLoading={isLoading} />
    </div>
  )
}
