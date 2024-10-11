import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import { ScalingFilterContextProvider } from '../_components/scaling-filter-context'
import { ScalingArchivedTable } from './_components/table/scaling-archived-table'

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
