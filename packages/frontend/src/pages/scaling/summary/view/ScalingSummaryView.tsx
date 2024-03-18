import React from 'react'

import { Layer3sIcon } from '../../../../components/icons'
import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../../components/icons/symbols/UpcomingIcon'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { Tabs } from '../../../../components/Tabs'
import {
  getActiveScalingSummaryColumnsConfig,
  getArchivedScalingSummaryColumnsConfig,
  getLayer3sScalingSummaryColumnsConfig,
  getUpcomingScalingSummaryColumnsConfig,
} from '../props/getScalingSummaryColumnsConfig'
import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
  ScalingSummaryViewEntry,
} from '../types'

export interface ScalingSummaryViewProps {
  layer2s: ScalingL2SummaryViewEntry[]
  layer3s: ScalingL3SummaryViewEntry[]
}

export function ScalingSummaryView({
  layer2s,
  layer3s,
}: ScalingSummaryViewProps) {
  const rows: RowConfig<ScalingSummaryViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'summary'),
  }

  const activeProjects = layer2s.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const upcomingProjects = [...layer2s, ...layer3s].filter(
    (item) => item.isUpcoming,
  )
  const archivedProjects = layer2s.filter((item) => item.isArchived)
  const layer3sProjects = layer3s.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={[...layer2s, ...layer3s]} />
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
