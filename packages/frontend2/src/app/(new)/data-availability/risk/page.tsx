import { daLayers } from '@l2beat/config'
import { SimplePageHeader } from '~/app/_components/simple-page-header'
import { DaRiskTable } from './_components/table/da-risk-table'
import { toDaRiskEntry } from './_utils/da-risk-entry'

export default function Page() {
  return (
    <div>
      <SimplePageHeader className="mb-4 sm:mb-8">
        Risk Analysis
      </SimplePageHeader>
      <DaRiskTable items={daLayers.flatMap(toDaRiskEntry)} />
    </div>
  )
}
