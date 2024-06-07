import React from 'react'

import { TableView } from '../../../../components/table/TableView'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { ExcludeAssociatedTokensCheckbox } from '../../../../components/table/filters/checkboxes/ExcludeAssociatedTokensCheckbox'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
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
      <div className="flex flex-col-reverse gap-x-4 gap-y-2 lg:flex-row">
        <ScalingFilters items={items} />
        <ExcludeAssociatedTokensCheckbox className="lg:ml-auto" />
      </div>
      <TableView
        items={items}
        rows={rows}
        columnsConfig={getScalingTvlColumnsConfig()}
      />
    </section>
  )
}
