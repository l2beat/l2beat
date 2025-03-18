import { BridgesTvsChart } from '~/components/chart/tvs/bridges-tvs-chart'
import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { externalLinks } from '~/consts/external-links'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { HydrateClient, api } from '~/trpc/server'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesSummaryTable } from './_components/table/bridges-summary-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/summary',
  },
})

export default async function Page() {
  const [entries] = await Promise.all([
    getBridgesSummaryEntries(),
    api.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
    }),
  ])

  return (
    <>
      <HydrateClient>
        <BridgesFilterContextProvider>
          <Header />
          <PrimaryCard>
            <BridgesTvsChart />
          </PrimaryCard>
          <PrimaryCard className="md:mt-6">
            <BridgesSummaryTable entries={entries} />
          </PrimaryCard>
        </BridgesFilterContextProvider>
      </HydrateClient>
    </>
  )
}

function Header() {
  return (
    <MainPageHeader
      warning={
        <>
          L2BEAT Bridges is a work in progress. You might find incomplete
          research or inconsistent naming. Join our{' '}
          <CustomLink href={externalLinks.discord}>Discord</CustomLink> to
          suggest improvements!
        </>
      }
    >
      Summary
    </MainPageHeader>
  )
}
