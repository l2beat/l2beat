import type {
  ProjectScalingCategory,
  ProjectScalingScopeOfAssessment,
  StageConfigured,
  StageUnderReview,
} from '@l2beat/config'
import { UnderReviewBadge } from '~/components/badge/UnderReviewBadge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { StageOneRequirementsChangeStageSectionNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import { CustomLink } from '~/components/link/CustomLink'
import { featureFlags } from '~/consts/featureFlags'
import { EmergencyIcon } from '~/icons/Emergency'
import { InfoIcon } from '~/icons/Info'
import { MissingIcon } from '~/icons/Missing'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { ChevronIcon } from '../../../icons/Chevron'
import { StageBadge } from '../../badge/StageBadge'
import { Callout } from '../../Callout'
import { Markdown } from '../../markdown/Markdown'
import { WarningBar } from '../../WarningBar'
import { ProjectSection } from './ProjectSection'
import { ScopeOfAssessment } from './ScopeOfAssessment'
import type { ProjectSectionProps } from './types'

export interface StageSectionProps extends ProjectSectionProps {
  icon: string
  name: string
  type: ProjectScalingCategory
  stageConfig: StageUnderReview | StageConfigured
  isAppchain: boolean
  emergencyWarning?: string
  additionalConsiderations:
    | {
        short: string
        long: string
      }
    | undefined
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
}

export function StageSection({
  icon,
  name,
  type,
  stageConfig,
  isAppchain,
  additionalConsiderations,
  scopeOfAssessment,
  emergencyWarning,
  ...sectionProps
}: StageSectionProps) {
  if (stageConfig.stage === 'UnderReview' || sectionProps.isUnderReview) {
    return (
      <ProjectSection {...sectionProps} isUnderReview>
        <div className="mb-6 flex flex-wrap items-center gap-2 font-bold text-label-value-16 md:px-6 md:text-label-value-18">
          <img
            src={icon}
            alt={name}
            width={20}
            height={20}
            className="-top-px relative inline-block size-[18px]"
          />
          <p>{name}&apos;s stage is currently</p>
          <UnderReviewBadge />
        </div>
      </ProjectSection>
    )
  }

  const warningBarIcon =
    stageConfig.message?.type === 'warning'
      ? RoundedWarningIcon
      : UnderReviewIcon

  const notEvenAStage0 = type === 'Other' && stageConfig.missing?.requirements

  return (
    <ProjectSection {...sectionProps}>
      {emergencyWarning && (
        <Callout
          color="yellow"
          body={emergencyWarning}
          icon={<EmergencyIcon className="mt-0.5 size-5" />}
          className="mb-2 p-3 font-medium text-paragraph-14 md:p-4 md:text-paragraph-16"
        />
      )}
      <span className="mb-2 flex w-full items-center rounded-lg bg-surface-secondary p-4 font-bold text-label-value-16 md:px-6 md:text-label-value-18">
        <img
          src={icon}
          alt={name}
          width={24}
          height={24}
          className="-top-0.5 relative mr-2 inline-block size-5 shrink-0 md:size-6"
        />
        <div className="inline-block w-full">
          {name} is {notEvenAStage0 ? 'not even a' : 'a'}{' '}
          <StageBadge
            stage={stageConfig.stage}
            className="-top-px relative inline-flex"
            isAppchain={isAppchain}
            appchainClassName="text-base md:text-lg inline"
            inline
          />
          <span> {notEvenAStage0 ? 'project' : type}</span>.
        </div>
      </span>
      {scopeOfAssessment && (
        <ScopeOfAssessment
          className="mb-2"
          scopeOfAssessment={scopeOfAssessment}
        />
      )}
      {additionalConsiderations && (
        <div className="mb-2 space-y-4 font-normal text-paragraph-14 md:px-6 md:py-2 md:text-paragraph-16">
          {isAppchain && (
            <p>
              Rollup operators cannot compromise the system, but being{' '}
              <strong>application-specific</strong> might bring additional risk.
            </p>
          )}
          <p>{additionalConsiderations.long}</p>
          {isAppchain && (
            <div>
              <div className="font-semibold text-[13px] text-secondary uppercase leading-none">
                Note:
              </div>
              <div>
                We&apos;re still in the process of formalizing how to properly
                integrate appchains in the Stages framework.
              </div>
            </div>
          )}
        </div>
      )}
      {stageConfig.downgradePending && (
        <StageOneRequirementsChangeStageSectionNotice
          downgradePending={stageConfig.downgradePending}
          className="mb-2"
        />
      )}
      {stageConfig.message && (
        <WarningBar
          color="yellow"
          icon={warningBarIcon}
          text={stageConfig.message.text}
          className="font-medium text-paragraph-14 md:text-paragraph-16"
        />
      )}
      <HorizontalSeparator className="my-4" />
      <div className="space-y-2">
        {stageConfig.summary.map((stage) => {
          const requirementsForLabel =
            stage.principle && featureFlags.stageOneRequirementsChanged()
              ? [stage.principle]
              : stage.requirements
          const satisfiedForLabel = requirementsForLabel.filter(
            (r) => r.satisfied === true,
          )
          const missingForLabel = requirementsForLabel.filter(
            (r) => r.satisfied === false,
          )
          const underReviewForLabel = requirementsForLabel.filter(
            (r) => r.satisfied === 'UnderReview',
          )

          const satisfiedRequirements = stage.requirements.filter(
            (r) => r.satisfied === true,
          )
          const missingRequirements = stage.requirements.filter(
            (r) => r.satisfied === false,
          )
          const underReviewRequirements = stage.requirements.filter(
            (r) => r.satisfied === 'UnderReview',
          )

          return (
            <Collapsible
              key={stage.stage}
              className="group rounded-lg border border-divider"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 font-bold md:px-6">
                <div className="flex select-none items-center justify-start gap-4 max-md:text-base">
                  <StageBadge stage={stage.stage} isAppchain={false} />
                  {missingForLabel.length === 0 ? (
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="flex items-center gap-2 font-bold">
                        <SatisfiedIcon className="-mt-0.5 size-4 shrink-0 fill-positive" />
                        <span className="text-label-value-16 md:text-label-value-18">
                          {reqTextSatisfied(satisfiedForLabel.length)}
                        </span>
                      </div>
                      {underReviewForLabel.length > 0 && (
                        <div className="flex items-center gap-2">
                          <UnderReviewIcon className="size-4 shrink-0" />
                          <span className="text-label-value-16 md:text-label-value-18">
                            {underReviewForLabel.length} under review
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 font-bold">
                      <MissingIcon className="-mt-0.5 size-4 shrink-0 fill-negative" />
                      <span className="text-label-value-16 md:text-label-value-18">
                        {reqTextMissing(missingForLabel.length)}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronIcon className="group-data-[state=open]:-rotate-180 size-4 fill-secondary transition-transform duration-300" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 px-4 pt-1 pb-6 text-lg md:px-6">
                  {stage.principle && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-brand text-label-value-14">
                          {featureFlags.stageOneRequirementsChanged()
                            ? 'Principle'
                            : 'Upcoming Principle'}
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="size-3 fill-brand" />
                          </TooltipTrigger>
                          <TooltipContent>
                            A Principle is the main requirement you need to
                            fulfill in order to receive this stage. The
                            guidelines below serve to help the project meet this
                            goal.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="rounded-lg border border-brand px-[15px] py-2.5">
                        <div className="flex">
                          {stage.principle.satisfied === 'UnderReview' ? (
                            <UnderReviewIcon className="mt-0.5 size-4 shrink-0" />
                          ) : stage.principle.satisfied === true ? (
                            <SatisfiedIcon className="mt-0.5 size-4 shrink-0 fill-positive" />
                          ) : (
                            <MissingIcon className="mt-0.5 size-4 shrink-0 fill-negative" />
                          )}
                          <Markdown className="ml-2 font-medium text-paragraph-14 md:text-paragraph-16">
                            {stage.principle.description}
                          </Markdown>
                        </div>
                        {stageConfig.stage1PrincipleDescription && (
                          <p className="mt-2 pl-6 font-medium text-paragraph-14 text-secondary">
                            {stageConfig.stage1PrincipleDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {featureFlags.stageOneRequirementsChanged() &&
                    stage.principle && (
                      <p className="font-bold text-label-value-14 text-secondary">
                        Guidelines
                      </p>
                    )}
                  <ul className="space-y-1 md:space-y-2">
                    {satisfiedRequirements.map((req, i) => (
                      <li key={i} className="flex">
                        <SatisfiedIcon className="relative top-0.5 size-4 shrink-0 fill-positive md:top-[3px]" />
                        <Markdown className="ml-2 font-medium text-paragraph-14 md:text-paragraph-16">
                          {req.description}
                        </Markdown>
                      </li>
                    ))}
                    {underReviewRequirements.map((req, i) => (
                      <li key={i} className="flex">
                        <UnderReviewIcon className="relative top-0.5 size-4 shrink-0 md:top-[3px]" />
                        <Markdown className="ml-2 font-medium text-paragraph-14 md:text-paragraph-16">
                          {req.description}
                        </Markdown>
                      </li>
                    ))}
                    {missingRequirements.map((req, i) => (
                      <li key={i} className="flex">
                        <MissingIcon className="relative top-0.5 size-4 shrink-0 fill-negative md:top-[3px]" />
                        <Markdown className="ml-2 font-medium text-paragraph-14 md:text-paragraph-16">
                          {req.description}
                        </Markdown>
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
      <CustomLink href="/stages" className="mt-3 block text-label-value-14">
        Learn more about Rollup stages
      </CustomLink>
      <Callout
        color="blue"
        body="Please keep in mind that these stages do not reflect rollup security, this is an opinionated assessment of rollup maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal."
        icon={
          <InfoIcon className="size-4 max-md:mt-0.5 md:size-5" variant="blue" />
        }
        className="mt-6 p-4 font-medium text-paragraph-15 md:text-paragraph-16"
      />
    </ProjectSection>
  )
}

function reqTextSatisfied(amount: number) {
  if (amount === 1) {
    return '1 requirement met'
  }
  return `${amount} requirements met`
}

function reqTextMissing(amount: number) {
  if (amount === 1) {
    return '1 issue needs fixing'
  }

  return `${amount} issues need fixing`
}
