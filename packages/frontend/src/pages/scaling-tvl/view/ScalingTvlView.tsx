import { Layer2 } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { ColumnConfig, TableView } from '../../../components/table/TableView'
import { TechnologyCell } from '../../../components/table/TechnologyCell'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../components/TVLBreakdown'

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
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => index + 1,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'TVL',
      alignRight: true,
      getValue: (project) => <NumberCell>{project.tvl}</NumberCell>,
    },
    {
      name: 'Breakdown',
      getValue: (project) => <TVLBreakdown {...project.tvlBreakdown} />,
    },
    {
      name: '7d Change',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.sevenDayChange}</NumberCell>
      ),
    },
    {
      name: 'Market share',
      alignRight: true,
      getValue: (project) => <NumberCell>{project.marketShare}</NumberCell>,
    },
    {
      name: 'Purpose',
      getValue: (project) => project.purpose,
    },
    {
      name: 'Technology',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell>{project.technology}</TechnologyCell>
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
