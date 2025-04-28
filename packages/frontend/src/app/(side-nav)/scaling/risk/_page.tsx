import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import type { ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ScalingRiskTables } from './_components/scaling-risk-tables'

interface Props {
  entries: TabbedScalingEntries<ScalingRiskEntry>
}

export function RiskPage({ entries }: Props) {
  return (
    <>
      <MainPageHeader>Risk Analysis</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingRiskTables {...entries} />
      </TableFilterContextProvider>
    </>
  )
}
