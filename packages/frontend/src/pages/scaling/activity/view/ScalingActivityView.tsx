import React from 'react'

import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingActivityFilters } from '../../../../components/table/filters/ScalingActivityFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingActivityColumns } from '../../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../../components/table/TableView'
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
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingActivityFilters items={items} />
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
