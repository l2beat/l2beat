import React from 'react'

import { ActiveIcon } from '../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../components/icons/symbols/ArchivedIcon'
import { IncludeLayer2sCheckbox } from '../../components/table/filters/checkboxes/IncludeLayer2sCheckbox'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import {
  getActiveBridgesTvlColumns,
  getArchivedBridgesTvlColumns,
} from '../../components/table/props/getBridgesTableColumns'
import { RowConfig, TableView } from '../../components/table/TableView'
import { Tabs } from '../../components/Tabs'
import { BridgesTvlViewEntry } from './types'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export function BridgesTvlView({ items }: BridgesTvlViewProps) {
  const rows: RowConfig<BridgesTvlViewEntry> = {
    getProps: getBridgesRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <IncludeLayer2sCheckbox className="mb-4" />

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
                columns={getActiveBridgesTvlColumns()}
                rows={rows}
                rerenderIndexesOn="#combined-bridges-checkbox"
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
                columns={getArchivedBridgesTvlColumns()}
                rows={rows}
                rerenderIndexesOn="#combined-bridges-checkbox"
              />
            ),
            icon: <ArchivedIcon />,
          },
        ]}
      />
    </section>
  )
}
