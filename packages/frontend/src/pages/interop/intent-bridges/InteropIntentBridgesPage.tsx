import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { InteropChainSelector } from '../components/chain-selector/InteropChainSelector'
import { InteropSelectedChainsProvider } from '../components/chain-selector/InteropSelectedChainsContext'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { IntentBridgeDominanceWidget } from './components/dominance/IntentBridgeDominanceWidget'
import {
  IntentTotalTransfersWidget,
  IntentTotalVolumeWidget,
} from './components/IntentBridgeTotalsWidgets'
import { IntentTransferSizeWidget } from './components/IntentTransferSizeWidget'
import { IntentBridgesTable } from './components/table/IntentBridgesTable'
import { IntentTopTokensWidget } from './components/top-tokens/IntentTopTokensWidget'
import { IntentTransferSpeedWidget } from './components/transfer-speed/IntentTransferSpeedWidget'
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
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <InteropSelectedChainsProvider interopChains={interopChains}>
          <SideNavLayout>
            <MainPageHeader description="This dashboard provides an overview of intent-based bridge protocols. It combines indexed transfer activity with curated intent-specific properties such as user recovery paths, solver access, settlement model, active tokens and active chain routes.">
              Intent bridges
            </MainPageHeader>
            <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
              <InteropChainSelector allChains={interopChains} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
              <IntentTotalVolumeWidget mobile />
              <IntentTotalTransfersWidget mobile />
            </div>
            <div className="md:mt-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
              <div className="flex flex-col md:col-span-2 md:gap-4">
                <IntentBridgeDominanceWidget intentBridges={intentBridges} />
                <div className="grid grid-cols-2 gap-4 max-md:hidden">
                  <IntentTotalVolumeWidget />
                  <IntentTotalTransfersWidget />
                </div>
              </div>
              <div className="flex flex-col md:col-span-2 md:gap-4 lg:h-0 lg:min-h-full">
                <IntentTopTokensWidget intentBridges={intentBridges} />
                <IntentTransferSpeedWidget
                  intentBridges={intentBridges}
                  interopChains={interopChains}
                />
              </div>
            </div>
            <HorizontalSeparator className="md:my-4" />
            <IntentTransferSizeWidget />
            <HorizontalSeparator className="md:my-4" />
            <IntentBridgesTable intentBridges={intentBridges} />
          </SideNavLayout>
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
