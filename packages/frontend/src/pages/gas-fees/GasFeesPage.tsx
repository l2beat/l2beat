import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { ChartRange } from '~/utils/range/range'
import { GasFeesView } from './components/GasFeesView'
import type { GasFeesChain } from './components/types'

interface Props extends AppLayoutProps {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  initialRange: ChartRange
  queryState: DehydratedState
}

export function GasFeesPage({
  chains,
  upgrades,
  initialRange,
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
            initialRange={initialRange}
          />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
