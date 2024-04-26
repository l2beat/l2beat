import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingTvlColumnsConfig } from '../props/getScalingTvlColumnsConfig'
import { ScalingTvlViewEntry } from '../types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingTvlView({ items }: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'tvl'),
  }

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items} />
      <TableView
        items={items}
        rows={rows}
        columnsConfig={getScalingTvlColumnsConfig()}
      />
    </section>
  )
}
