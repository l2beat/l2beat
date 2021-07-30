import { WarningIcon } from '../../../common/icons'
import { FinancialEntry } from '../props'

interface Props {
  project: FinancialEntry
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
                  : 'var(--neutral-yellow)'
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
