import React from 'react'

import { InfoIcon, WarningIcon } from '../../../../common/icons'
import { FinancialViewEntry } from './FinancialView'

interface Props {
  project: FinancialViewEntry
}

export function TVLCell({ project }: Props) {
  return (
    <>
      {project.tvlWarning && (
        <div className="FinancialView-TvlWarning">
          <div className="Tooltip" title={project.tvlWarning}>
            {project.warningSeverity === 'info' && (
              <InfoIcon fill="var(--text-info)" />
            )}
            {project.warningSeverity === 'warning' && (
              <WarningIcon fill="var(--text-warning)" />
            )}
            {project.warningSeverity === 'bad' && (
              <WarningIcon fill="var(--text-bad)" />
            )}
          </div>
        </div>
      )}
      {project.tvl}
    </>
  )
}
