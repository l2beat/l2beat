import React from 'react'
import { ScalingLegend } from '../../../../components/ScalingLegend'
import { Tabs } from '../../../../components/Tabs'
import { Layer3sIcon } from '../../../../components/icons'
import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../../components/icons/symbols/UpcomingIcon'
import { TableView } from '../../../../components/table/TableView'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { ExcludeAssociatedTokensCheckbox } from '../../../../components/table/filters/checkboxes/ExcludeAssociatedTokensCheckbox'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { RowConfig } from '../../../../components/table/types'
import {
  getArchivedScalingSummaryColumnsConfig,
  getLayer2sScalingSummaryColumnsConfig,
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
  layer3sTvl: boolean
}

export function ScalingSummaryView({
  layer2s,
  layer3s,
  layer3sTvl,
}: ScalingSummaryViewProps) {
  const rows: RowConfig<ScalingSummaryViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'summary'),
  }

  const layer2sProjects = layer2s.filter(
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
      <div className="flex flex-col-reverse gap-x-4 gap-y-2 lg:flex-row">
        <ScalingFilters items={[...layer2s, ...layer3s]} />
        <ExcludeAssociatedTokensCheckbox className="lg:ml-auto" />
      </div>
      <Tabs
        items={[
          {
            id: 'layer2s',
            name: 'Layer 2 projects',
            shortName: 'Layer 2s',
            content: (
              <>
                <TableView
                  items={layer2sProjects}
                  rows={rows}
                  columnsConfig={getLayer2sScalingSummaryColumnsConfig()}
                />
                <ScalingLegend />
              </>
            ),
            itemsCount: layer2sProjects.length,
            icon: <ActiveIcon />,
          },
          {
            id: 'layer3s',
            name: 'Layer 3 projects',
            shortName: 'Layer 3s',
            content: (
              <TableView
                items={layer3sProjects}
                rows={rows}
                columnsConfig={getLayer3sScalingSummaryColumnsConfig(
                  layer3sTvl,
                )}
              />
            ),
            itemsCount: layer3sProjects.length,
            icon: <Layer3sIcon />,
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
        ]}
      />
    </section>
  )
}
