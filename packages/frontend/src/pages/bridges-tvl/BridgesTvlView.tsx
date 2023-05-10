import React from 'react'

import { ActiveIcon } from '../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../components/icons/symbols/ArchivedIcon'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import {
  getActiveBridgesTvlColumns,
  getArchivedBridgesTvlColumns,
  getCanonicalBridgesTvlColumns,
} from '../../components/table/props/getBridgesTableColumns'
import { RowConfig, TableView } from '../../components/table/TableView'
import { TabNavigation } from '../../components/TabNavigation'
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
      <TabNavigation
        tabs={[
          {
            id: 'active',
            name: 'Active projects',
            content: (
              <TableView
                items={items.filter(
                  (item) => item.type === 'bridge' && !item.isArchived,
                )}
                columns={getActiveBridgesTvlColumns()}
                rows={rows}
              />
            ),
            icon: <ActiveIcon />,
          },
          {
            id: 'canonical-bridges',
            name: 'Canonical bridges to Layer2s',
            content: (
              <TableView
                items={items.filter(
                  (item) => item.type === 'layer2' && !item.isArchived,
                )}
                columns={getCanonicalBridgesTvlColumns()}
                rows={rows}
              />
            ),
          },
          {
            id: 'archived',
            name: 'Archived projects',
            content: (
              <TableView
                items={items.filter(
                  (item) => item.type === 'bridge' && item.isArchived,
                )}
                columns={getArchivedBridgesTvlColumns()}
                rows={rows}
              />
            ),
            icon: <ArchivedIcon />,
          },
        ]}
      />
    </section>
  )
}
