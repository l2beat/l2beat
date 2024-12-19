import { type UsableStageConfig } from '@l2beat/config'

import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/core/accordion'
import { CustomLink } from '~/components/link/custom-link'
import { externalLinks } from '~/consts/external-links'
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
import { type ProjectSectionProps } from './types'

export interface StageSectionProps extends ProjectSectionProps {
  icon: string
  name: string
  type: string
  stageConfig: UsableStageConfig
}

export function StageSection({
  icon,
  name,
  type,
  stageConfig,
  ...sectionProps
}: StageSectionProps) {
  if (stageConfig.stage === 'UnderReview' || sectionProps.isUnderReview) {
    return (
      <ProjectSection
        {...sectionProps}
        isUnderReview
        includeChildrenIfUnderReview
      >
        <div className="mb-6 font-medium">
          <Image
            src={icon}
            alt={name}
            width={18}
            height={18}
            className="relative -top-0.5 mr-2 inline-block"
          />
          {name} is currently
          <StageBadge stage={stageConfig.stage} className="mx-1 md:mx-1.5" />
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
      <div className="mb-6 font-medium">
        <Image
          src={icon}
          alt={name}
          width={18}
          height={18}
          className="relative -top-0.5 mr-2 inline-block"
        />
        {name} is a <StageBadge stage={stageConfig.stage} className="mx-1" />
        <span className="lowercase"> {type}</span>.
      </div>
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
                  <StageBadge stage={stage.stage} />
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
