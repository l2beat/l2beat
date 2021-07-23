import { PercentChange } from '../../common'
import { WarningIcon } from '../../common/icons'
import { FinancialEntry } from './getHomePageProps'

interface Props {
  items: FinancialEntry[]
}

export function FinancialView({ items }: Props) {
  return (
    <>
      <div className="FinancialView">
        <table className="FinancialView-Table">
          <thead className="FinancialView-Header">
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
          <tbody className="FinancialView-Body">
            {items.map((project, i) => (
              <tr key={i}>
                <td>{i + 1}.</td>
                <td>
                  <a
                    className="FinancialView-Name"
                    href={`/projects/${project.slug}`}
                  >
                    <img
                      className="FinancialView-Icon"
                      src={`/icons/${project.slug}.png`}
                      alt={`${project.name} logo`}
                    />
                    {project.name}
                  </a>
                </td>
                <td>
                  {project.tvl}
                  {project.tvlWarning && (
                    <div className="FinancialView-TvlWarning">
                      <div className="Tooltip" title={project.tvlWarning}>
                        <WarningIcon
                          fill={
                            project.severeWarning
                              ? 'var(--negative-red)'
                              : 'var(--neutral-yellow)'
                          }
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  <PercentChange value={project.sevenDayChange} />
                </td>
                <td>{project.marketShare}</td>
                <td>{project.purpose}</td>
                <td>
                  <abbr
                    className="FinancialView-Technology Tooltip"
                    title={project.technology.name}
                    data-rollup={
                      ['ZKR', 'ORU'].includes(project.technology.abbreviation)
                        ? true
                        : undefined
                    }
                  >
                    <span>{project.technology.abbreviation}</span>
                  </abbr>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    </>
  )
}
