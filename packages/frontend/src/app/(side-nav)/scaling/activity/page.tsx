import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getScalingActivityEntries } from 'rewrite/src/server/features/scaling/activity/get-scaling-activity-entries'
import { api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ActivityPage } from './_page'

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

  return <ActivityPage entries={entries} milestones={HOMEPAGE_MILESTONES} />
}
