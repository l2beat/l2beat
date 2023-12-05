import React from 'react'

import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingLivenessColumnsConfig } from '../../../../components/table/props/getScalingTableColumnsConfig'
import { RowConfig, TableView } from '../../../../components/table/TableView'
import {
  ScalingLivenessViewEntry,
  ScalingLivenessViewSortingOrder,
} from '../types'
import { LivenessTimeRangeControls } from './LivenessTimeRangeControls'

export interface ScalingLivenessViewProps {
  items: ScalingLivenessViewEntry[]
  sortingOrder: ScalingLivenessViewSortingOrder
}

export function ScalingLivenessView({
  items,
  sortingOrder,
}: ScalingLivenessViewProps) {
  const rows: RowConfig<ScalingLivenessViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'liveness'),
  }
  const columnsConfig = getScalingLivenessColumnsConfig(sortingOrder)

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <ScalingFilters items={items} hideRollupsOnlyCheckbox />
        <LivenessTimeRangeControls />
      </div>
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
      <ScalingLegend />
    </section>
  )
}
