import React from 'react'

import { ActiveIcon } from '../../../components/icons/symbols/ActiveIcon'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { getScalingDetailedTvlColumns } from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { Tabs } from '../../../components/Tabs'
import { DetailedTvlViewEntry } from '../types'

export interface DetailedTvlViewProps {
  items: DetailedTvlViewEntry[]
  upcomingEnabled?: boolean
}

export function DetailedTvlView({ items }: DetailedTvlViewProps) {
  const rows: RowConfig<DetailedTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'detailedTvl'),
  }

  return (
    <section className="mt-4 sm:mt-8">
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
