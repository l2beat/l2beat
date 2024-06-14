import { daLayers } from '@l2beat/config/build/src/projects/other/da-beat'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { DaSummaryTable } from './_components/table/da-summary-table'
import { toDaSummaryEntry } from './_utils/da-summary-entry'

export default function Page() {
  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">Summary</SimplePageHeader>
      <DaSummaryTable items={daLayers.flatMap(toDaSummaryEntry)} />
    </div>
  )
}
