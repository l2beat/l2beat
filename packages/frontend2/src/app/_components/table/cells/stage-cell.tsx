import { type Stage, type StageConfig } from '@l2beat/config'
import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip'
import { StageBadge } from '../../badge/stage-badge'
import { WarningBar } from '../../warning-bar'
import { Callout } from '../../callout'
import InfoIcon from '~/icons/info.svg'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import MissingIcon from '~/icons/missing.svg'
import UnderReviewIcon from '~/icons/under-review.svg'

export interface StageCellProps {
  stageConfig: StageConfig
}

export function StageCell({ stageConfig }: StageCellProps) {
  if (stageConfig.stage === 'NotApplicable') {
    return <StageBadge stage={stageConfig.stage} oneSize />
  }

  return (
    // TODO: disabledOnMobile
    <Tooltip>
      <TooltipTrigger>
        <StageBadge
          stage={stageConfig.stage}
          icon={
            stageConfig.stage !== 'UnderReview'
              ? stageConfig.message?.type
              : undefined
          }
          oneSize
        />
      </TooltipTrigger>
      <TooltipContent>
        <StageTooltip stageConfig={stageConfig} />
      </TooltipContent>
    </Tooltip>
  )
}

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
              ignoreMarkdown
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
      <Callout
        color="blue"
        body="Please mind, stages do not reflect rollup security"
        icon={<InfoIcon className="fill-blue-500 size-4" />}
        className="p-4 font-medium"
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
