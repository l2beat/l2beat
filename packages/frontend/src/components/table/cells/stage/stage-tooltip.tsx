import { type Stage, type StageConfig } from '@l2beat/config'
import {
  StageBadge,
  getStageTextClassname,
} from '~/components/badge/stage-badge'
import { Callout } from '~/components/callout'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { WarningBar } from '~/components/warning-bar'
import { InfoIcon } from '~/icons/info'
import { MissingIcon } from '~/icons/missing'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { UnderReviewIcon } from '~/icons/under-review'
import { cn } from '~/utils/cn'

export interface StageTooltipProps {
  stageConfig: StageConfig
  isAppchain: boolean
}

export function StageTooltip({ stageConfig, isAppchain }: StageTooltipProps) {
  if (stageConfig.stage === 'NotApplicable') return null

  return (
    <div className="flex max-w-[300px] flex-col py-1">
      <div
        className={cn('flex gap-2', isAppchain ? 'flex-col' : 'items-baseline')}
      >
        <StageBadge
          stage={stageConfig.stage}
          isAppchain={isAppchain}
          className="font-medium"
          inline
        />
        <div className="inline-block font-bold">
          {getStageName(stageConfig.stage)}
        </div>
      </div>
      {isAppchain && (
        <div className="mt-2 font-medium">
          <span className={getStageTextClassname(stageConfig.stage)}>
            Appchain
          </span>
          : This project brings additional app-specific considerations that are
          not reflected in the stages framework.
        </div>
      )}
      <HorizontalSeparator className="my-4" />

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
              className="mb-4"
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
        icon={<InfoIcon className="size-4" variant="blue" />}
        className={cn(
          'p-4 font-medium',
          stageConfig.stage !== 'Stage 2' && 'mt-4',
        )}
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
      return undefined
  }
}

function getColorClassName(stage: Stage) {
  switch (stage) {
    case 'Stage 1':
      return 'text-yellow-200'
    case 'Stage 2':
      return 'text-green-400'
    default:
      return undefined
  }
}
