import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { getScalingDetailedTvlColumns } from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { ScalingDetailedTvlViewEntry } from '../types'

export interface ScalingDetailedTvlViewProps {
  items: ScalingDetailedTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingDetailedTvlView({ items }: ScalingDetailedTvlViewProps) {
  const rows: RowConfig<ScalingDetailedTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'detailedTvl'),
  }

  return (
    <section className="mt-4 sm:mt-8">
      <TableView
        items={items.filter((item) => !item.isArchived && !item.isUpcoming)}
        rows={rows}
        columns={getScalingDetailedTvlColumns()}
        rerenderIndexesOn="#rollups-only-checkbox"
      />
      <ScalingLegend />
    </section>
  )
}
