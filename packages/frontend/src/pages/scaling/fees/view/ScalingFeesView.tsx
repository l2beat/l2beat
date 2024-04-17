import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingFeesColumnsConfig } from '../props/getScalingFeesColumnsConfig'
import { ScalingFeesViewEntry } from '../types'
import { FeesTypeControls } from './FeesTypeControls'

export interface ScalingFeesViewProps {
  items: ScalingFeesViewEntry[]
}

export function ScalingFeesView({ items }: ScalingFeesViewProps) {
  const rows: RowConfig<ScalingFeesViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'costs'),
  }
  const columnsConfig = getScalingFeesColumnsConfig()

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <ScalingFilters items={items} hideRollupsOnlyCheckbox />
        <FeesTypeControls />
      </div>

      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
