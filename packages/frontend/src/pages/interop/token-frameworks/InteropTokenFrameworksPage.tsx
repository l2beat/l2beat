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
import { FrameworkDominanceWidget } from './components/FrameworkDominanceWidget'
import { FrameworksTable } from './components/frameworks-table/FrameworksTable'
import { TopTokensWidget } from './components/TopTokensWidget'
import type { InteropTokenFramework } from './getInteropTokenFrameworksData'

interface Props extends AppLayoutProps {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
  queryState: DehydratedState
}

export function InteropTokenFrameworksPage({
  tokenFrameworks,
  interopChains,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <ChainSetSelectionProvider interopChains={interopChains}>
          <InteropOverviewProvider dataset="tokenFrameworks">
            <SideNavLayout>
              <MainPageHeader description="This dashboard provides a comprehensive overview of the major token frameworks - multichain standards that can be used for token creation. The page uses cross-chain transfers data to provide insights on volume, transfers, tokens and speed across different chains.">
                Token frameworks
              </MainPageHeader>
              <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
                <InteropChainSelector allChains={interopChains} />
              </div>
              <div className="grid md:mt-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-12">
                <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
                  <InteropTotalVolumeWidget mobile />
                  <InteropTotalTransfersWidget mobile />
                </div>
                <FrameworkDominanceWidget tokenFrameworks={tokenFrameworks} />
                <TopTokensWidget tokenFrameworks={tokenFrameworks} />
                <InteropTransferSpeedWidget
                  entities={tokenFrameworks.map((framework) => ({
                    id: framework.id,
                    slug: framework.slug,
                    iconUrl: framework.iconUrl,
                    color: framework.color,
                    label: framework.label,
                  }))}
                  interopChains={interopChains}
                  description="Select two chains to compare cross-chain transfer speed."
                  listHeading="All Frameworks"
                  className="md:col-span-2 lg:col-start-3 lg:row-span-7 lg:row-start-6"
                  scrollClassName="max-h-64.5"
                />
                <InteropTotalVolumeWidget className="max-md:hidden lg:col-start-1 lg:row-span-2 lg:row-start-11" />
                <InteropTotalTransfersWidget className="max-md:hidden lg:col-start-2 lg:row-span-2 lg:row-start-11" />
              </div>
              <HorizontalSeparator className="md:my-4" />
              <InteropTransferSizeWidget />
              <HorizontalSeparator className="md:my-4" />
              <FrameworksTable tokenFrameworks={tokenFrameworks} />
            </SideNavLayout>
          </InteropOverviewProvider>
        </ChainSetSelectionProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
