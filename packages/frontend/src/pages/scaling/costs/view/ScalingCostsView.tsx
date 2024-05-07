import React from 'react'

import { TableView } from '../../../../components/table/TableView'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { RowConfig } from '../../../../components/table/types'
import { getScalingCostsColumnsConfig } from '../props/getScalingCostsColumnsConfig'
import { ScalingCostsViewEntry as ScalingCostsViewEntry } from '../types'
import { CostsTypeControls } from './CostsTypeControls'

export interface ScalingCostsViewProps {
  items: ScalingCostsViewEntry[]
}

export function ScalingCostsView({ items }: ScalingCostsViewProps) {
  const rows: RowConfig<ScalingCostsViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'costs'),
  }
  const columnsConfig = getScalingCostsColumnsConfig()

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <ScalingFilters items={items} hideRollupsOnlyCheckbox />
        <CostsTypeControls />
      </div>

      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
