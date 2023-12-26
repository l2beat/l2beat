import { Stage, StageConfig } from '@l2beat/config'
import React from 'react'

import { MissingIcon, RoundedWarningIcon, UnderReviewIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { StageBadge } from './StageBadge'
import { StageDisclaimer } from './StageDisclaimer'

export interface StageTooltipProps {
  stageConfig: StageConfig
}

export function StageTooltip({ stageConfig }: StageTooltipProps) {
  if (stageConfig.stage === 'NotApplicable') return null

  return (
    <div className="flex max-w-[300px] flex-col gap-4 py-1">
      <span>
        <StageBadge
          stage={stageConfig.stage}
          icon={
            stageConfig.stage !== 'UnderReview'
              ? stageConfig.message?.type
              : undefined
          }
          className="font-medium"
        />
        <span className="ml-2 inline-block font-medium">
          {getStageName(stageConfig.stage)}
        </span>
      </span>
      {stageConfig.stage === 'UnderReview' ? (
        <>
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </>
      ) : (
        <>
          {stageConfig.message && (
            <WarningBar
              color="yellow"
              icon={
                stageConfig.message.type === 'warning'
                  ? RoundedWarningIcon
                  : UnderReviewIcon
              }
              text={stageConfig.message.text}
            />
          )}
          {stageConfig.missing && (
            <div className="text-sm">
              <span className="mb-2 block leading-tight">
                Items missing for{' '}
                <span
                  className={getColorClassName(stageConfig.missing.nextStage)}
                >
                  {stageConfig.missing.nextStage}
                </span>
              </span>
              <ul className="list-none space-y-2">
                {stageConfig.missing.requirements.map((requirement, i) => (
                  <li className="flex gap-1.5" key={i}>
                    <MissingIcon className="relative top-0.5 inline-block shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
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
