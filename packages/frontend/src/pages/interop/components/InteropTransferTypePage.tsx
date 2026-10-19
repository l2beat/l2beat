import type { Project } from '@l2beat/config'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import {
  type DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'
import { useTRPC } from '~/trpc/React'
import type { WithProjectIcon } from '~/utils/withProjectIcon'
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import { TRANSFER_TYPE_DISPLAY } from '../utils/display'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import type { InteropSelection } from '../utils/types'
import { AllProtocolsCard } from './AllProtocolsCard'
import { MultiChainSelector } from './chain-selector/MultiChainSelector'
import type { InteropChainWithIcon } from './chain-selector/types'
import { InitialChainSelector } from './InitialChainSelector'
import { MobileCarouselWidget } from './widgets/protocols/MobileCarouselWidget'
import { TopProtocolsByTransfers } from './widgets/protocols/TopProtocolsByTransfers'
import { TopProtocolsByVolume } from './widgets/protocols/TopProtocolsByVolume'
import { TopRoutesWidget } from './widgets/TopRoutesWidget'
import { TopTokenWidget } from './widgets/TopTokenWidget'

export type TransferType = Extract<
  KnownInteropBridgeType,
  'lockAndMint' | 'burnAndMint' | 'nonMinting'
>

export interface InteropTransferTypePageProps extends AppLayoutProps {
  queryState: DehydratedState
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: WithProjectIcon<Project<'interopConfig'>>[]
  initialSelection: InteropSelection
}

export function InteropTransferTypePage({
  type,
  interopChains,
  onboardingInteropChains,
  queryState,
  initialSelection,
  protocols,
  ...props
}: InteropTransferTypePageProps & { type: TransferType }) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider
          interopChains={interopChains}
          initialSelection={initialSelection}
        >
          <SideNavLayout variant="wide">
            <Content
              type={type}
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
  type,
  interopChains,
  onboardingInteropChains,
  protocols,
}: {
  type: TransferType
  interopChains: InteropChainWithIcon[]
  onboardingInteropChains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}) {
  const { selectedChains } = useInteropSelectedChains()

  if (selectedChains.from.length === 0 && selectedChains.to.length === 0) {
    return (
      <>
        <div className="max-md:hidden">
          <HeaderWithDescription type={type} />
        </div>
        <InitialChainSelector
          interopChains={onboardingInteropChains}
          type={type}
        />
      </>
    )
  }

  return (
    <>
      <div className="max-md:hidden">
        <HeaderWithDescription type={type} />
      </div>
      <MultiChainSelector chains={interopChains} protocols={protocols} />
      <div className="max-md:bg-surface-primary md:hidden">
        <HeaderWithDescription type={type} />
      </div>
      <Widgets type={type} interopChains={interopChains} />
    </>
  )
}

function Widgets({
  type,
  interopChains,
}: {
  type: TransferType
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.dashboard.queryOptions({
      ...selectedChains,
      type,
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
        type={type}
        entries={data?.entries}
        zeroTransferProtocols={data?.zeroTransferProtocols}
        isLoading={isLoading}
        hideTypeColumn
        showAverageInFlightValueColumn={type === 'nonMinting'}
        showNetMintedValueColumn={type === 'lockAndMint'}
      />
    </div>
  )
}

function HeaderWithDescription({ type }: { type: TransferType }) {
  const display = TRANSFER_TYPE_DISPLAY[type]
  return (
    <MainPageHeader description={display.description}>
      {`${display.label} Protocols`}
    </MainPageHeader>
  )
}
