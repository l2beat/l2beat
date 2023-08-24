import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { RollupsOnlyCheckbox } from '../../../components/table/filters/checkboxes/RollupsOnlyCheckbox'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { getScalingActivityColumns } from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { ActivityViewEntry } from './types'
export interface ScalingActivityViewProps {
  items: ActivityViewEntry[]
}

export function ScalingActivityView({ items }: ScalingActivityViewProps) {
  const columns = getScalingActivityColumns()
  const rows: RowConfig<ActivityViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'activity'),
  }

  return (
    <section className="mt-4 sm:mt-8">
      <RollupsOnlyCheckbox className="mb-4" />
      <TableView
        items={items}
        columns={columns}
        rows={rows}
        rerenderIndexesOn="#rollups-only-checkbox"
      />
      <ScalingLegend />
    </section>
  )
}
