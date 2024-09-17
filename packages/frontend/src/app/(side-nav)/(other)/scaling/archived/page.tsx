import { SimplePageHeader } from '~/components/simple-page-header'
import { ScalingArchivedTable } from './_components/scaling-archived-table'

export default function Page() {
  return (
    <>
      <SimplePageHeader>Archived</SimplePageHeader>
      <ScalingArchivedTable />
    </>
  )
}
