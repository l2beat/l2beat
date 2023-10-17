import React from 'react'

import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingDetailedTvlColumns } from '../../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../../components/table/TableView'
import { ScalingDetailedTvlViewEntry } from '../types'

export interface ScalingDetailedTvlViewProps {
  items: ScalingDetailedTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingDetailedTvlView({ items }: ScalingDetailedTvlViewProps) {
  const rows: RowConfig<ScalingDetailedTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'detailedTvl'),
  }
  const itemsToShow = items.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={itemsToShow} />
      <TableView
        items={itemsToShow}
        rows={rows}
        columns={getScalingDetailedTvlColumns()}
      />
      <ScalingLegend />
    </section>
  )
}
