import { UsableStageConfig } from '@l2beat/config'
import React from 'react'

import {
  ChevronDownIcon,
  MissingIcon,
  RoundedWarningIcon,
  SatisfiedIcon,
  UnderReviewIcon,
} from '../icons'
import { Link } from '../Link'
import { Markdown } from '../Markdown'
import { StageBadge } from '../stages/StageBadge'
import { StageDisclaimer } from '../stages/StageDisclaimer'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'
import { UnderReviewCallout } from './UnderReviewCallout'
import { WarningBar } from './WarningBar'

export interface StageSectionProps {
  title: string
  id: ProjectSectionId
  icon: string
  name: string
  type: string
  stageConfig: UsableStageConfig
  isUnderReview?: boolean
}

export function StageSection(props: StageSectionProps) {
  if (props.stageConfig.stage === 'UnderReview' || props.isUnderReview) {
    return (
      <ProjectDetailsSection title={props.title} id={props.id} className="mt-4">
        <div className="mb-6 font-medium">
          <img
            src={props.icon}
            alt={props.name}
            className="relative -top-0.5 mr-2 inline-block h-6 w-6"
          />
          {props.name} is currently
          <StageBadge
            stage={props.stageConfig.stage}
            big
            className="mx-1 md:mx-1.5"
          />
          for stage assignment.
        </div>
        <UnderReviewCallout />
      </ProjectDetailsSection>
    )
  }

  const warningBarIcon =
    props.stageConfig.message?.type === 'warning'
      ? RoundedWarningIcon
      : UnderReviewIcon

  return (
    <ProjectDetailsSection title={props.title} id={props.id} className="mt-4">
      <div className="mb-6 font-medium">
        <img
          src={props.icon}
          alt={props.name}
          className="relative -top-0.5 mr-2 inline-block h-6 w-6"
        />
        {props.name} is a{' '}
        <StageBadge
          stage={props.stageConfig.stage}
          icon={props.stageConfig.message?.type}
          big
          className="mx-1"
        />
        <span className="lowercase"> {props.type}</span>.
      </div>
      {props.stageConfig.message && (
        <WarningBar
          color="yellow"
          className="mb-6"
          icon={warningBarIcon}
          text={props.stageConfig.message.text}
        />
      )}
      {props.stageConfig.summary.map((stage) => {
        const satisfied = stage.requirements.filter((r) => r.satisfied === true)
        const missing = stage.requirements.filter((r) => r.satisfied === false)
        const underReview = stage.requirements.filter(
          (r) => r.satisfied === 'UnderReview',
        )

        return (
          <div
            key={stage.stage}
            className="Dropdown mb-4 rounded-lg bg-gray-100 dark:bg-neutral-700"
          >
            <label className="flex cursor-pointer items-center justify-between p-4">
              <input
                type="checkbox"
                autoComplete="off"
                className="Dropdown-Button peer hidden"
              />
              <div className="flex select-none items-center gap-3">
                <StageBadge stage={stage.stage} big />
                {missing.length === 0 ? (
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="flex items-center gap-2">
                      <SatisfiedIcon className="shrink-0" />
                      <span>{reqTextSatisfied(satisfied.length)}</span>
                    </div>
                    {underReview.length > 0 && (
                      <div className="flex items-center gap-2">
                        <UnderReviewIcon className="shrink-0" />
                        <span>{underReview.length} under review</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {stage.stage === 'Stage 0' ? (
                      <RoundedWarningIcon className="h-4 w-4 shrink-0 fill-yellow-300" />
                    ) : (
                      <MissingIcon className="shrink-0" />
                    )}
                    <span>{reqTextMissing(missing.length)}</span>
                  </div>
                )}
              </div>
              <ChevronDownIcon className="transition-transform duration-300 peer-checked:-rotate-180" />
            </label>
            <ul className="Dropdown-Item pointer-events-none mx-4 hidden space-y-2 pb-4 md:px-4 md:pb-6">
              {satisfied.map((req, i) => (
                <li key={i} className="flex">
                  <SatisfiedIcon className="relative top-0.5 shrink-0" />
                  <Markdown className="ml-2" inline>
                    {req.description}
                  </Markdown>
                </li>
              ))}
              {underReview.map((req, i) => (
                <li key={i} className="flex">
                  <UnderReviewIcon className="relative top-0.5 shrink-0 " />
                  <Markdown className="ml-2" inline>
                    {req.description}
                  </Markdown>
                </li>
              ))}
              {missing.map((req, i) => (
                <li key={i} className="flex">
                  {stage.stage === 'Stage 0' ? (
                    <RoundedWarningIcon className="h-4 w-4 shrink-0 fill-yellow-300" />
                  ) : (
                    <MissingIcon className="relative top-0.5 shrink-0" />
                  )}
                  <Markdown className="ml-2" inline>
                    {req.description}
                  </Markdown>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <Link
        href="https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe "
        className="mt-3 block text-sm"
        showArrow
      >
        Learn more about Rollup stages
      </Link>
      <StageDisclaimer
        className="mt-6 leading-snug"
        text="Please keep in mind that these stages do not reflect rollup security, this is an opinionated assessment of rollup maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal."
      />
    </ProjectDetailsSection>
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
