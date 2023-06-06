import React from 'react'

import { ActiveIcon } from '../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../components/icons/symbols/UpcomingIcon'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import {
  getActiveScalingTvlColumns,
  getArchivedScalingTvlColumns,
  getUpcomingScalingTvlColumns,
} from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { Tabs } from '../../../components/Tabs'
import { ScalingTvlViewEntry } from '../types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  stagesEnabled: boolean
  upcomingEnabled?: boolean
}

export function ScalingTvlView({ items, stagesEnabled }: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: getScalingRowProps,
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
                columns={getActiveScalingTvlColumns(stagesEnabled)}
              />
            ),
            icon: <ActiveIcon />,
          },
          {
            id: 'upcoming',
            name: 'Upcoming projects',
            shortName: 'Upcoming',
            content: (
              <TableView
                items={items.filter((item) => item.isUpcoming)}
                rows={rows}
                columns={getUpcomingScalingTvlColumns()}
              />
            ),
            icon: <UpcomingIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <TableView
                items={items.filter((item) => item.isArchived)}
                rows={rows}
                columns={getArchivedScalingTvlColumns()}
              />
            ),
            icon: <ArchivedIcon />,
          },
        ]}
      />
      <ScalingLegend />
    </section>
  )
}
