import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { ActivityChart } from '~/components/chart/activity/activity-chart'
import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { env } from '~/env'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ActivityMetricContextProvider } from './_components/activity-metric-context'
import { ActivityTimeRangeContextProvider } from './_components/activity-time-range-context'
import { ScalingActivityTabs } from './_components/scaling-activity-tabs'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/activity',
  },
})

export default async function Page() {
  const useOthers = env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS

  const [entries, _, __] = await Promise.all([
    getScalingActivityEntries(),
    !useOthers &&
      api.activity.chart.prefetch({
        range: '30d',
        filter: { type: 'all' },
      }),
    !useOthers &&
      api.activity.chartStats.prefetch({
        filter: { type: 'all' },
      }),
  ])

  if (useOthers) {
    const rollupsIds = entries.rollups.map((project) => project.id)
    await Promise.all([
      api.activity.chart.prefetch({
        range: '30d',
        filter: {
          type: 'projects',
          projectIds: rollupsIds,
        },
      }),
      api.activity.chartStats.prefetch({
        filter: { type: 'projects', projectIds: rollupsIds },
      }),
    ])
  }

  return (
    <HydrateClient>
      <ScalingFilterContextProvider>
        <ActivityTimeRangeContextProvider>
          <ActivityMetricContextProvider>
            <MainPageHeader>Activity</MainPageHeader>
            {!useOthers && (
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
            )}
            <ScalingActivityTabs
              {...entries}
              milestones={HOMEPAGE_MILESTONES}
            />
          </ActivityMetricContextProvider>
        </ActivityTimeRangeContextProvider>
      </ScalingFilterContextProvider>
    </HydrateClient>
  )
}
