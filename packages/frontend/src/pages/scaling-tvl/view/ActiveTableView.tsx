import React from 'react'
import { IndexCell } from '../../../components/table/IndexCell'
import { MaturityCell } from '../../../components/table/MaturityCell'
import { NumberCell } from '../../../components/table/NumberCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { RosetteCell } from '../../../components/table/RosetteCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'
import { TechnologyCell } from '../../../components/table/TechnologyCell'
import { ScalingTvlViewEntry } from './ScalingTvlView'

interface Props {
  items: ScalingTvlViewEntry[]
  rows: RowConfig<ScalingTvlViewEntry>
  maturityEnabled: boolean
}

export function ActiveTableView({ items, rows, maturityEnabled }: Props) {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
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
      getValue: (project) =>
        !project.isUpcoming && <RosetteCell riskValues={project.riskValues} />,
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
    ...(maturityEnabled
      ? [
          {
            name: 'Maturity',
            tooltip: 'Maturity of this Layer 2 based on its features.',
            alignCenter: true as const,
            getValue: (project: ScalingTvlViewEntry) =>
              !project.isArchived &&
              !project.isUpcoming && (
                <MaturityCell item={project.maturityEntry} />
              ),
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

  return <TableView items={items} columns={columns} rows={rows} />
}
