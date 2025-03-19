import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { externalLinks } from '~/consts/external-links'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesRiskTable } from './_components/table/bridges-risks-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/risk',
  },
})

export default async function Page() {
  const entries = await getBridgeRiskEntries()

  return (
    <>
      <TableFilterContextProvider>
        <Header />
        <PrimaryCard>
          <BridgesRiskTable entries={entries} />
        </PrimaryCard>
      </TableFilterContextProvider>
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
      Risk Analysis
    </MainPageHeader>
  )
}
