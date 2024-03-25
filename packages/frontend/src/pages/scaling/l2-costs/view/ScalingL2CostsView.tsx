import React from 'react'

import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingL2CostsColumnsConfig } from '../props/getScalingL2CostsColumnsConfig'
import { ScalingL2CostsViewEntry } from '../types'
import { L2CostsTimeRangeControls } from './L2CostsTimeRangeControls'
import { L2CostsUnitControls } from './L2CostsUnitControls'

export interface ScalingL2CostsViewProps {
  items: ScalingL2CostsViewEntry[]
}

export function ScalingL2CostsView({ items }: ScalingL2CostsViewProps) {
  const rows: RowConfig<ScalingL2CostsViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'l2-costs'),
  }
  const columnsConfig = getScalingL2CostsColumnsConfig()

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <div className="flex justify-between">
        <L2CostsUnitControls />
        <L2CostsTimeRangeControls />
      </div>
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
