import React from 'react'

import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { getScalingRiskColumns } from '../../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../../components/table/TableView'
import { Tabs } from '../../../../components/Tabs'
import { ScalingRiskViewEntry } from './types'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingRiskView({ items }: ScalingRiskViewProps) {
  const columns = getScalingRiskColumns()
  const rows: RowConfig<ScalingRiskViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'risks'),
  }

  const activeProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const archivedProjects = items.filter((item) => item.isArchived)

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items} />
      <Tabs
        items={[
          {
            id: 'active',
            name: 'Active projects',
            shortName: 'Active',
            content: (
              <TableView items={activeProjects} columns={columns} rows={rows} />
            ),
            itemsCount: activeProjects.length,
            icon: <ActiveIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <TableView
                items={archivedProjects}
                columns={columns}
                rows={rows}
              />
            ),
            itemsCount: archivedProjects.length,
            icon: <ArchivedIcon />,
          },
        ]}
      />
      <ScalingLegend />
    </section>
  )
}
