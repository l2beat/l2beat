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
import { DirectionalChainSelector } from '../components/chain-selector/DirectionalChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InitialChainSelector } from '../components/InitialChainSelector'
import { FlowsWidget } from '../components/widgets/FlowsWidget'
import { MobileCarouselWidget } from '../components/widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from '../components/widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from '../components/widgets/protocols/TopProtocolsByVolume'
import { TopTokenWidget } from '../components/widgets/TopTokenWidget'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import type { InteropSelection } from '../utils/getInitialInteropSelection'
import {
  type InteropMode,
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import { HeaderWithDescription } from './components/HeaderWithDescription'

interface Props extends AppLayoutProps {
  mode: InteropMode
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  protocols: WithProjectIcon<Project<'interopConfig'>>[]
  initialSelection: InteropSelection
}

export function InteropBurnAndMintPage({
  mode,
  interopChains,
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
  protocols,
}: {
  mode: InteropMode
  interopChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}) {
  const { selectedChains, selectChain } = useInteropSelectedChains()

  if (mode === 'public' && (!selectedChains.first || !selectedChains.second)) {
    return (
      <>
        <div className="max-md:hidden">
          <HeaderWithDescription />
        </div>
        <InitialChainSelector
          interopChains={interopChains}
          selectedChains={selectedChains}
          selectChain={selectChain}
          type="burnAndMint"
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
        <DirectionalChainSelector chains={interopChains} />
      )}
      <div className="md:hidden">
        <HeaderWithDescription />
      </div>
      <Widgets interopChains={interopChains} />
    </>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { apiSelectionInput, mode, isDirty, reset } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    ...apiSelectionInput,
    type: 'burnAndMint',
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
      className="mt-5 grid grid-cols-1 md:grid-cols-2 min-[1600px]:grid-cols-3 min-md:gap-5"
      data-hide-overflow-x
    >
      <div className="z-10 max-md:hidden">
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
        type="burnAndMint"
        entries={data?.entries}
        zeroTransferProtocols={data?.zeroTransferProtocols}
        isLoading={isLoading}
        hideTypeColumn
      />
    </div>
  )
}
