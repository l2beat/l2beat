import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ActivityMetricContextProvider } from './_components/activity-metric-context'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTabs } from './_components/scaling-activity-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/activity',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingActivityEntries(),
    api.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    api.activity.chartStats.prefetch({
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
  ])

  return (
    <HydrateClient>
      <TableFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <ActivityMetricContextProvider>
            <MainPageHeader>Activity</MainPageHeader>
            <ScalingActivityTabs
              {...entries}
              milestones={HOMEPAGE_MILESTONES}
            />
          </ActivityMetricContextProvider>
        </ActivityTimeRangeContextProvider>
      </TableFilterContextProvider>
    </HydrateClient>
  )
}
