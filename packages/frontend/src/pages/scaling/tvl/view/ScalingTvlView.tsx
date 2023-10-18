import React from 'react'

import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../../components/icons/symbols/UpcomingIcon'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import {
  getActiveScalingTvlColumns,
  getArchivedScalingTvlColumns,
  getUpcomingScalingTvlColumns,
} from '../../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../../components/table/TableView'
import { Tabs } from '../../../../components/Tabs'
import { ScalingTvlViewEntry } from '../types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  detailedTvlEnabled: boolean
}

export function ScalingTvlView({
  items,
  detailedTvlEnabled,
}: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'summary'),
  }

  const activeProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const upcomingProjects = items.filter((item) => item.isUpcoming)
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
              <TableView
                items={activeProjects}
                rows={rows}
                columns={getActiveScalingTvlColumns(detailedTvlEnabled)}
              />
            ),
            itemsCount: activeProjects.length,
            icon: <ActiveIcon />,
          },
          {
            id: 'upcoming',
            name: 'Upcoming projects',
            shortName: 'Upcoming',
            content: (
              <TableView
                items={upcomingProjects}
                rows={rows}
                columns={getUpcomingScalingTvlColumns()}
              />
            ),
            itemsCount: upcomingProjects.length,
            icon: <UpcomingIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <TableView
                items={archivedProjects}
                rows={rows}
                columns={getArchivedScalingTvlColumns(detailedTvlEnabled)}
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
