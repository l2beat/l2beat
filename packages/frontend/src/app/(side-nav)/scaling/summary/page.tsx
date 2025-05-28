import { getScalingSummaryEntries } from 'rewrite/src/server/features/scaling/summary/get-scaling-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { SCALING_SUMMARY_TIME_RANGE, ScalingSummaryPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingSummaryEntries(),
    api.tvs.recategorisedChart.prefetch({
      range: SCALING_SUMMARY_TIME_RANGE,
      filter: { type: 'layer2' },
      previewRecategorisation: false,
    }),
    api.activity.recategorisedChart.prefetch({
      range: SCALING_SUMMARY_TIME_RANGE,
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
    api.activity.chartStats.prefetch({
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
  ])

  return (
    <HydrateClient>
      <ScalingSummaryPage entries={entries} />
    </HydrateClient>
  )
}
