import { ProjectRiskView } from '@l2beat/config'
import { ProjectLink } from '../ProjectLink'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

export interface RiskViewProps {
  items: RiskViewEntry[]
}

export interface RiskViewEntry extends ProjectRiskView {
  name: string
  slug: string
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
      name: 'Censorship resistance',
      getValue: (project) => <RiskCell item={project.censorshipResistance} />,
    },
    {
      name: 'Upgradeability',
      getValue: (project) => <RiskCell item={project.upgradeability} />,
    },
    {
      name: 'Owner',
      getValue: (project) => <RiskCell item={project.owner} />,
    },
  ]

  return (
    <div className="RiskView">
      <TableView items={items} columns={columns} />
    </div>
  )
}
