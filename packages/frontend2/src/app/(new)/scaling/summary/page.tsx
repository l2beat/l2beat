import { getDefaultMetadata } from '~/utils/get-default-metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})
import { getScalingSummaryEntries } from '~/server/features/scaling/get-scaling-summary-entries'
import { getTvl } from '~/server/features/scaling/get-tvl'
import { OtherSites } from '~/app/_components/other-sites'
import { About } from '~/app/_components/about'
import { Tables } from './_components/tables'
import { HOMEPAGE_MILESTONES } from '@l2beat/config'

export default async function Page() {
  const tvl = await getTvl()
  const { layer2s, layer3s } = await getScalingSummaryEntries(tvl)

  return (
    <div className="mb-20">
      <Tables
        layer2s={layer2s}
        layer3s={layer3s}
        layer2sTvl={tvl.layers2s}
        milestones={HOMEPAGE_MILESTONES}
      />
      <OtherSites />
      <About />
    </div>
  )
}
