import { Layer2 } from '@l2beat/config'
import React from 'react'

import { PercentChange } from '../../../components'
import { ProjectLink } from '../../../components/ProjectLink'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { ColumnConfig, TableView } from '../../../components/TableView'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../components/TVLBreakdown'
import { FinancialCell } from './FinancialCell'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
}

export interface ScalingTvlViewEntry {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  marketShare: string
  purpose: string
  technology: string
}

export function ScalingTvlView({ items }: ScalingTvlViewProps) {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: 'No.',
      getValue: (entry, index) => `${index + 1}.`,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectLink type="layer2" project={project} />,
    },
    {
      name: 'TVL',
      alignRight: true,
      getValue: (project) => project.tvl,
    },
    {
      name: 'Breakdown',
      alignRight: true,
      getValue: (project) => <TVLBreakdown {...project.tvlBreakdown} />,
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (project) => <PercentChange value={project.sevenDayChange} />,
    },
    {
      name: 'Market share',
      alignRight: true,
      getValue: (project) => project.marketShare,
    },
    {
      name: 'Purpose',
      alignRight: true,
      getValue: (project) => <FinancialCell>{project.purpose}</FinancialCell>,
    },
    {
      name: 'Technology',
      shortName: 'Tech',
      alignRight: true,
      getValue: (project) => (
        <FinancialCell
          className={
            project.technology === 'ZK Rollup' ||
            project.technology === 'Optimistic Rollup'
              ? 'rollup'
              : undefined
          }
        >
          {project.technology}
        </FinancialCell>
      ),
    },
  ]

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} />
      <ScalingLegend showTokenWarnings />
    </section>
  )
}
