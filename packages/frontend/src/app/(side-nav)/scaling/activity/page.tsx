import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ActivityChart } from '~/components/chart/activity/activity-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTables } from './_components/scaling-activity-tables'

export const revalidate = 3600
export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/activity',
  },
})

export default async function Page() {
  const [entries, _, __] = await Promise.all([
    getScalingActivityEntries(),
    api.activity.chart.prefetch({
      range: '30d',
      filter: { type: 'all' },
    }),
    api.activity.chartStats.prefetch({
      filter: { type: 'all' },
    }),
  ])
  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <MainPageHeader>Activity</MainPageHeader>
          <MainPageCard>
            <ActivityChart
              milestones={HOMEPAGE_MILESTONES}
              entries={[
                ...entries.rollups,
                ...entries.validiumsAndOptimiums,
                ...(entries.others ?? []),
              ]}
            />
          </MainPageCard>
          <ScalingActivityTables {...entries} />
        </ActivityTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
