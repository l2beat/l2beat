import type { Stage, StageConfig } from '@l2beat/config'
import {
  StageBadge,
  getStageTextClassname,
} from '~/components/badge/stage-badge'
import { Callout } from '~/components/callout'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { StageOneRequirementsChangeTooltipContent } from '~/components/countdowns/stage-one-requirements-change/stage-one-requirements-change-tooltip-content'
import { WarningBar } from '~/components/warning-bar'
import { featureFlags } from '~/consts/feature-flags'
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
  const missing =
    stageConfig.stage !== 'UnderReview'
      ? stageConfig.missing?.principle &&
        featureFlags.stageOneRequirementsChanged()
        ? [stageConfig.missing.principle]
        : stageConfig.missing?.requirements
      : undefined

  return (
    <div className="flex flex-col py-1">
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
      {stageConfig.stage !== 'UnderReview' &&
      !!stageConfig.additionalConsiderations ? (
        isAppchain ? (
          <div className="mt-2">
            <span
              className={cn(
                'font-medium',
                getStageTextClassname(stageConfig.stage),
              )}
            >
              Appchain
            </span>
            : {stageConfig.additionalConsiderations.short}
          </div>
        ) : (
          stageConfig.additionalConsiderations.short
        )
      ) : null}
      <HorizontalSeparator className="my-3" />

      {stageConfig.stage === 'UnderReview' && (
        <p>
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      )}
      {stageConfig.stage !== 'UnderReview' && !stageConfig.downgradePending && (
        <div>
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
                {missing?.map((requirement, i) => (
                  <li className="flex gap-1.5" key={i}>
                    <MissingIcon className="relative top-0.5 inline-block shrink-0" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {stageConfig.stage !== 'UnderReview' && stageConfig.downgradePending && (
        <StageOneRequirementsChangeTooltipContent
          downgradePending={stageConfig.downgradePending}
        />
      )}
      <Callout
        color="blue"
        body="Please mind, stages do not reflect rollup security"
        icon={<InfoIcon className="-mt-px size-4 fill-blue-600" />}
        className={cn(
          '!gap-1 p-3 text-[13px] font-medium',
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
