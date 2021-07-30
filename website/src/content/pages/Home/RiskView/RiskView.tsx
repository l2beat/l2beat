import { ProjectLink } from '../ProjectLink'
import { RiskViewEntry } from '../props/getRiskViewEntry'
import { Column, TableView } from '../TableView'

interface Props {
  items: RiskViewEntry[]
}

export function RiskView({ items }: Props) {
  const columns: Column<RiskViewEntry>[] = [
    {
      name: 'No.',
      getValue: (_, index) => index + 1,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectLink project={project} />,
    },
  ]
  return (
    <div className="RiskView">
      <TableView items={items} columns={columns} />
    </div>
  )
}
