import type {
  PrivacyAdversarySentiment,
  PrivacyComplianceRequirement,
  PrivacyDisclosureTool,
  PrivacySource,
  ProjectPrivacyCompliance,
} from '@l2beat/config'
import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import { GrissiniStick } from '~/components/rosette/grissini/GrissiniStick'
import { MissingIcon } from '~/icons/Missing'
import { SatisfiedIcon } from '~/icons/Satisfied'
import { COMPLIANCE, getComplianceIntro } from '~/pages/privacy/complianceUi'
import { cn } from '~/utils/cn'
import { sentimentToTransparentBgColor } from '~/utils/sentiment'
import { ProjectSection } from '../ProjectSection'
import { Subsection, SubsectionHeading } from '../Subsection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyComplianceSectionProps extends ProjectSectionProps {
  /** Sources already resolved to urls, see resolveComplianceSources. */
  compliance: ProjectPrivacyCompliance
  /** The app the rating covers, as the summary names it. */
  referenceAppLabel?: string
}

interface Rung {
  key: number
  label: string
  description: string
}

export function PrivacyComplianceSection({
  compliance,
  referenceAppLabel,
  ...sectionProps
}: PrivacyComplianceSectionProps) {
  const { disclosure, disclosureLevels } = compliance
  const disclosureLevel = disclosure
    ? disclosureLevels.find((level) => level.level === disclosure.level)
    : undefined
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-13 text-secondary md:text-paragraph-14">
        {getComplianceIntro(referenceAppLabel)}
      </p>
      <Markdown className="mt-2 text-paragraph-15 md:text-paragraph-16">
        {compliance.description}
      </Markdown>
      {/* The three ladders are the reading, side by side on equal footing. */}
      <div className="mt-6 flex flex-col max-md:divide-y max-md:divide-divider md:gap-8">
        <div className="grid max-md:divide-y max-md:divide-divider max-md:pb-6 md:grid-cols-3 md:gap-6">
          {compliance.ladders.map((ladder) => (
            <Block key={ladder.id} title={ladder.label}>
              <Ladder
                rungs={ladder.rungs.map((rung) => ({
                  key: rung.rung,
                  ...rung,
                }))}
                filled={ladder.rung}
                sentiment={ladder.sentiment}
              >
                {ladder.power && (
                  <>
                    {ladder.power.text}{' '}
                    <Sources sources={ladder.power.sources} />
                  </>
                )}
              </Ladder>
            </Block>
          ))}
          <Block title={COMPLIANCE.disclosureLabel}>
            <Ladder
              rungs={disclosureLevels.map((level) => ({
                key: level.level,
                ...level,
              }))}
              filled={disclosureLevel?.level}
              sentiment={disclosureLevel?.sentiment}
            >
              {disclosure && <DisclosureTool tool={disclosure} />}
            </Ladder>
            {/* Below the ladder, so the three ladders keep their rungs level. */}
            {!disclosure && (
              <p className="mt-2 text-paragraph-13">
                {COMPLIANCE.noDisclosure}
              </p>
            )}
          </Block>
        </div>
        <Block title={COMPLIANCE.requirementsLabel}>
          <Requirements requirements={compliance.requirements} />
        </Block>
      </div>
    </ProjectSection>
  )
}

/** One cell of the grid; on phones the cells stack between dividers. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-md:py-6 max-md:last:pb-0 max-md:first:pt-0">
      <Subsection
        title={
          <SubsectionHeading className="mb-3 font-semibold text-heading-16 leading-6 md:text-heading-18">
            {title}
          </SubsectionHeading>
        }
      >
        {children}
      </Subsection>
    </div>
  )
}

function Ladder({
  rungs,
  filled,
  sentiment,
  children,
}: {
  rungs: Rung[]
  /** The rung reached, if any. */
  filled: number | undefined
  sentiment: PrivacyAdversarySentiment | undefined
  /** What puts the ladder on the filled rung, shown inside it. */
  children?: ReactNode
}) {
  return (
    <ol className="flex flex-col gap-1">
      {rungs.map((rung) => {
        const isFilled = rung.key === filled && sentiment !== undefined
        return (
          <li
            key={rung.key}
            aria-current={isFilled ? 'true' : undefined}
            className={cn(
              'flex items-stretch rounded-lg',
              isFilled && sentimentToTransparentBgColor(sentiment),
            )}
          >
            <GrissiniStick
              sentiment={sentiment ?? 'neutral'}
              className={cn(
                'h-auto w-1 shrink-0 rounded-r-none',
                !isFilled && 'invisible',
              )}
            />
            <div className="flex min-w-0 grow gap-2.5 py-1.5 pr-3 pl-2">
              <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-tertiary font-bold text-label-value-12 text-primary">
                {rung.key}
              </span>
              <div className="min-w-0">
                <Tooltip>
                  <TooltipTrigger
                    className={cn(
                      'text-left text-paragraph-14',
                      isFilled && 'font-bold',
                    )}
                  >
                    {rung.label}
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[320px]">
                    {rung.description}
                  </TooltipContent>
                </Tooltip>
                {isFilled && children && (
                  <div className="mt-0.5 text-paragraph-13">{children}</div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function DisclosureTool({ tool }: { tool: PrivacyDisclosureTool }) {
  return (
    <>
      <p>
        {tool.text} <Sources sources={tool.sources} />
      </p>
      <ul className="mt-1 flex flex-col gap-0.5">
        <Check
          met={tool.verifiableWithoutOperator}
          label={
            tool.verifiableWithoutOperator
              ? COMPLIANCE.verifiableWithoutOperator
              : COMPLIANCE.notVerifiableWithoutOperator
          }
        />
        <Check
          met={tool.singleVerifier}
          label={
            tool.singleVerifier
              ? COMPLIANCE.singleVerifier
              : COMPLIANCE.notSingleVerifier
          }
        />
      </ul>
    </>
  )
}

/** Met first, like the stage requirements. */
function Requirements({
  requirements,
}: {
  requirements: PrivacyComplianceRequirement[]
}) {
  const sorted = [
    ...requirements.filter((requirement) => requirement.met),
    ...requirements.filter((requirement) => !requirement.met),
  ]
  return (
    // Two columns read top to bottom, so the met ones stay together.
    <ul className="grid gap-y-1.5 md:grid-flow-col md:grid-rows-4 md:gap-x-6">
      {sorted.map((requirement) => (
        <Check
          key={requirement.id}
          met={requirement.met}
          label={requirement.label}
          className="text-paragraph-14"
        />
      ))}
    </ul>
  )
}

function Check({
  met,
  label,
  className,
}: {
  met: boolean
  label: string
  className?: string
}) {
  return (
    <li className={cn('flex gap-2', className)}>
      {met ? (
        <SatisfiedIcon className="relative top-0.5 size-4 shrink-0 fill-positive" />
      ) : (
        <MissingIcon className="relative top-0.5 size-4 shrink-0 fill-negative" />
      )}
      <span>
        {label}
        <span className="sr-only">{met ? ' (yes)' : ' (no)'}</span>
      </span>
    </li>
  )
}

function Sources({ sources }: { sources: PrivacySource[] }) {
  const links = sources.flatMap((source) => ('url' in source ? [source] : []))
  return links.map((source, i) => (
    <span key={source.url}>
      {i > 0 && ', '}
      <CustomLink href={source.url}>{source.title}</CustomLink>
    </span>
  ))
}
