import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getScalingCostsEntries } from 'rewrite/src/server/features/scaling/costs/get-scaling-costs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingCostsPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/costs',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getScalingCostsEntries(),
    api.costs.chart.prefetch({
      range: '30d',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    api.costs.table.prefetch({ range: '30d' }),
  ])

  return (
    <HydrateClient>
      <ScalingCostsPage entries={entries} milestones={HOMEPAGE_MILESTONES} />
    </HydrateClient>
  )
}
