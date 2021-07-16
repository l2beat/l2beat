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
              <span data-wide>Value Locked</span>
              <span data-narrow>TVL</span>
            </th>
            <th>% / 7 days</th>
            <th>Market share</th>
            <th>Purpose</th>
            <th>
              Tech<span data-wide>nology</span>
            </th>
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
                <PercentChange value={project.sevenDayChange} />
              </td>
              <td>{project.marketShare}</td>
              <td>{project.purpose}</td>
              <td>
                <a
                  className="financials__technology"
                  href="/faq/#categories"
                  data-rollup={
                    ['ZKR', 'ORU'].includes(project.technology.abbreviation)
                      ? true
                      : undefined
                  }
                >
                  <span>{project.technology.abbreviation}</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
