import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GasFeesTipping } from '~/server/features/gas-fees/getGasFeesTipping'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { ChartRange } from '~/utils/range/range'
import { GasFeesView } from './components/GasFeesView'
import type { GasFeesChain, GasFeesWalletIcons } from './components/types'

interface Props extends AppLayoutProps {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  tipping: GasFeesTipping
  walletIcons: GasFeesWalletIcons
  initialRange: ChartRange
  initialTableRange: ChartRange
  statsRange: ChartRange
  queryState: DehydratedState
}

export function GasFeesPage({
  chains,
  upgrades,
  tipping,
  walletIcons,
  initialRange,
  initialTableRange,
  statsRange,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Gas fees</MainPageHeader>
          <GasFeesView
            chains={chains}
            upgrades={upgrades}
            tipping={tipping}
            walletIcons={walletIcons}
            initialRange={initialRange}
            initialTableRange={initialTableRange}
            statsRange={statsRange}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
