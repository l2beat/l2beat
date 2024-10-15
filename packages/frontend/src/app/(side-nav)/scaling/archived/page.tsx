import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { getDefaultMetadata } from '~/utils/metadata'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingArchivedTable } from './_components/table/scaling-archived-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/archived',
  },
})

export default async function Page() {
  const entries = await getScalingArchivedEntries()
  return (
    <ScalingFilterContextProvider>
      <MainPageHeader>Archived</MainPageHeader>
      <MainPageCard>
        <ScalingArchivedTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
