import { Layer2, Layer2Maturity } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { TabNavigation } from '../../../components/TabNavigation'
import { ActiveIcon } from '../../../components/icons/symbols/ActiveIcon'
import { ArchivedIcon } from '../../../components/icons/symbols/ArchivedIcon'
import { UpcomingIcon } from '../../../components/icons/symbols/UpcomingIcon'
import { RowConfig, TableView } from '../../../components/table/TableView'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import {
  getActiveScalingTvlColumns,
  getArchivedScalingTvlColumns,
  getUpcomingScalingTvlColumns,
} from '../../../components/table/props/getScalingTableColumns'
import { RiskValues } from '../../../utils/risks/types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  maturityEnabled: boolean
  upcomingEnabled?: boolean
}

export interface ScalingTvlViewEntry {
  name: string
  slug: string
  riskValues: RiskValues
  provider?: Layer2['technology']['provider']
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
  tvl?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  marketShare?: string
  purpose: string
  technology: string
  maturityEntry?: Layer2Maturity
}

export function ScalingTvlView({
  items,
  maturityEnabled,
}: ScalingTvlViewProps) {
  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: getScalingRowProps,
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
                  (item) => !item.isArchived && !item.isUpcoming,
                )}
                rows={rows}
                columns={getActiveScalingTvlColumns(maturityEnabled)}
              />
            ),
            icon: <ActiveIcon />,
          },
          {
            id: 'upcoming',
            name: 'Upcoming projects',
            content: (
              <TableView
                items={items.filter((item) => item.isUpcoming)}
                rows={rows}
                columns={getUpcomingScalingTvlColumns()}
              />
            ),
            icon: <UpcomingIcon />,
          },
          {
            id: 'archived',
            name: 'Archived projects',
            content: (
              <TableView
                items={items.filter((item) => item.isArchived)}
                rows={rows}
                columns={getArchivedScalingTvlColumns()}
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
