import { Layer2, Layer2Maturity } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { TabNavigation } from '../../../components/TabNavigation'
import { RowConfig } from '../../../components/table/TableView'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { RiskValues } from '../../../utils/risks/types'
import { ActiveTableView } from './ActiveTableView'
import { ArchivedTableView } from './ArchivedTableView'
import { UpcomingTableView } from './UpcomingTableView'

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
            name: 'Active projects',
            content: (
              <ActiveTableView
                items={items.filter(
                  (item) => !item.isArchived && !item.isUpcoming,
                )}
                rows={rows}
                maturityEnabled={maturityEnabled}
              />
            ),
          },
          {
            name: 'Upcoming projects',
            content: (
              <UpcomingTableView
                items={items.filter((item) => item.isUpcoming)}
                rows={rows}
              />
            ),
          },
          {
            name: 'Archived projects',
            content: (
              <ArchivedTableView
                items={items.filter((item) => item.isArchived)}
                rows={rows}
              />
            ),
          },
        ]}
      />
      <ScalingLegend />
    </section>
  )
}
