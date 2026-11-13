import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'
import { LIQUID_STAKING_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { LiquidStakingEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import type { ChartRange } from '~/utils/range/range'
import { LiquidStakingCharts } from './components/LiquidStakingCharts'
import { LiquidStakingTable } from './components/LiquidStakingTable'

interface Props extends AppLayoutProps {
  entries: LiquidStakingEntry[]
  defaultChartRange: ChartRange
  queryState: DehydratedState
}

export function LiquidStakingPage({
  entries,
  defaultChartRange,
  queryState,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader description={LIQUID_STAKING_DESCRIPTION}>
            Liquid staking
          </MainPageHeader>
          <LiquidStakingCharts
            projects={entries}
            defaultRange={defaultChartRange}
          />
          <PrimaryCard className="mt-4">
            <h2 className="mb-1 font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
              Risk comparison
            </h2>
            <TabInfoWithDrawer
              title="What are liquid staking tokens?"
              content="Liquid staking tokens represent ETH staked through a protocol. Holders can trade or use them while the ETH earns rewards. Holding one means trusting the protocol's contracts and the parties that run its validators, report its exchange rate and can upgrade it. The table compares those assumptions."
            />
            <LiquidStakingTable entries={entries} />
          </PrimaryCard>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
