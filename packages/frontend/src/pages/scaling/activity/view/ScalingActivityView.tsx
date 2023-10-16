import React from 'react'

import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
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
      <ScalingFilters items={items.filter((i) => i.slug !== 'ethereum')} />
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend />
    </section>
  )
}
