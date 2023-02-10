import { Layer2, Layer2Rating } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { IndexCell } from '../../../components/table/IndexCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { RatingCell } from '../../../components/table/RatingCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'
import { TechnologyCell } from '../../../components/table/TechnologyCell'
import {
  TVLBreakdown,
  TVLBreakdownProps,
} from '../../../components/TVLBreakdown'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  ratingEnabled: boolean
}

export interface ScalingTvlViewEntry {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
  warning?: string
  isVerified?: boolean
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  marketShare: string
  purpose: string
  technology: string
  ratingEntry?: Layer2Rating
}

export function ScalingTvlView({ items, ratingEnabled }: ScalingTvlViewProps) {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      minimalWidth: true,
      alignCenter: true,
      getValue: (entry, index) => {
        return <IndexCell entry={entry} index={index + 1} />
      },
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'TVL',
      tooltip: 'Total value locked in escrow contracts on Ethereum.',
      alignRight: true,
      getValue: (project) => <NumberCell>{project.tvl}</NumberCell>,
    },
    {
      name: '7d Change',
      tooltip: 'Change in the total value locked as compared to a week ago.',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.sevenDayChange}</NumberCell>
      ),
    },
    ...(ratingEnabled
      ? [
          {
            name: 'Rating',
            tooltip: 'Rating of this Layer 2 based on its features.',
            alignCenter: true as const,
            getValue: (project: ScalingTvlViewEntry) => (
              <RatingCell item={project.ratingEntry} />
            ),
          },
        ]
      : []),
    {
      name: 'Breakdown',
      tooltip:
        'Composition of the total value locked broken down by token type.',
      getValue: (project) => <TVLBreakdown {...project.tvlBreakdown} />,
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      getValue: (project) => <NumberCell>{project.marketShare}</NumberCell>,
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
    {
      name: 'Technology',
      tooltip:
        'Type of this Layer 2. Determines data availability and proof system used.',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell>{project.technology}</TechnologyCell>
      ),
    },
  ]

  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: getScalingRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend showTokenWarnings />
    </section>
  )
}
