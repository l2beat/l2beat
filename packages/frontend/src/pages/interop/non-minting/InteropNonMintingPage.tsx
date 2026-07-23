import type { Project } from '@l2beat/config'
import {
  type DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { useTRPC } from '~/trpc/React'
import type { WithProjectIcon } from '~/utils/withProjectIcon'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { MultiChainSelector } from '../components/chain-selector/MultiChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InitialChainSelector } from '../components/InitialChainSelector'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopRoutesWidget } from '../components/widgets/TopRoutesWidget'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { HeaderWithDescription } from './components/HeaderWithDescription'

interface Props extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: WithProjectIcon<Project<'interopConfig'>>[]
  initialSelection: InteropSelection
}

export function InteropNonMintingPage({
  interopChains,
  onboardingInteropChains,
  queryState,
  initialSelection,
  protocols,
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
  const { selectedChains } = useInteropSelectedChains()

  if (selectedChains.from.length === 0 && selectedChains.to.length === 0) {
    return (
      <>
        <div className="max-md:hidden">
          <HeaderWithDescription />
        </div>
        <InitialChainSelector
          interopChains={onboardingInteropChains}
          type="nonMinting"
        />
      </>
    )
  }

  return (
    <>
      <div className="max-md:hidden">
        <HeaderWithDescription />
      </div>
      <MultiChainSelector chains={interopChains} protocols={protocols} />
      <div className="max-md:bg-surface-primary md:hidden">
        <HeaderWithDescription />
      </div>
      <Widgets interopChains={interopChains} />
    </>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.dashboard.queryOptions({
      ...selectedChains,
      type: 'nonMinting',
    }),
  )

  if (data === null) {
    return <InteropEmptyState />
  }

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
      <AllProtocolsCard
        type="nonMinting"
        entries={data?.entries}
        zeroTransferProtocols={data?.zeroTransferProtocols}
        isLoading={isLoading}
        hideTypeColumn
        showAverageInFlightValueColumn
      />
    </div>
  )
}
