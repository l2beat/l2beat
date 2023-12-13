import React from 'react'

import { Layer3sIcon } from '../../../../components/icons'
import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../../components/icons/symbols/UpcomingIcon'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import {
  getActiveScalingTvlColumnsConfig,
  getArchivedScalingTvlColumnsConfig,
  getLayer3sScalingTvlColumnsConfig,
  getUpcomingScalingTvlColumnsConfig,
} from '../../../../components/table/props/getScalingTableColumnsConfig'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { Tabs } from '../../../../components/Tabs'
import { ScalingTvlViewEntry } from '../types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
}

export function ScalingTvlView({ items }: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'summary'),
  }

  const activeProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming && !item.isLayer3,
  )
  const upcomingProjects = items.filter((item) => item.isUpcoming)
  const archivedProjects = items.filter((item) => item.isArchived)
  const layer3sProjects = items.filter(
    (item) => item.isLayer3 && !item.isArchived && !item.isUpcoming,
  )

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
              <>
                <TableView
                  items={activeProjects}
                  rows={rows}
                  columnsConfig={getActiveScalingTvlColumnsConfig()}
                />
                <ScalingLegend />
              </>
            ),
            itemsCount: activeProjects.length,
            icon: <ActiveIcon />,
          },
          {
            id: 'upcoming',
            name: 'Upcoming projects',
            shortName: 'Upcoming',
            content: (
              <>
                <TableView
                  items={upcomingProjects}
                  rows={rows}
                  columnsConfig={getUpcomingScalingTvlColumnsConfig()}
                />
                <ScalingLegend />
              </>
            ),
            itemsCount: upcomingProjects.length,
            icon: <UpcomingIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <>
                <TableView
                  items={archivedProjects}
                  rows={rows}
                  columnsConfig={getArchivedScalingTvlColumnsConfig()}
                />
                <ScalingLegend />
              </>
            ),
            itemsCount: archivedProjects.length,
            icon: <ArchivedIcon />,
          },
          {
            id: 'layer3s',
            name: 'Layer 3 projects',
            shortName: 'Layer 3s',
            content: (
              <TableView
                items={layer3sProjects}
                rows={rows}
                columnsConfig={getLayer3sScalingTvlColumnsConfig()}
              />
            ),
            itemsCount: layer3sProjects.length,
            icon: <Layer3sIcon />,
          },
        ]}
      />
    </section>
  )
}
