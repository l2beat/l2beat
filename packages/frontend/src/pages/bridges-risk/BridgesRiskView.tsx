import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { TabNavigation } from '../../components/TabNavigation'
import { ActiveIcon } from '../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../components/icons/symbols/ArchivedIcon'
import { RowConfig, TableView } from '../../components/table/TableView'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import { getBridgesRiskColumns } from '../../components/table/props/getBridgesTableColumns'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: 'layer2' | 'bridge'
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  category: string
  destination: ProjectRiskViewEntry
  validatedBy?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
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
