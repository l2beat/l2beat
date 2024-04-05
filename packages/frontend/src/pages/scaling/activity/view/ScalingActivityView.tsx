import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingActivityColumnsConfig } from '../props/getScalingActivityColumnsConfig'
import { ActivityViewEntry } from '../types'
export interface ScalingActivityViewProps {
  items: ActivityViewEntry[]
}

export function ScalingActivityView({ items }: ScalingActivityViewProps) {
  const columns = getScalingActivityColumnsConfig()
  const rows: RowConfig<ActivityViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'activity'),
  }

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items.filter((i) => i.slug !== 'ethereum')} />
      <TableView items={items} columnsConfig={columns} rows={rows} />
    </section>
  )
}
