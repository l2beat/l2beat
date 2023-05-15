import React from 'react'

import { ActiveIcon } from '../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../components/icons/symbols/ArchivedIcon'
import { IncludeLayer2sCheckbox } from '../../components/table/filters/checkboxes/IncludeLayer2sCheckbox'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import { getBridgesRiskColumns } from '../../components/table/props/getBridgesTableColumns'
import { RowConfig, TableView } from '../../components/table/TableView'
import { Tabs } from '../../components/Tabs'
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
      <IncludeLayer2sCheckbox className="mb-4" />
      <Tabs
        items={[
          {
            id: 'active',
            name: 'Active projects',
            shortName: 'Active',
            content: (
              <TableView
                items={items.filter((item) => !item.isArchived)}
                columns={columns}
                rows={rows}
                rerenderIndexesOn="combined-bridges-checkbox"
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
                rerenderIndexesOn="combined-bridges-checkbox"
              />
            ),
            icon: <ArchivedIcon />,
          },
        ]}
      />
    </section>
  )
}
