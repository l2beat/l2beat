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
import { TokenFrameworksChainSelector } from './components/TokenFrameworksChainSelector'
import { TopTokensWidget } from './components/TopTokensWidget'
import type { InteropTokenFramework } from './getInteropTokenFrameworksData'
import { TokenFrameworksSelectedChainsProvider } from './utils/TokenFrameworksSelectedChainsContext'

interface Props extends AppLayoutProps {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
}

export function InteropTokenFrameworksPage({
  tokenFrameworks,
  interopChains,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <TokenFrameworksSelectedChainsProvider interopChains={interopChains}>
        <SideNavLayout>
          <MainPageHeader description="Comparing five major multichain token frameworks covered in LI.FI's analysis. Data is sourced from L2BEAT's interop tracking infrastructure. Claims from the original article">
            Token frameworks
          </MainPageHeader>
          <div className="mt-4">
            <TokenFrameworksChainSelector allChains={interopChains} />
          </div>
          <div className="mt-4 grid grid-cols-4 grid-rows-6 gap-4">
            <FrameworkDominanceWidget tokenFrameworks={tokenFrameworks} />
            <TopTokensWidget tokenFrameworks={tokenFrameworks} />
            <TotalVolumeWidget />
            <TotalTransfersWidget />
          </div>
        </SideNavLayout>
      </TokenFrameworksSelectedChainsProvider>
    </AppLayout>
  )
}
