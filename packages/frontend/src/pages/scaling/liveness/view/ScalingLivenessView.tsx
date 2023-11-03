import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingLivenessColumnsConfig } from '../../../../components/table/props/getScalingTableColumnsConfig'
import { RowConfig, TableView } from '../../../../components/table/TableView'
import { ScalingLivenessViewEntry } from '../types'

export interface ScalingLivenessViewProps {
  items: ScalingLivenessViewEntry[]
}

export function ScalingLivenessView({ items }: ScalingLivenessViewProps) {
  const rows: RowConfig<ScalingLivenessViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'liveness'),
  }
  const columnsConfig = getScalingLivenessColumnsConfig()

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items} />
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
