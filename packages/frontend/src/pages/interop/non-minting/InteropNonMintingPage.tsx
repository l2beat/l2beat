import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
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
import { InteropEmptyState } from '../summary/components/InteropEmptyState'
import {
  InteropSelectedChainsProvider,
  useInteropSelectedChains,
} from '../utils/InteropSelectedChainsContext'
import { HeaderWithDescription } from './components/HeaderWithDescription'

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
          <div className="max-md:hidden">
            <HeaderWithDescription />
          </div>
          <InteropSelectedChainsProvider interopChains={interopChains}>
            <ChainSelector chains={interopChains} />
            <div className="md:hidden">
              <HeaderWithDescription />
            </div>
            <Widgets interopChains={interopChains} />
          </InteropSelectedChainsProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

function Widgets({ interopChains }: { interopChains: InteropChainWithIcon[] }) {
  const { selectedChains, isDirty } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
    type: 'nonMinting',
  })

  if (
    data?.entries.length === 0 &&
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
          data={data}
        />
      </div>
      <div className="h-full max-[1600px]:hidden">
        <TopProtocolsByVolume data={data} isLoading={isLoading} />
      </div>
      <div className="h-full max-[1600px]:hidden">
        <TopProtocolsByTransfers data={data} isLoading={isLoading} />
      </div>
      <MobileCarouselWidget
        interopChains={interopChains}
        data={data}
        isLoading={isLoading}
      />
      <AllProtocolsCard data={data} isLoading={isLoading} hideTypeColumn />
    </div>
  )
}
