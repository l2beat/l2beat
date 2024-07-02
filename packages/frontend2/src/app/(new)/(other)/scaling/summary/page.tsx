import { getDefaultMetadata } from '~/utils/get-default-metadata'

import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { About } from '~/app/_components/about'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OtherSites } from '~/app/_components/other-sites'
import { getScalingSummaryEntries } from '~/server/features/scaling/get-scaling-summary-entries'
import { getTvl } from '~/server/features/scaling/get-tvl'
import { ScalingSummaryTables } from './_components/scaling-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})

export default async function Page() {
  const tvl = await getTvl()
  const { layer2s, layer3s } = await getScalingSummaryEntries(tvl)

  return (
    <div className="mb-20">
      <TvlChart data={tvl.layers2s} milestones={HOMEPAGE_MILESTONES} />
      <HorizontalSeparator className="my-4 md:my-6" />
      <ScalingSummaryTables layer2s={layer2s} layer3s={layer3s} />
      <OtherSites />
      <About />
    </div>
  )
}
