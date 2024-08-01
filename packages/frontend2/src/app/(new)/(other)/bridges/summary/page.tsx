import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridge-summary-entries'
import { getTvl } from '~/server/features/scaling/get-tvl'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import { BridgesMvpWarning } from '../_components/bridges-mvp-warning'
import { BridgesSummaryTables } from './_components/table/bridges-summary-tables'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const tvl = await getTvl()
  const entries = await getBridgesSummaryEntries(tvl)
  return (
    <div className="mb-8">
      <BridgesMvpWarning />
      <TvlChart data={tvl.bridges} milestones={[]} headerContent="bridges" />
      <HorizontalSeparator className="my-4 md:my-6" />
      <BridgesSummaryTables items={entries} />
    </div>
  )
}
