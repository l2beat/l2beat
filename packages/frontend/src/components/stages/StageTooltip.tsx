import { Stage, StageConfig } from '@l2beat/config'
import React from 'react'

import { MissingIcon } from '../icons'
import { StageBadge } from './StageBadge'
import { StageDisclaimer } from './StageDisclaimer'

export interface StageTooltipProps {
  item?: StageConfig
}

export function StageTooltip({ item }: StageTooltipProps) {
  if (!item) return null

  return (
    <div className="flex max-w-[300px] flex-col gap-4 py-1">
      <span>
        <StageBadge stage={item.stage} className="font-medium" />
        <span className="ml-2 inline-block font-medium">
          {getStageName(item.stage)}
        </span>
      </span>
      {item.stage === 'UnderReview' ? (
        <>
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </>
      ) : (
        item.missing && (
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
        )
      )}
      <StageDisclaimer
        text="Please mind, stages do not reflect rollup security"
        small
      />
    </div>
  )
}

function getStageName(stage: Stage | 'UnderReview') {
  switch (stage) {
    case 'UnderReview':
      return 'Stage under review'
    case 'Stage 0':
      return 'Full training wheels'
    case 'Stage 1':
      return 'Limited training wheels'
    case 'Stage 2':
      return 'No training wheels'
    default:
      return ''
    // assertUnreachable(stage)
  }
}

function getColorClassName(stage: Stage) {
  switch (stage) {
    case 'Stage 1':
      return 'text-yellow-200'
    case 'Stage 2':
      return 'text-green-400'
    default:
      return ''
  }
}
