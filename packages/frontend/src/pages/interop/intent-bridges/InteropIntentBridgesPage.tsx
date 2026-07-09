import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ChainSetSelectionProvider } from '../components/chain-selector/ChainSetSelectionContext'
import { InteropChainSelector } from '../components/chain-selector/InteropChainSelector'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { InteropOverviewProvider } from '../components/InteropOverviewContext'
import {
  InteropTotalTransfersWidget,
  InteropTotalVolumeWidget,
} from '../components/InteropTotalsWidgets'
import { InteropTransferSizeWidget } from '../components/InteropTransferSizeWidget'
import { InteropTransferSpeedWidget } from '../components/InteropTransferSpeedWidget'
import { IntentBridgeDominanceWidget } from './components/dominance/IntentBridgeDominanceWidget'
import { IntentBridgesTable } from './components/table/IntentBridgesTable'
import { IntentTopTokensWidget } from './components/top-tokens/IntentTopTokensWidget'
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
        <ChainSetSelectionProvider interopChains={interopChains}>
          <InteropOverviewProvider dataset="intentBridges">
            <SideNavLayout>
              <MainPageHeader description="This dashboard provides an overview of intent-based bridge protocols. It combines indexed transfer activity with curated intent-specific properties such as user recovery paths, solver access, settlement model, active tokens and active chain routes.">
                Intent bridges
              </MainPageHeader>
              <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
                <InteropChainSelector allChains={interopChains} />
              </div>
              <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
                <InteropTotalVolumeWidget mobile />
                <InteropTotalTransfersWidget mobile />
              </div>
              <div className="md:mt-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
                <div className="flex flex-col md:col-span-2 md:gap-4">
                  <IntentBridgeDominanceWidget intentBridges={intentBridges} />
                  <div className="grid grid-cols-2 gap-4 max-md:hidden">
                    <InteropTotalVolumeWidget />
                    <InteropTotalTransfersWidget />
                  </div>
                </div>
                <div className="flex flex-col md:col-span-2 md:gap-4 lg:h-0 lg:min-h-full">
                  <IntentTopTokensWidget intentBridges={intentBridges} />
                  <InteropTransferSpeedWidget
                    entities={intentBridges.map((bridge) => ({
                      id: bridge.id,
                      slug: bridge.slug,
                      iconUrl: bridge.iconUrl,
                      color: bridge.color,
                      label: bridge.name,
                    }))}
                    interopChains={interopChains}
                    description="Select two chains to compare intent bridge transfer speed."
                    listHeading="All intent bridges"
                    className="lg:min-h-0 lg:flex-1"
                    scrollClassName="max-h-56 pr-3 lg:max-h-none lg:min-h-0"
                  />
                </div>
              </div>
              <HorizontalSeparator className="md:my-4" />
              <InteropTransferSizeWidget
                className="h-75"
                categoryAxisWidth={130}
              />
              <HorizontalSeparator className="md:my-4" />
              <IntentBridgesTable intentBridges={intentBridges} />
            </SideNavLayout>
          </InteropOverviewProvider>
        </ChainSetSelectionProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
