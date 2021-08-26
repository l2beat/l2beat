import React from 'react'
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
                  ? 'var(--text-bad)'
                  : 'var(--text-warning)'
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
