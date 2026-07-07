import {
  type DehydratedState,
  HydrationBoundary,
  useQuery,
} from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { useTRPC } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropIntentBridge } from './getInteropIntentBridgesData'

interface Props extends AppLayoutProps {
  intentBridges: InteropIntentBridge[]
  interopChains: InteropChainWithIcon[]
  queryState: DehydratedState
}

export function InteropIntentBridgesPage({
  intentBridges,
  interopChains,
  queryState,
  ...props
}: Props) {
  const initialChainIds = interopChains.map((chain) => chain.id)

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description="This dashboard provides an overview of intent-based bridge protocols across supported interop chains.">
            Intent bridges
          </MainPageHeader>
          <IntentBridgesSummary
            intentBridges={intentBridges}
            initialChainIds={initialChainIds}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}

function IntentBridgesSummary({
  intentBridges,
  initialChainIds,
}: {
  intentBridges: InteropIntentBridge[]
  initialChainIds: string[]
}) {
  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: initialChainIds,
      to: initialChainIds,
    }),
  )

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <PrimaryCard>
        <div className="font-medium text-secondary text-xs uppercase">
          Intent bridges
        </div>
        <div className="mt-2 font-bold text-heading-24">
          {formatInteger(intentBridges.length)}
        </div>
      </PrimaryCard>
      <PrimaryCard>
        <div className="font-medium text-secondary text-xs uppercase">
          Total volume
        </div>
        <div className="mt-2 font-bold text-brand text-heading-24">
          {data ? formatCurrency(data.activity.totalVolume, 'usd') : '...'}
        </div>
      </PrimaryCard>
      <PrimaryCard>
        <div className="font-medium text-secondary text-xs uppercase">
          Total transfers
        </div>
        <div className="mt-2 font-bold text-brand text-heading-24">
          {data ? formatInteger(data.activity.totalTransferCount) : '...'}
        </div>
      </PrimaryCard>
    </div>
  )
}
