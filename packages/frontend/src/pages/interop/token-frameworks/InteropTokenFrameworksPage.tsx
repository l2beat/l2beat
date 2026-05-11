import { type DehydratedState, HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { FrameworkDominanceWidget } from './components/FrameworkDominanceWidget'
import {
  TotalTransfersWidget,
  TotalVolumeWidget,
} from './components/FrameworkTotalsWidgets'
import { FrameworkTransferSizeWidget } from './components/FrameworkTransferSizeWidget'
import { FrameworksTable } from './components/frameworks-table/FrameworksTable'
import { TokenFrameworksChainSelector } from './components/TokenFrameworksChainSelector'
import { TopTokensWidget } from './components/TopTokensWidget'
import { FrameworkTransferSpeedWidget } from './components/transfer-speed/FrameworkTransferSpeedWidget'
import type { InteropTokenFramework } from './getInteropTokenFrameworksData'
import { TokenFrameworksSelectedChainsProvider } from './utils/TokenFrameworksSelectedChainsContext'

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
        <TokenFrameworksSelectedChainsProvider interopChains={interopChains}>
          <SideNavLayout>
            <MainPageHeader description="Comparing five major multichain token frameworks covered in LI.FI's analysis. Data is sourced from L2BEAT's interop tracking infrastructure. Claims from the original article">
              Token frameworks
            </MainPageHeader>
            <div className="mt-4">
              <TokenFrameworksChainSelector allChains={interopChains} />
            </div>
            <div className="mt-4 grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-12">
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
            <HorizontalSeparator className="my-4" />
            <FrameworkTransferSizeWidget />
            <HorizontalSeparator className="my-4" />
            <FrameworksTable tokenFrameworks={tokenFrameworks} />
          </SideNavLayout>
        </TokenFrameworksSelectedChainsProvider>
      </HydrationBoundary>
    </AppLayout>
  )
}
