import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import {
  ADVICE,
  getAdviceStepId,
  getUncoveredAdversaries,
} from '~/pages/privacy/adviceUi'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAdviceSectionProps extends ProjectSectionProps {
  steps: PrivacyAdviceStep[]
  /** In rosette order, which the labels under each step keep. */
  adversaries: PrivacyAdversary[]
  /** Each adversary cell's colour, so a step's links match the rosette. */
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>
}

/** The advice of every adversary cell, as steps in the order the user takes them. */
export function PrivacyAdviceSection({
  steps,
  adversaries,
  sentiments,
  ...sectionProps
}: PrivacyAdviceSectionProps) {
  const uncovered = getUncoveredAdversaries(steps, adversaries, sentiments)
  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-paragraph-15 md:text-paragraph-16">{ADVICE.intro}</p>
        <CustomLink href={ADVICE.methodologyHref} className="text-paragraph-13">
          {ADVICE.methodologyLink}
        </CustomLink>
      </div>
      <ol className="mt-4 flex flex-col">
        {steps.map((step, i) => (
          <li
            key={step.name}
            id={getAdviceStepId(i)}
            className="group flex scroll-mt-section-nav-card gap-3"
          >
            {/* The number, with a rail down to the next step. */}
            <div className="flex flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary font-bold text-label-12">
                {i + 1}
              </span>
              <span className="mt-1 w-px grow bg-divider group-last:hidden" />
            </div>
            {/* Desktop: name and adversaries share a row. Mobile: adversaries follow the text. */}
            <div className="flex min-w-0 grow flex-col gap-1 pb-5 group-last:pb-0 md:grid md:grid-cols-[1fr_auto] md:items-baseline md:gap-x-4">
              <span className="flex flex-wrap items-center gap-x-2 font-bold text-paragraph-15 md:text-paragraph-16">
                {step.name}
                {step.outside && (
                  <span className="rounded-sm border border-divider px-1.5 py-0.5 font-normal text-2xs text-secondary leading-none">
                    {ADVICE.outsideLabel}
                  </span>
                )}
              </span>
              <div className="order-last flex flex-wrap items-center gap-x-3 gap-y-1 text-paragraph-13 md:order-none">
                <span className="text-secondary">{ADVICE.againstLabel}:</span>
                {adversaries
                  .filter((adversary) => step.against.includes(adversary.id))
                  .map((adversary) => (
                    <CustomLink
                      key={adversary.id}
                      href={`#${getPrivacyAdversaryBlockId(adversary.id)}`}
                      className="inline-flex items-center gap-1"
                    >
                      <PrivacySentimentDot
                        sentiment={sentiments[adversary.id]}
                      />
                      {adversary.label.toLowerCase()}
                    </CustomLink>
                  ))}
              </div>
              <div className="wrap-anywhere text-paragraph-15 md:col-span-2 md:text-paragraph-16">
                <Markdown inline>{step.text}</Markdown>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {uncovered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-divider border-t pt-4 text-paragraph-15 md:text-paragraph-16">
          <span className="font-medium">{ADVICE.uncoveredLabel}:</span>
          {uncovered.map((adversary) => (
            <CustomLink
              key={adversary.id}
              href={`#${getPrivacyAdversaryBlockId(adversary.id)}`}
              className="inline-flex items-center gap-1"
            >
              <PrivacySentimentDot sentiment={sentiments[adversary.id]} />
              {adversary.label.toLowerCase()}
            </CustomLink>
          ))}
        </div>
      )}
    </ProjectSection>
  )
}
