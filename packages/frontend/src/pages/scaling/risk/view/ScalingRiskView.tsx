import React from 'react'

import { Tabs } from '../../../../components/Tabs'
import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { TableView } from '../../../../components/table/TableView'
import { ScalingFilters } from '../../../../components/table/filters/ScalingFilters'
import { getScalingRowProps } from '../../../../components/table/props/getScalingRowProps'
import { RowConfig } from '../../../../components/table/types'
import { getScalingRiskColumnsConfig } from '../props/getScalingRiskColumnsConfig'
import { ScalingRiskViewEntry } from '../types'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingRiskView({ items }: ScalingRiskViewProps) {
  const columns = getScalingRiskColumnsConfig()
  const rows: RowConfig<ScalingRiskViewEntry> = {
    getProps: (entry) => getScalingRowProps(entry, 'risks'),
  }

  const layer2sProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const archivedProjects = items.filter((item) => item.isArchived)

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <ScalingFilters items={items} />
      <Tabs
        items={[
          {
            id: 'layer2s',
            name: 'Layer 2 projects',
            shortName: 'Layer 2s',
            content: (
              <TableView
                items={layer2sProjects}
                columnsConfig={columns}
                rows={rows}
              />
            ),
            itemsCount: layer2sProjects.length,
            icon: <ActiveIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <TableView
                items={archivedProjects}
                columnsConfig={columns}
                rows={rows}
              />
            ),
            itemsCount: archivedProjects.length,
            icon: <ArchivedIcon />,
          },
        ]}
      />
    </section>
  )
}
