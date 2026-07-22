import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { Layer2sSummaryActivityChart } from '~/components/chart/activity/Layer2sSummaryActivityChart'
import { Layer2sSummaryTvsChart } from '~/components/chart/tvs/Layer2sSummaryTvsChart'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TvsDisplayControlsContextProvider } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sSummaryEntry } from '~/server/features/layer2s/summary/getLayer2sSummaryEntries'
import { optionToRange } from '~/utils/range/range'
import { ChartTabs } from './components/ChartTabs'
import { Layer2sSummaryTables } from './components/Layer2sSummaryTables'
import {
  LAYER2S_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  LAYER2S_SUMMARY_TVS_CHART_RANGE_ARGS,
  LAYER2S_SUMMARY_UNIT,
} from './layer2sSummaryConstants'

interface Props extends AppLayoutProps {
  entries: TabbedLayer2sEntries<Layer2sSummaryEntry>
  queryState: DehydratedState
}

export function Layer2sSummaryPage({ entries, queryState, ...props }: Props) {
  const tvsChartRange = optionToRange(...LAYER2S_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...LAYER2S_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )

  const tvsChart = (
    <Layer2sSummaryTvsChart unit={LAYER2S_SUMMARY_UNIT} range={tvsChartRange} />
  )
  const activityChart = (
    <Layer2sSummaryActivityChart range={activityChartRange} />
  )

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout>
          <MainPageHeader>Summary</MainPageHeader>
          <div className="grid grid-cols-2 gap-4 max-lg:hidden">
            <PrimaryCard>{tvsChart}</PrimaryCard>
            <PrimaryCard>{activityChart}</PrimaryCard>
          </div>
          <ChartTabs className="lg:hidden" charts={[tvsChart, activityChart]} />
          <TvsDisplayControlsContextProvider
            initialValues={{
              excludeAssociatedTokens: false,
              excludeRwaRestrictedTokens: true,
            }}
          >
            <TableFilterContextProvider>
              <Layer2sSummaryTables {...entries} />
            </TableFilterContextProvider>
          </TvsDisplayControlsContextProvider>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
