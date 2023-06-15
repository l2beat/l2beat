import { Stage, StageConfig } from '@l2beat/config'
import React from 'react'

import { MissingIcon } from '../icons/symbols/MissingIcon'
import { StageBadge } from './StageBadge'
import { StageDisclaimer } from './StageDisclaimer'

export interface StageTooltipProps {
  item?: StageConfig
}

export function StageTooltip({ item }: StageTooltipProps) {
  if (!item) return null

  // TODO: implement under review tooltip
  if (item.stage === 'UnderReview') {
    return <span>Under Review 🕵️‍♀️</span>
  }

  return (
    <div className="flex flex-col gap-4 py-1">
      <span>
        <StageBadge stage={item.stage} className="font-medium" />
      </span>
      {item.missing && (
        <div className="text-sm">
          <span className="mb-2 block leading-tight">
            Items missing for{' '}
            <span className={getColorClassName(item.missing.nextStage)}>
              {item.missing.nextStage}
            </span>
          </span>
          <ul className="list-none space-y-2">
            {item.missing.requirements.map((requirement, i) => (
              <li className="flex gap-1.5" key={i}>
                <MissingIcon className="relative top-0.5 inline-block shrink-0" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      )}
      <StageDisclaimer
        text="Please mind, stages do not reflect rollup security"
        small
      />
    </div>
  )
}

function getColorClassName(stage: Stage) {
  switch (stage) {
    case 'Stage 1':
      return 'text-yellow-250'
    case 'Stage 2':
      return 'text-green-400'
    default:
      return ''
  }
}
