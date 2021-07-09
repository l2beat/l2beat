import { PercentChange } from '../../common'
import { FinancialEntry } from './getHomePageProps'

interface Props {
  items: FinancialEntry[]
}

export function FinancialView({ items }: Props) {
  return (
    <table className="financials">
      <thead className="financials__header">
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Total Value Locked</th>
          <th>1 day change</th>
          <th>7 day change</th>
          <th>Market share</th>
        </tr>
      </thead>
      <tbody className="financials__body">
        {items.map((project, i) => (
          <tr key={i}>
            <td>{i + 1}.</td>
            <td>
              <a href={`/projects/${project.slug}`}>{project.name}</a>
            </td>
            <td>{project.tvl}</td>
            <td>
              <PercentChange value={project.oneDayChange} />
            </td>
            <td>
              <PercentChange value={project.sevenDayChange} />
            </td>
            <td>{project.marketShare}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
