import type { GasFeesWallet } from '@l2beat/database'
import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GasFeesStats } from '~/server/features/gas-fees/daily/getGasFeesStats'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import type { GasFeesUpgrades } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { GasFeesTipping } from '~/server/features/gas-fees/tipping/getGasFeesTipping'
import type { ChartRange } from '~/utils/range/range'
import { ChainHighlightProvider } from './components/ChainHighlight'
import { CompareCard } from './components/compare/CompareCard'
import { CostsCard } from './components/costs/CostsCard'
import { TippingCard } from './components/tipping/TippingCard'

interface Props extends AppLayoutProps {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrades
  tipping: GasFeesTipping
  stats: GasFeesStats
  walletIcons: Record<GasFeesWallet, string>
  chartRange: ChartRange
  tableRange: ChartRange
  queryState: DehydratedState
}

export function GasFeesPage({
  chains,
  upgrades,
  tipping,
  stats,
  walletIcons,
  chartRange,
  tableRange,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Gas fees</MainPageHeader>
          {/* On phones the cards run edge to edge, split by a line */}
          <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
            <TippingCard tipping={tipping} walletIcons={walletIcons} />
            <ChainHighlightProvider>
              <CompareCard
                chains={chains}
                stats={stats}
                upgrades={upgrades}
                initialRange={chartRange}
              />
              <CostsCard chains={chains} initialRange={tableRange} />
            </ChainHighlightProvider>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
