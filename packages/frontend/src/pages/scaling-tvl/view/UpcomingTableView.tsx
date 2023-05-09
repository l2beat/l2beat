import React from 'react'
import { IndexCell } from '../../../components/table/IndexCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
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
}

export function UpcomingTableView({ items, rows }: Props) {
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
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
  ]

  return <TableView items={items} columns={columns} rows={rows} />
}
