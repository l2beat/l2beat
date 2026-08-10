import {
  type DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { useTRPC } from '~/trpc/React'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { MultiChainSelector } from '../components/chain-selector/MultiChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { FlowsView } from '../components/flows/FlowsView'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopRoutesWidget } from '../components/widgets/TopRoutesWidget'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { BreakdownByTransferType } from './components/BreakdownByTransferType'
import { InteropEmptyState } from './components/InteropEmptyState'
import { TokenCount } from './components/TokenCount'
import { TransferSizeChartCard } from './components/TransferSizeChartCard'
import { BurnAndMintCard } from './components/table-widgets/BurnAndMintCard'
import { LockAndMintCard } from './components/table-widgets/LockAndMintCard'
import { NonMintingCard } from './components/table-widgets/NonMintingCard'
import { getBridgeTypeEntries } from './components/table-widgets/tables/getBridgeTypeEntries'
import { getTransferTypeBreakdown } from './utils/getTransferTypeBreakdown'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
  initialSelection: InteropSelection
  defaultSelectedFlowChains: string[]
}

export function InteropSummaryPage({
  interopChains,
  queryState,
  initialSelection,
  protocols,
  defaultSelectedFlowChains,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider
          interopChains={interopChains}
          initialSelection={initialSelection}
        >
          <SideNavLayout variant="wide">
            <MainPageHeader>Interoperability</MainPageHeader>
            <Content
              interopChains={interopChains}
              protocols={protocols}
              defaultSelectedFlowChains={defaultSelectedFlowChains}
            />
          </SideNavLayout>
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Content({
  interopChains,
  protocols,
  defaultSelectedFlowChains,
}: {
  interopChains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
  defaultSelectedFlowChains: string[]
}) {
  const { selectedChains } = useInteropSelectedChains()

  if (selectedChains.from.length === 0 && selectedChains.to.length === 0) {
    return (
      <FlowsView
        interopChains={interopChains}
        protocols={protocols}
        defaultSelectedChains={defaultSelectedFlowChains}
      />
    )
  }

  return (
    <>
      <MultiChainSelector chains={interopChains} protocols={protocols} />
      <Widgets interopChains={interopChains} />
    </>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.dashboard.queryOptions(selectedChains),
  )

  if (data === null) {
    return <InteropEmptyState />
  }

  const { lockAndMint, nonMinting, burnAndMint } = getBridgeTypeEntries(
    data?.entries ?? [],
  )
  const breakdown = getTransferTypeBreakdown(data?.entries ?? [])

  return (
    <div
      className="grid grid-cols-1 md:mt-5 md:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
      data-hide-overflow-x
    >
      <div className="z-10">
        <TopRoutesWidget isLoading={isLoading} flows={data?.flows} />
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
      <div className="col-span-full grid grid-cols-1 min-[1024px]:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] min-md:gap-5">
        <BreakdownByTransferType isLoading={isLoading} breakdown={breakdown} />
        <TokenCount
          isLoading={isLoading}
          tokenCount={data?.tokenCount}
          topItems={data?.topTokens}
        />
      </div>
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
