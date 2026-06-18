import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { IntentBridgeDominanceWidget } from './components/IntentBridgeDominanceWidget'
import { IntentBridgeProtocolsTable } from './components/IntentBridgeProtocolsTable'
import { IntentBridgesChainSelector } from './components/IntentBridgesChainSelector'
import {
  IntentTotalTransfersWidget,
  IntentTotalVolumeWidget,
} from './components/IntentBridgeTotalsWidgets'
import { IntentTopTokensWidget } from './components/IntentTopTokensWidget'
import { IntentTransferSizeWidget } from './components/IntentTransferSizeWidget'
import { IntentTransferSpeedWidget } from './components/transfer-speed/IntentTransferSpeedWidget'
import type { InteropIntentBridge } from './getInteropIntentBridgesData'
import { IntentBridgesSelectedChainsProvider } from './utils/IntentBridgesSelectedChainsContext'

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
        <IntentBridgesSelectedChainsProvider interopChains={interopChains}>
          <SideNavLayout>
            <MainPageHeader description="This dashboard provides an overview of intent-based bridge protocols. It combines indexed transfer activity with curated intent-specific properties such as user recovery paths, solver access, settlement model, active tokens and active chain routes.">
              Intent bridges
            </MainPageHeader>
            <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
              <IntentBridgesChainSelector allChains={interopChains} />
            </div>
            <div className="grid md:mt-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-12">
              <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
                <IntentTotalVolumeWidget mobile />
                <IntentTotalTransfersWidget mobile />
              </div>
              <IntentBridgeDominanceWidget intentBridges={intentBridges} />
              <IntentTopTokensWidget intentBridges={intentBridges} />
              <IntentTransferSpeedWidget
                intentBridges={intentBridges}
                interopChains={interopChains}
              />
              <IntentTotalVolumeWidget className="max-md:hidden" />
              <IntentTotalTransfersWidget className="max-md:hidden" />
            </div>
            <HorizontalSeparator className="md:my-4" />
            <IntentTransferSizeWidget />
            <HorizontalSeparator className="md:my-4" />
            <IntentBridgeProtocolsTable intentBridges={intentBridges} />
          </SideNavLayout>
        </IntentBridgesSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
