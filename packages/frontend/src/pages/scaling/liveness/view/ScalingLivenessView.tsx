import React from 'react'

import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingLivenessColumnsConfig } from '../../../../components/table/props/getScalingTableColumnsConfig'
import { TableView } from '../../../../components/table/TableView'
import { ScalingLivenessViewEntry } from '../types'

export interface ScalingLivenessViewProps {
  items: ScalingLivenessViewEntry[]
}

export function ScalingLivenessView({ items }: ScalingLivenessViewProps) {
  const columns = getScalingLivenessColumnsConfig()

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items} />
      <TableView columnsConfig={columns} items={items} />
    </section>
  )
}
