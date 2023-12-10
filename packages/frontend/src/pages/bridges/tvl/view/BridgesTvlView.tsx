import React from 'react'

import { ActiveIcon } from '../../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../../components/icons/symbols/ArchivedIcon'
import { BridgesFilters } from '../../../../components/table/filters/BridgesFilters'
import { getBridgesRowProps } from '../../../../components/table/props/getBridgesRowProps'
import {
  getActiveBridgesTvlColumnsConfig,
  getArchivedBridgesTvlColumnsConfig,
} from '../../../../components/table/props/getBridgesTableColumnsConfig'
import { TableView } from '../../../../components/table/TableView'
import { RowConfig } from '../../../../components/table/types'
import { Tabs } from '../../../../components/Tabs'
import { BridgesTvlViewEntry } from '../types'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export function BridgesTvlView({ items }: BridgesTvlViewProps) {
  const rows: RowConfig<BridgesTvlViewEntry> = {
    getProps: getBridgesRowProps,
  }

  const activeProjects = items.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const archivedProjects = items.filter((item) => item.isArchived)

  return (
    <section className="mt-4 flex flex-col gap-y-2 sm:mt-8">
      <BridgesFilters items={items} />
      <Tabs
        items={[
          {
            id: 'active',
            name: 'Active projects',
            shortName: 'Active',
            content: (
              <TableView
                items={activeProjects}
                columnsConfig={getActiveBridgesTvlColumnsConfig()}
                rows={rows}
                rerenderOnLoad
              />
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
                columnsConfig={getArchivedBridgesTvlColumnsConfig()}
                rows={rows}
                rerenderOnLoad
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
