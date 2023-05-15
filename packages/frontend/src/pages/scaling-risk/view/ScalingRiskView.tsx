import React from 'react'

import { ActiveIcon } from '../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../components/icons/symbols/ArchivedIcon'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { getScalingRiskColumns } from '../../../components/table/props/getScalingTableColumns'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { Tabs } from '../../../components/Tabs'
import { ScalingRiskViewEntry } from './types'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
  upcomingEnabled?: boolean
}

export function ScalingRiskView({ items }: ScalingRiskViewProps) {
  const columns = getScalingRiskColumns()
  const rows: RowConfig<ScalingRiskViewEntry> = {
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
                columns={columns}
                rows={rows}
              />
            ),
            icon: <ActiveIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            shortName: 'Archived',
            content: (
              <TableView
                items={items.filter((item) => item.isArchived)}
                columns={columns}
                rows={rows}
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
