import { type UsableStageConfig } from '@l2beat/config'
import React from 'react'

import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/app/_components/accordion'
import InfoIcon from '~/icons/info.svg'
import MissingIcon from '~/icons/missing.svg'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import SatisfiedIcon from '~/icons/satisfied.svg'
import UnderReviewIcon from '~/icons/under-review.svg'
import { StageBadge } from '../../badge/stage-badge'
import { Callout } from '../../callout'
import { CustomLink } from '../../link/custom-link'
import { Markdown } from '../../markdown/markdown'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface StageSectionProps extends ProjectSectionProps {
  icon: string
  name: string
  type: string
  stageConfig: UsableStageConfig
}

export function StageSection(props: StageSectionProps) {
  if (props.stageConfig.stage === 'UnderReview' || props.isUnderReview) {
    return (
      <ProjectSection
        title={props.title}
        id={props.id}
        sectionOrder={props.sectionOrder}
        isUnderReview
        includeChildrenIfUnderReview
      >
        <div className="mb-6 font-medium">
          <Image
            src={props.icon}
            alt={props.name}
            width={18}
            height={18}
            className="relative -top-0.5 mr-2 inline-block"
          />
          {props.name} is currently
          <StageBadge
            stage={props.stageConfig.stage}
            big
            className="mx-1 md:mx-1.5"
          />
          for stage assignment.
        </div>
      </ProjectSection>
    )
  }

  const warningBarIcon =
    props.stageConfig.message?.type === 'warning'
      ? RoundedWarningIcon
      : UnderReviewIcon

  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
    >
      <div className="mb-6 font-medium">
        <Image
          src={props.icon}
          alt={props.name}
          width={18}
          height={18}
          className="relative -top-0.5 mr-2 inline-block"
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
      <Accordion type="multiple">
        {props.stageConfig.summary.map((stage) => {
          const satisfied = stage.requirements.filter(
            (r) => r.satisfied === true,
          )
          const missing = stage.requirements.filter(
            (r) => r.satisfied === false,
          )
          const underReview = stage.requirements.filter(
            (r) => r.satisfied === 'UnderReview',
          )

          return (
            <AccordionItem
              key={stage.stage}
              value={stage.stage}
              className="mb-4 rounded-lg bg-gray-200 dark:bg-zinc-700"
            >
              <AccordionTrigger className="p-4 text-lg font-normal">
                <div className="flex select-none items-center justify-start gap-3">
                  <StageBadge stage={stage.stage} big />
                  {missing.length === 0 ? (
                    <div className="flex flex-col gap-3 md:flex-row">
                      <div className="flex items-center gap-2">
                        <SatisfiedIcon className="size-4 shrink-0" />
                        <span>{reqTextSatisfied(satisfied.length)}</span>
                      </div>
                      {underReview.length > 0 && (
                        <div className="flex items-center gap-2">
                          <UnderReviewIcon className="size-4 shrink-0" />
                          <span>{underReview.length} under review</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {stage.stage === 'Stage 0' ? (
                        <RoundedWarningIcon className="size-4 shrink-0 fill-yellow-300" />
                      ) : (
                        <MissingIcon className="size-4 shrink-0" />
                      )}
                      <span>{reqTextMissing(missing.length)}</span>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                <ul className="mx-4 space-y-2 pb-4 md:px-4 md:pb-6">
                  {satisfied.map((req, i) => (
                    <li key={i} className="flex">
                      <SatisfiedIcon className="relative top-0.5 size-4 shrink-0" />
                      <Markdown className="ml-2 leading-none" inline>
                        {req.description}
                      </Markdown>
                    </li>
                  ))}
                  {underReview.map((req, i) => (
                    <li key={i} className="flex">
                      <UnderReviewIcon className="relative top-0.5 size-4 shrink-0" />
                      <Markdown className="ml-2 leading-none" inline>
                        {req.description}
                      </Markdown>
                    </li>
                  ))}
                  {missing.map((req, i) => (
                    <li key={i} className="flex">
                      {stage.stage === 'Stage 0' ? (
                        <RoundedWarningIcon className="size-4 shrink-0 fill-yellow-300" />
                      ) : (
                        <MissingIcon className="relative top-0.5 size-4 shrink-0" />
                      )}
                      <Markdown className="ml-2 leading-none" inline>
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
        href="https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe "
        className="mt-3 block text-sm"
      >
        Learn more about Rollup stages
      </CustomLink>
      <Callout
        color="blue"
        body="Please keep in mind that these stages do not reflect rollup security, this is an opinionated assessment of rollup maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal."
        icon={<InfoIcon className="size-5 fill-blue-500" />}
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
