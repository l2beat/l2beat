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
  getStepAdversaries,
  getUncoveredAdversaries,
} from '~/pages/privacy/adviceUi'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { PrivacyWaitDraw } from './PrivacyWaitDraw'

export interface PrivacyAdviceSectionProps extends ProjectSectionProps {
  steps: PrivacyAdviceStep[]
  /** In rosette order, which the labels under each step keep. */
  adversaries: PrivacyAdversary[]
  /** Each adversary cell's colour, so a step's links match the rosette. */
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>
  /** The window the anonymity set counts, which a random wait is drawn from. */
  waitWindowDays: number
}

/** The advice of every adversary cell, as steps in the order the user takes them. */
export function PrivacyAdviceSection({
  steps,
  adversaries,
  sentiments,
  waitWindowDays,
  ...sectionProps
}: PrivacyAdviceSectionProps) {
  const uncovered = getUncoveredAdversaries(steps, adversaries, sentiments)
  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col items-start gap-y-1.5">
        <p className="text-paragraph-15 md:text-paragraph-16">{ADVICE.intro}</p>
        <CustomLink href={ADVICE.methodologyHref} className="text-paragraph-13">
          {ADVICE.methodologyLink}
        </CustomLink>
      </div>
      <ol className="mt-6 flex flex-col">
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
              <span className="mt-1 w-0.5 grow rounded-full bg-surface-tertiary group-last:hidden" />
            </div>
            {/* The adversaries qualify the advice, so they follow it rather than compete with the step name. */}
            <div className="flex min-w-0 grow flex-col pb-7 group-last:pb-0">
              <span className="flex min-h-6 flex-wrap items-center gap-x-2 font-bold text-label-value-16 md:text-label-value-18">
                {step.name}
                {step.outside && (
                  <span className="rounded-sm border border-divider px-1.5 py-0.5 font-normal text-2xs text-secondary leading-none dark:border-secondary/40">
                    {ADVICE.outsideLabel}
                  </span>
                )}
              </span>
              <div className="mt-2 text-paragraph-15 md:text-paragraph-16 [&_code]:box-decoration-clone [&_code]:text-[0.875em] [&_code]:[overflow-wrap:anywhere]">
                <Markdown inline>{step.text}</Markdown>
                {step.randomWait && (
                  <PrivacyWaitDraw windowDays={waitWindowDays} />
                )}
              </div>
              <div className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 text-paragraph-13">
                <span className="text-secondary">{ADVICE.againstLabel}:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {getStepAdversaries(step, adversaries).map((adversary) => (
                    <AdversaryLink
                      key={adversary.id}
                      adversary={adversary}
                      sentiment={sentiments[adversary.id]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {uncovered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-divider border-t pt-4 text-paragraph-15 md:text-paragraph-16">
          <span className="font-medium">{ADVICE.uncoveredLabel}:</span>
          {uncovered.map((adversary) => (
            <AdversaryLink
              key={adversary.id}
              adversary={adversary}
              sentiment={sentiments[adversary.id]}
            />
          ))}
        </div>
      )}
    </ProjectSection>
  )
}

/** Jumps to the adversary's block, coloured like its rosette slice. */
function AdversaryLink({
  adversary,
  sentiment,
}: {
  adversary: PrivacyAdversary
  sentiment: PrivacyAdversarySentiment
}) {
  return (
    <CustomLink
      href={`#${getPrivacyAdversaryBlockId(adversary.id)}`}
      // Repeated metadata: underlining every name is noise, colour says link.
      underline={false}
      className="inline-flex items-center gap-1.5 hover:underline focus-visible:underline"
    >
      <PrivacySentimentDot sentiment={sentiment} className="size-2.5!" />
      {adversary.label.toLowerCase()}
    </CustomLink>
  )
}
