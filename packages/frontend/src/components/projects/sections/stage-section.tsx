import { type UsableStageConfig } from '@l2beat/config'

import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/core/accordion'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { StageOneRequirementsChangeStageSectionNotice } from '~/components/countdowns/stage-one-requirements-change/stage-one-requirements-change-notice'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
import { featureFlags } from '~/consts/feature-flags'
import { InfoIcon } from '~/icons/info'
import { MissingIcon } from '~/icons/missing'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { SatisfiedIcon } from '~/icons/satisfied'
import { UnderReviewIcon } from '~/icons/under-review'
import { StageBadge } from '../../badge/stage-badge'
import { Callout } from '../../callout'
import { Markdown } from '../../markdown/markdown'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface StageSectionProps extends ProjectSectionProps {
  icon: string
  name: string
  type: string
  stageConfig: UsableStageConfig
  isAppchain: boolean
  additionalConsiderations:
    | {
        short: string
        long: string
      }
    | undefined
}

export function StageSection({
  icon,
  name,
  type,
  stageConfig,
  isAppchain,
  additionalConsiderations,
  ...sectionProps
}: StageSectionProps) {
  if (stageConfig.stage === 'UnderReview' || sectionProps.isUnderReview) {
    return (
      <ProjectSection {...sectionProps} isUnderReview>
        <div className="mb-6 flex flex-wrap items-center font-medium">
          <Image
            src={icon}
            alt={name}
            width={18}
            height={18}
            className="relative -top-0.5 mr-2 inline-block size-[18px]"
          />
          {name} is currently
          <StageBadge
            stage={stageConfig.stage}
            className="mx-1 md:mx-1.5"
            isAppchain={isAppchain}
          />
          for stage assignment.
        </div>
      </ProjectSection>
    )
  }

  const warningBarIcon =
    stageConfig.message?.type === 'warning'
      ? RoundedWarningIcon
      : UnderReviewIcon

  return (
    <ProjectSection {...sectionProps}>
      <span className="mb-4 inline-block w-full rounded bg-surface-secondary px-6 py-4 font-medium">
        <Image
          src={icon}
          alt={name}
          width={18}
          height={18}
          className="relative -top-0.5 mr-2 inline-block"
        />
        {name} is a{' '}
        <StageBadge
          stage={stageConfig.stage}
          className="relative -top-px inline-flex"
          isAppchain={isAppchain}
          appchainClassName="text-base md:text-lg inline"
          inline
        />
        <span> {type}</span>.
      </span>
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
              <div className="text-[13px] font-semibold uppercase leading-none text-secondary">
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
              <AccordionTrigger className="px-6 py-4 text-lg font-normal">
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
                      {stage.stage === 'Stage 0' ? (
                        <RoundedWarningIcon className="size-4 shrink-0 fill-warning" />
                      ) : (
                        <MissingIcon className="size-4 shrink-0 fill-negative" />
                      )}
                      <span>{reqTextMissing(missingForLabel.length)}</span>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="mx-6 space-y-1 text-lg md:space-y-2">
                {stage.principle && (
                  <div className="rounded-lg border border-brand p-2">
                    <div className="flex items-center gap-1">
                      <span className="ml-6 text-[13px] uppercase">
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
                )}

                {featureFlags.stageOneRequirementsChanged() &&
                  stage.principle && (
                    <p className="ml-8 text-[13px] uppercase">Guidelines</p>
                  )}
                <ul className="space-y-1 px-2 md:space-y-2">
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
                      {stage.stage === 'Stage 0' ? (
                        <RoundedWarningIcon className="size-4 shrink-0 fill-warning" />
                      ) : (
                        <MissingIcon className="relative top-0.5 size-4 shrink-0 fill-negative" />
                      )}
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
        icon={<InfoIcon className="size-5" variant="blue" />}
        className="mt-6 p-4 font-medium leading-snug"
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
