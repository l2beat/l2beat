import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EmptyStateIcon } from '~/icons/EmptyState'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { api } from '~/trpc/React'
import { ChainSelector } from './components/chain-selector/ChainSelector'
import { ChainSelectorResetButton } from './components/chain-selector/ChainSelectorResetButton'
import type { InteropChainWithIcon } from './components/chain-selector/types'
import { AllProtocolsCard } from './components/table-widgets/AllProtocolsCard'
import { LockAndMintCard } from './components/table-widgets/LockAndMintCard'
import { NonMintingCard } from './components/table-widgets/NonMintingCard'
import { OmniChainCard } from './components/table-widgets/OmniChainCard'
import { MobileCarouselWidget } from './components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from './components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './components/widgets/protocols/TopProtocolsByVolume'
import { TopPathsWidget } from './components/widgets/TopPathsWidget'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from './utils/InteropSelectedChainsContext'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
}

export function InteropSummaryPage({
  interopChains,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout fullWidth>
          <div className="flex min-h-screen flex-col">
            <MainPageHeader>Ethereum Ecosystem Interop</MainPageHeader>
            <InteropSelectedChainsProvider interopChains={interopChains}>
              <ChainSelector chains={interopChains} />
              <Widgets interopChains={interopChains} />
            </InteropSelectedChainsProvider>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { selectedChains, isDirty } = useInteropSelectedChains()
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  if (
    data?.entries.length === 0 &&
    data.top3Paths.length === 0 &&
    data.topProtocols.length === 0
  ) {
    return (
      <PrimaryCard className="mt-5 mb-12 flex w-full grow items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <EmptyStateIcon className="size-9 fill-yellow-700 dark:fill-yellow-200" />
          <span className="mt-4 text-heading-24">
            No data for selected chains
          </span>
          <span className="mt-4 mb-6 font-medium text-label-value-16 text-secondary">
            We couldn&apos;t find data for this path. Select another route or
            adjust your filters.
          </span>
          {isDirty && <ChainSelectorResetButton />}
        </div>
      </PrimaryCard>
    )
  }

  return (
    <div
      className="mt-5 grid grid-cols-1 min-[1024px]:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
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
      <MobileCarouselWidget interopChains={interopChains} />
      <NonMintingCard />
      <LockAndMintCard />
      <OmniChainCard />
      <AllProtocolsCard />
    </div>
  )
}
