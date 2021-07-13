import { PercentChange } from '../../common'
import { FinancialEntry } from './getHomePageProps'

interface Props {
  items: FinancialEntry[]
}

export function FinancialView({ items }: Props) {
  return (
    <div className="financials">
      <table className="financials__table">
        <thead className="financials__header">
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>
              <span data-wide>Total Value Locked</span>
              <span data-narrow>TVL</span>
            </th>
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
                <a
                  className="financials__name"
                  href={`/projects/${project.slug}`}
                >
                  <img
                    className="financials__icon"
                    src={`/icons/${project.slug}.png`}
                    alt={`${project.name} logo`}
                  />
                  {project.name}
                </a>
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
    </div>
  )
}
