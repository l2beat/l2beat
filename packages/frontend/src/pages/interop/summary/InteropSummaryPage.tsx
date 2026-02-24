import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  ProtocolDisplayable,
  SelectedChainsIds,
} from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InitialChainSelector } from '../components/InitialChainSelector'
import { FlowsWidget } from '../components/widgets/FlowsWidget'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import { InteropEmptyState } from './components/InteropEmptyState'
import { TransferSizeChartCard } from './components/TransferSizeChartCard'
import { BurnAndMintCard } from './components/table-widgets/BurnAndMintCard'
import { LockAndMintCard } from './components/table-widgets/LockAndMintCard'
import { NonMintingCard } from './components/table-widgets/NonMintingCard'
import { getBridgeTypeEntries } from './components/table-widgets/tables/getBridgeTypeEntries'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
  initialSelectedChains: SelectedChainsIds
}

export function InteropSummaryPage({
  interopChains,
  onboardingInteropChains,
  queryState,
  initialSelectedChains,
  protocols,
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
            <MainPageHeader>Interoperability</MainPageHeader>
            <Content
              interopChains={interopChains}
              onboardingInteropChains={onboardingInteropChains}
              protocols={protocols}
            />
          </SideNavLayout>
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Content({
  interopChains,
  onboardingInteropChains,
  protocols,
}: {
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}) {
  const { selectedChains, selectChain } = useInteropSelectedChains()

  if (!selectedChains.first || !selectedChains.second) {
    return (
      <InitialChainSelector
        interopChains={onboardingInteropChains}
        selectedChains={selectedChains}
        selectChain={selectChain}
        type={undefined}
      />
    )
  }

  return (
    <>
      <ChainSelector chains={interopChains} protocols={protocols} />
      <Widgets interopChains={interopChains} />
    </>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    selectedChainsIds: [
      selectedChains.first?.id ?? null,
      selectedChains.second?.id ?? null,
    ],
  })

  if (
    data?.entries.length === 0 &&
    data.flows.length === 0 &&
    data.topProtocols.length === 0
  ) {
    return <InteropEmptyState />
  }

  const { lockAndMint, nonMinting, burnAndMint } = getBridgeTypeEntries(
    data?.entries ?? [],
  )

  return (
    <div
      className="grid grid-cols-1 md:mt-5 md:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
      data-hide-overflow-x
    >
      <div className="z-10">
        <FlowsWidget
          interopChains={interopChains}
          isLoading={isLoading}
          flows={data?.flows}
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
        flows={data?.flows}
        topProtocols={data?.topProtocols}
        isLoading={isLoading}
      />
      <TopTokenWidget topToken={data?.topToken} isLoading={isLoading} />
      <div className="col-span-full grid grid-cols-1 min-[1024px]:grid-cols-2 min-md:gap-5">
        <NonMintingCard entries={nonMinting} isLoading={isLoading} />
        <LockAndMintCard entries={lockAndMint} isLoading={isLoading} />
        <BurnAndMintCard entries={burnAndMint} isLoading={isLoading} />
        <TransferSizeChartCard
          transferSizeChartData={data?.transferSizeChartData}
          isLoading={isLoading}
        />
      </div>
      <AllProtocolsCard
        type={undefined}
        entries={data?.entries}
        zeroTransferProtocols={data?.zeroTransferProtocols}
        isLoading={isLoading}
      />
    </div>
  )
}
