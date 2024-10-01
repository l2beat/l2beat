import { MainPageCard } from '~/components/main-page-card'
import { SimplePageHeader } from '~/components/simple-page-header'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingArchivedTable } from './_components/scaling-archived-table'

export default async function Page() {
  const entries = await getScalingArchivedEntries()
  return (
    <ScalingFilterContextProvider>
      <SimplePageHeader>Archived</SimplePageHeader>
      <MainPageCard>
        <ScalingArchivedTable entries={entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}
