import React from 'react'

import { Layer3sIcon } from '../../../../components/icons'
import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../../components/icons/symbols/UpcomingIcon'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import {
  getActiveScalingSummaryColumnsConfig,
  getArchivedScalingSummaryColumnsConfig,
  getLayer3sScalingSummaryColumnsConfig,
  getUpcomingScalingSummaryColumnsConfig,
} from '../../../../components/table/props/getScalingTableColumnsConfig'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { Tabs } from '../../../../components/Tabs'
import {
  ScalingSummaryViewEntry,
  ScalingSummaryViewEntryLayer2,
  ScalingSummaryViewEntryLayer3,
} from '../types'

export interface ScalingSummaryViewProps {
  items: ScalingSummaryViewEntry[]
}

export function ScalingSummaryView({ items }: ScalingSummaryViewProps) {
  const rows: RowConfig<ScalingSummaryViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'summary'),
  }

  const activeProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming && item.type === 'layer2',
  ) as ScalingSummaryViewEntryLayer2[]
  const upcomingProjects = items.filter(
    (item) => item.isUpcoming,
  ) as ScalingSummaryViewEntryLayer3[]
  const archivedProjects = items.filter(
    (item) => item.isArchived && item.type === 'layer2',
  ) as ScalingSummaryViewEntryLayer2[]
  const layer3sProjects = items.filter(
    (item) => item.type === 'layer3' && !item.isArchived && !item.isUpcoming,
  ) as ScalingSummaryViewEntryLayer3[]

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
                  columnsConfig={getActiveScalingSummaryColumnsConfig()}
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
                  columnsConfig={getUpcomingScalingSummaryColumnsConfig()}
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
                  columnsConfig={getArchivedScalingSummaryColumnsConfig()}
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
                columnsConfig={getLayer3sScalingSummaryColumnsConfig()}
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
