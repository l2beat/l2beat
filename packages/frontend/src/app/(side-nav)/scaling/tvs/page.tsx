import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getScalingTvsEntries } from 'rewrite/src/server/features/scaling/tvs/get-scaling-tvs-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingTvsPage } from './_page'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/tvs',
  },
})

export default async function Page() {
  const entries = await getScalingTvsEntries()

  await api.tvs.chart.prefetch({
    filter: {
      type: 'rollups',
    },
    range: '1y',
    excludeAssociatedTokens: false,
    previewRecategorisation: false,
  })

  return (
    <HydrateClient>
      <ScalingTvsPage entries={entries} milestones={HOMEPAGE_MILESTONES} />
    </HydrateClient>
  )
}
