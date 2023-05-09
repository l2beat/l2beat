import { ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { TVLBreakdownProps } from '../../components/TVLBreakdown'
import { TabNavigation } from '../../components/TabNavigation'
import { RowConfig, TableView } from '../../components/table/TableView'
import { getBridgesRowProps } from '../../components/table/props/getBridgesRowProps'
import { getBridgesTvlColumns } from '../../components/table/props/getBridgesTableColumns'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  type: 'bridge' | 'layer2'
  name: string
  slug: string
  warning?: string
  isArchived?: boolean
  isUpcoming?: boolean
  isVerified?: boolean
  tvl?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  bridgesMarketShare?: string
  combinedMarketShare?: string
  validatedBy?: ProjectRiskViewEntry
  category: string
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
                columns={getBridgesTvlColumns('active')}
                rows={rows}
              />
            ),
          },
          {
            id: 'canonical-bridges',
            name: 'Canonical bridges to Layer2s',
            content: (
              <TableView
                items={items.filter(
                  (item) => item.type === 'layer2' && !item.isArchived,
                )}
                columns={getBridgesTvlColumns('canonical-bridges')}
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
                columns={getBridgesTvlColumns('archived')}
                rows={rows}
              />
            ),
          },
        ]}
      />
    </section>
  )
}
