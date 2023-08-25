import React from 'react'

import { ActiveIcon } from '../../../components/icons/symbols/ActiveIcon'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { RollupsOnlyCheckbox } from '../../../components/table/filters/checkboxes/RollupsOnlyCheckbox'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { getScalingDetailedTvlColumns } from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { Tabs } from '../../../components/Tabs'
import { ScalingDetailedTvlViewEntry } from '../types'

export interface ScalingDetailedTvlViewProps {
  items: ScalingDetailedTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingDetailedTvlView({ items }: ScalingDetailedTvlViewProps) {
  const rows: RowConfig<ScalingDetailedTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'detailedTvl'),
  }

  return (
    <section className="mt-4 sm:mt-8">
      <RollupsOnlyCheckbox className="mb-4" />
      <Tabs
        items={[
          {
            id: 'active',
            name: 'Active projects',
            shortName: 'Active',
            content: (
              <TableView
                items={items.filter(
                  (item) => !item.isArchived && !item.isUpcoming,
                )}
                rows={rows}
                columns={getScalingDetailedTvlColumns()}
                rerenderIndexesOn="#rollups-only-checkbox"
              />
            ),
            icon: <ActiveIcon />,
          },
        ]}
      />
      <ScalingLegend />
    </section>
  )
}
