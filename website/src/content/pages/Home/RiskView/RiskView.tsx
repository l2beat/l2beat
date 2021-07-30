import { ProjectLink } from '../ProjectLink'
import { RiskViewEntry } from '../props/getRiskViewEntry'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

interface Props {
  items: RiskViewEntry[]
}

export function RiskView({ items }: Props) {
  const columns: Column<RiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (project) => <ProjectLink project={project} />,
    },
    {
      name: 'State correctness',
      getValue: (project) => <RiskCell item={project.stateCorrectness} />,
    },
    {
      name: 'Data availability',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
    },
    {
      name: 'Upgradeability',
      getValue: (project) => <RiskCell item={project.upgradeability} />,
    },
    {
      name: 'Owner',
      getValue: (project) => <RiskCell item={project.owner} />,
    },
    {
      name: 'Escape hatch',
      getValue: (project) => <RiskCell item={project.escapeHatch} />,
    },
  ]

  return (
    <div className="RiskView">
      <TableView items={items} columns={columns} />
    </div>
  )
}
