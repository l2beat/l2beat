import type {
  ProjectScalingCategory,
  ProjectScalingScopeOfAssessment,
  StageConfigured,
  StageUnderReview,
} from '@l2beat/config'
import { UnderReviewBadge } from '~/components/badge/UnderReviewBadge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/core/Accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { StageOneRequirementsChangeStageSectionNotice } from '~/components/countdowns/stage-one-requirements-change/StageOneRequirementsChangeNotice'
import { CustomLink } from '~/components/link/CustomLink'
import { externalLinks } from '~/consts/externalLinks'
import { featureFlags } from '~/consts/featureFlags'
import { EmergencyIcon } from '~/icons/Emergency'
import { InfoIcon } from '~/icons/Info'
import { MissingIcon } from '~/icons/Missing'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { UnderReviewIcon } from '~/icons/UnderReview'
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
        <div className="mb-6 flex flex-wrap items-center gap-2 font-medium">
          <img
            src={icon}
            alt={name}
            width={18}
            height={18}
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
          icon={<EmergencyIcon className="size-5" />}
          className="mb-4 p-4 font-medium leading-snug"
        />
      )}
      <span className="mb-4 inline-block w-full rounded-lg bg-surface-secondary p-4 font-medium md:px-6">
        <img
          src={icon}
          alt={name}
          width={18}
          height={18}
          className="-top-0.5 relative mr-2 inline-block"
        />
        {name} is {notEvenAStage0 ? 'not even a' : 'a'}{' '}
        <StageBadge
          stage={stageConfig.stage}
          className="-top-px relative inline-flex"
          isAppchain={isAppchain}
          appchainClassName="text-base md:text-lg inline"
          inline
        />
        <span> {notEvenAStage0 ? 'project' : type}</span>.
      </span>
      {scopeOfAssessment && (
        <ScopeOfAssessment
          className="mb-4"
          scopeOfAssessment={scopeOfAssessment}
        />
      )}
      {additionalConsiderations && (
        <div className="space-y-4 p-4 text-base">
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
          stage1PrincipleDescription={stageConfig.stage1PrincipleDescription}
        />
      )}
      {stageConfig.message && (
        <WarningBar
          color="yellow"
          className="mb-6"
          icon={warningBarIcon}
          text={stageConfig.message.text}
        />
      )}
      <Accordion type="multiple">
        {stageConfig.summary.map((stage) => {
          const requirementsForLabel =
            stage.principle && featureFlags.stageOneRequirementsChanged()
              ? [stage.principle]
              : stage.requirements
          const satisifedForLabel = requirementsForLabel.filter(
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
            <AccordionItem key={stage.stage} value={stage.stage}>
              <AccordionTrigger className="py-4 font-normal text-lg md:px-6">
                <div className="flex select-none items-center justify-start gap-3 max-md:text-base">
                  <StageBadge stage={stage.stage} isAppchain={false} />
                  {missingForLabel.length === 0 ? (
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="flex items-center gap-2 font-bold">
                        <SatisfiedIcon className="size-4 shrink-0 fill-positive" />
                        <span>
                          {reqTextSatisfied(satisifedForLabel.length)}
                        </span>
                      </div>
                      {underReviewForLabel.length > 0 && (
                        <div className="flex items-center gap-2">
                          <UnderReviewIcon className="size-4 shrink-0" />
                          <span>{underReviewForLabel.length} under review</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 font-bold">
                      <MissingIcon className="size-4 shrink-0 fill-negative" />
                      <span>{reqTextMissing(missingForLabel.length)}</span>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-1 text-lg md:mx-6 md:space-y-2">
                {stage.principle && (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] uppercase leading-normal">
                        {featureFlags.stageOneRequirementsChanged()
                          ? 'Principle'
                          : 'Upcoming principle'}
                      </span>
                      <Tooltip>
                        <TooltipTrigger className="-mt-0.5">
                          <InfoIcon className="size-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          A Principle is the main requirement you need to
                          fulfill in order to receive this stage. The guidelines
                          below serve to help the project meet this goal.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="rounded-lg border border-brand px-[15px] py-3">
                      <div className="flex">
                        {stage.principle.satisfied === 'UnderReview' ? (
                          <UnderReviewIcon className="mt-0.5 size-4 shrink-0" />
                        ) : stage.principle.satisfied === true ? (
                          <SatisfiedIcon className="mt-0.5 size-4 shrink-0 fill-positive" />
                        ) : (
                          <MissingIcon className="mt-0.5 size-4 shrink-0 fill-negative" />
                        )}
                        <Markdown className="ml-2 font-medium leading-tight max-md:text-base">
                          {stage.principle.description}
                        </Markdown>
                      </div>
                    </div>
                  </>
                )}

                {featureFlags.stageOneRequirementsChanged() &&
                  stage.principle && (
                    <p className="ml-8 text-[13px] uppercase">Guidelines</p>
                  )}
                <ul className="space-y-1 px-4 md:space-y-2">
                  {satisfiedRequirements.map((req, i) => (
                    <li key={i} className="flex">
                      <SatisfiedIcon className="relative top-0.5 size-4 shrink-0 fill-positive" />
                      <Markdown
                        className="ml-2 leading-none max-md:text-base"
                        inline
                      >
                        {req.description}
                      </Markdown>
                    </li>
                  ))}
                  {underReviewRequirements.map((req, i) => (
                    <li key={i} className="flex">
                      <UnderReviewIcon className="relative top-0.5 size-4 shrink-0" />
                      <Markdown
                        className="ml-2 leading-none max-md:text-base"
                        inline
                      >
                        {req.description}
                      </Markdown>
                    </li>
                  ))}
                  {missingRequirements.map((req, i) => (
                    <li key={i} className="flex">
                      <MissingIcon className="relative top-0.5 size-4 shrink-0 fill-negative" />
                      <Markdown
                        className="ml-2 leading-none max-md:text-base"
                        inline
                      >
                        {req.description}
                      </Markdown>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <CustomLink
        href={externalLinks.articles.stages}
        className="mt-3 block text-sm"
      >
        Learn more about Rollup stages
      </CustomLink>
      <Callout
        color="blue"
        body="Please keep in mind that these stages do not reflect rollup security, this is an opinionated assessment of rollup maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal."
        icon={<InfoIcon className="size-4 md:size-5" variant="blue" />}
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
