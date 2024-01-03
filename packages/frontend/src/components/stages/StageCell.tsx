import { StageConfig } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { StageBadge } from './StageBadge'
import { StageTooltip } from './StageTooltip'

export interface StageCellProps {
  stageConfig: StageConfig
}

export function StageCell({ stageConfig }: StageCellProps) {
  if (stageConfig.stage === 'NotApplicable') {
    return <StageBadge stage={stageConfig.stage} oneSize />
  }

  return (
    <div
      className="Tooltip"
      title={renderToStaticMarkup(<StageTooltip stageConfig={stageConfig} />)}
      data-tooltip-big
      data-tooltip-mobile-disabled
    >
      <StageBadge
        stage={stageConfig.stage}
        icon={
          stageConfig.stage !== 'UnderReview'
            ? stageConfig.message?.type
            : undefined
        }
        oneSize
      />
    </div>
  )
}
