import React from 'react'

import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingCostsColumnsConfig } from '../props/getScalingCostsColumnsConfig'
import { ScalingCostsViewEntry as ScalingCostsViewEntry } from '../types'
import { CostsTimeRangeControls } from './CostsTimeRangeControls'
import { CostsUnitControls } from './CostsUnitControls'

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
      <div className="flex justify-between">
        <CostsUnitControls />
        <CostsTimeRangeControls />
      </div>
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
