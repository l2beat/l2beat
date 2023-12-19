import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingTvlColumnsConfig } from '../../../../components/table/props/getScalingTableColumnsConfig'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { ScalingTvlViewEntry } from '../types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingTvlView({ items }: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'tvl'),
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
        columnsConfig={getScalingTvlColumnsConfig()}
      />
    </section>
  )
}
