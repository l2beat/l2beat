import { PercentChange } from '../../../common'
import { WarningIcon } from '../../../common/icons'
import { ProjectLink } from '../ProjectLink'
import { FinancialEntry } from '../props'
import { Column, TableView } from '../TableView'
import { TechnologyCell } from './TechnologyCell'
import { TVLCell } from './TVLCell'

interface Props {
  items: FinancialEntry[]
}

export function FinancialView({ items }: Props) {
  const columns: Column<FinancialEntry>[] = [
    {
      name: 'Name',
      getValue: (project) => <ProjectLink project={project} />,
    },
    {
      name: 'Value Locked',
      shortName: 'TVL',
      alignRight: true,
      getValue: (project) => <TVLCell project={project} />,
    },
    {
      name: '7 days change',
      shortName: '% / 7 days',
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
      getValue: (project) => project.purpose,
    },
    {
      name: 'Technology',
      shortName: 'Tech',
      alignRight: true,
      getValue: (project) => <TechnologyCell project={project} />,
    },
  ]

  return (
    <div className="FinancialView active">
      <TableView items={items} columns={columns} />
      <div className="FinancialView-Symbols">
        <p>
          <WarningIcon fill="var(--neutral-yellow)" /> &ndash; A token
          associated with the project accounts for more than 10% of the TVL.
        </p>
        <p>
          <WarningIcon fill="var(--negative-red)" /> &ndash; A token associated
          with the project accounts for more than 90% of the TVL. This makes the
          metric vulnerable to manipulation.
        </p>
      </div>
    </div>
  )
}
