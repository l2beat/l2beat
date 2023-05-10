import React from 'react'

import { ActiveIcon } from '../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../components/icons/symbols/ArchivedIcon'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import { getBridgesRiskColumns } from '../../components/table/props/getBridgesTableColumns'
import { RowConfig, TableView } from '../../components/table/TableView'
import { TabNavigation } from '../../components/TabNavigation'
import { BridgesRiskViewEntry } from './types'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export function BridgesRiskView({ items }: BridgesRiskViewProps) {
  const columns = getBridgesRiskColumns()

  const rows: RowConfig<BridgesRiskViewEntry> = {
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
                columns={columns}
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
                columns={columns}
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
                columns={columns}
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
