import { Layer2, Layer2Rating } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { ScalingTableFilters } from '../../../components/table/filters/ScalingTableFilters'
import { IndexCell } from '../../../components/table/IndexCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { RatingCell } from '../../../components/table/RatingCell'
import { RosetteCell } from '../../../components/table/RosetteCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'
import { TechnologyCell } from '../../../components/table/TechnologyCell'
import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { RiskValues } from '../../../utils/risks/types'

export interface ScalingTvlViewProps {
  items: ScalingTvlViewEntry[]
  ratingEnabled: boolean
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
  ratingEntry?: Layer2Rating
}

export function ScalingTvlView({
  items,
  ratingEnabled,
  upcomingEnabled,
}: ScalingTvlViewProps) {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'pl-4',
      getValue: (entry, index) => (
        <IndexCell entry={entry} className="pl-4" index={index + 1} />
      ),
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      minimalWidth: true,
      alignCenter: true,
      getValue: (project) => <RosetteCell riskValues={project.riskValues} />,
    },
    {
      name: 'Technology',
      tooltip:
        'Type of this Layer 2. Determines data availability and proof system used.',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell provider={project.provider}>
          {project.technology}
        </TechnologyCell>
      ),
    },
    ...(ratingEnabled
      ? [
          {
            name: 'Rating',
            tooltip: 'Rating of this Layer 2 based on its features.',
            alignCenter: true as const,
            getValue: (project: ScalingTvlViewEntry) =>
              !project.isArchived &&
              !project.isUpcoming && <RatingCell item={project.ratingEntry} />,
          },
        ]
      : []),
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
    {
      name: 'TVL',
      tooltip: 'Total value locked in escrow contracts on Ethereum.',
      alignRight: true,
      noPaddingRight: true,
      headClassName: '-translate-x-[72px]',
      getValue: (project) =>
        !project.isUpcoming && (
          <>
            <NumberCell className="font-bold">{project.tvl}</NumberCell>
            {!project.isArchived ? (
              <NumberCell
                signed
                className="ml-1 w-[72px] !text-base font-medium "
              >
                {project.sevenDayChange}
              </NumberCell>
            ) : (
              <span className="w-[72px]" />
            )}
          </>
        ),
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      minimalWidth: true,
      headClassName: 'pr-4',
      getValue: (project) =>
        !project.isArchived &&
        !project.isUpcoming &&
        project.tvlBreakdown && (
          <NumberCell className="pr-4">{project.marketShare}</NumberCell>
        ),
    },
  ]

  const rows: RowConfig<ScalingTvlViewEntry> = {
    getProps: getScalingRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <ScalingTableFilters className="mb-4" upcomingEnabled={upcomingEnabled} />
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend />
    </section>
  )
}
