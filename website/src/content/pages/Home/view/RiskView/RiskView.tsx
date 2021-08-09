import { ProjectLink } from '../ProjectLink'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

export interface RiskViewProps {
  items: RiskViewEntry[]
}

export interface RiskViewEntry {
  name: string
  slug: string
  stateCorrectness: RiskViewItem
  dataAvailability: RiskViewItem
  upgradeability: RiskViewItem
  owner: RiskViewItem
  escapeHatch: RiskViewItem
}

export interface RiskViewItem {
  value: string
  sentiment?: 'good' | 'bad' | 'neutral' | 'unknown'
}

export function RiskView({ items }: RiskViewProps) {
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
