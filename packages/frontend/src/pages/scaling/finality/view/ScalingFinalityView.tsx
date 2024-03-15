import React from 'react'

import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { getScalingFinalityColumnsConfig } from '../props/getScalingFinalityColumnsConfig'
import { ScalingFinalityViewEntry } from '../types'

export interface ScalingFinalityViewProps {
  items: ScalingFinalityViewEntry[]
}

export function ScalingFinalityView({ items }: ScalingFinalityViewProps) {
  const rows: RowConfig<ScalingFinalityViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'finality'),
  }
  const columnsConfig = getScalingFinalityColumnsConfig()

  return (
    <section>
      <TableView columnsConfig={columnsConfig} rows={rows} items={items} />
    </section>
  )
}
