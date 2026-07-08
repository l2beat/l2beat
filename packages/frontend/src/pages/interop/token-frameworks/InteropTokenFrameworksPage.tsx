import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { InteropChainSelector } from '../components/chain-selector/InteropChainSelector'
import { InteropSelectedChainsProvider } from '../components/chain-selector/InteropSelectedChainsContext'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { FrameworkDominanceWidget } from './components/FrameworkDominanceWidget'
import {
  TotalTransfersWidget,
  TotalVolumeWidget,
} from './components/FrameworkTotalsWidgets'
import { FrameworkTransferSizeWidget } from './components/FrameworkTransferSizeWidget'
import { FrameworksTable } from './components/frameworks-table/FrameworksTable'
import { TopTokensWidget } from './components/TopTokensWidget'
import { FrameworkTransferSpeedWidget } from './components/transfer-speed/FrameworkTransferSpeedWidget'
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
        <InteropSelectedChainsProvider interopChains={interopChains}>
          <SideNavLayout>
            <MainPageHeader description="This dashboard provides a comprehensive overview of the major token frameworks - multichain standards that can be used for token creation. The page uses cross-chain transfers data to provide insights on volume, transfers, tokens and speed across different chains.">
              Token frameworks
            </MainPageHeader>
            <div className="mt-4 max-md:bg-surface-primary max-md:p-4 max-md:pb-0">
              <InteropChainSelector allChains={interopChains} />
            </div>
            <div className="grid md:mt-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-12">
              <div className="grid grid-cols-2 gap-2 border-divider border-b bg-surface-primary p-4 md:hidden">
                <TotalVolumeWidget mobile />
                <TotalTransfersWidget mobile />
              </div>
              <FrameworkDominanceWidget tokenFrameworks={tokenFrameworks} />
              <TopTokensWidget tokenFrameworks={tokenFrameworks} />
              <FrameworkTransferSpeedWidget
                tokenFrameworks={tokenFrameworks}
                interopChains={interopChains}
              />
              <TotalVolumeWidget className="max-md:hidden" />
              <TotalTransfersWidget className="max-md:hidden" />
            </div>
            <HorizontalSeparator className="md:my-4" />
            <FrameworkTransferSizeWidget />
            <HorizontalSeparator className="md:my-4" />
            <FrameworksTable tokenFrameworks={tokenFrameworks} />
          </SideNavLayout>
        </InteropSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
