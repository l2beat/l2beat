import type { Project } from '@l2beat/config'
import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import type { WithProjectIcon } from '~/utils/withProjectIcon'
import { AllProtocolsCard } from '../components/AllProtocolsCard'
import { ChainSelector } from '../components/chain-selector/ChainSelector'
import { MultiChainSelector } from '../components/chain-selector/MultiChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InitialChainSelector } from '../components/InitialChainSelector'
import { FlowsWidget } from '../components/widgets/FlowsWidget'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropMode, InteropSelection } from '../utils/types'
import { HeaderWithDescription } from './components/HeaderWithDescription'

interface Props extends AppLayoutProps {
  mode: InteropMode
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: WithProjectIcon<Project<'interopConfig'>>[]
  initialSelection: InteropSelection
}

export function InteropLockAndMintPage({
  mode,
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
          mode={mode}
          interopChains={interopChains}
          initialSelection={initialSelection}
        >
          <SideNavLayout maxWidth="wide">
            <Content
              mode={mode}
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
  mode,
  interopChains,
  onboardingInteropChains,
  protocols,
}: {
  mode: InteropMode
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}) {
  const { selectedChains, selectChain } = useInteropSelectedChains()

  if (
    mode === 'public' &&
    (selectedChains.from.length !== 1 || selectedChains.to.length !== 1)
  ) {
    return (
      <>
        <div className="max-md:hidden">
          <HeaderWithDescription />
        </div>
        <InitialChainSelector
          interopChains={onboardingInteropChains}
          selectedChains={selectedChains}
          selectChain={selectChain}
          type="lockAndMint"
        />
      </>
    )
  }

  return (
    <>
      <div className="max-md:hidden">
        <HeaderWithDescription />
      </div>
      {mode === 'public' ? (
        <ChainSelector chains={interopChains} protocols={protocols} />
      ) : (
        <MultiChainSelector chains={interopChains} />
      )}
      <div className="max-md:bg-surface-primary md:hidden">
        <HeaderWithDescription />
      </div>
      <Widgets interopChains={interopChains} />
    </>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { selectionForApi, mode, isDirty, reset } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    ...selectionForApi,
    type: 'lockAndMint',
  })

  if (
    data?.entries.length === 0 &&
    data.flows.length === 0 &&
    data.topProtocols.length === 0
  ) {
    return (
      <InteropEmptyState
        showResetButton={mode === 'internal' && isDirty}
        onResetButtonClick={reset}
      />
    )
  }

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
      <AllProtocolsCard
        type="lockAndMint"
        entries={data?.entries}
        zeroTransferProtocols={data?.zeroTransferProtocols}
        isLoading={isLoading}
        hideTypeColumn
        showNetMintedValueColumn
      />
    </div>
  )
}
