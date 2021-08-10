import { WarningIcon } from '../../../../common/icons'
import { FinancialViewEntry } from './FinancialView'

interface Props {
  project: FinancialViewEntry
}

export function TVLCell({ project }: Props) {
  return (
    <>
      {project.tvl}
      {project.tvlWarning && (
        <div className="FinancialView-TvlWarning">
          <div className="Tooltip" title={project.tvlWarning}>
            <WarningIcon
              fill={
                project.severeWarning
                  ? 'var(--negative-red)'
                  : 'var(--warning-yellow)'
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
