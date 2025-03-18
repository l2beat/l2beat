import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { externalLinks } from '~/consts/external-links'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { BridgesFilterContextProvider } from '../_components/bridges-filter-context'
import { BridgesArchivedTable } from './_components/table/bridges-archived-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/bridges/archived',
  },
})

export default async function Page() {
  const entries = await getBridgesArchivedEntries()
  return (
    <BridgesFilterContextProvider>
      <Header />
      <PrimaryCard>
        <BridgesArchivedTable entries={entries} />
      </PrimaryCard>
    </BridgesFilterContextProvider>
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
      Archived
    </MainPageHeader>
  )
}
