import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { ADVICE } from '~/pages/privacy/adviceUi'
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
  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-paragraph-15 md:text-paragraph-16">{ADVICE.intro}</p>
        <CustomLink href={ADVICE.methodologyHref} className="text-paragraph-13">
          {ADVICE.methodologyLink}
        </CustomLink>
      </div>
      <ol className="mt-4 flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={step.name} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary font-bold text-label-12">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1">
              <div className="text-paragraph-15 md:text-paragraph-16">
                <span className="font-bold">{step.name}. </span>
                <Markdown inline>{step.text}</Markdown>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-paragraph-13">
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
            </div>
          </li>
        ))}
      </ol>
    </ProjectSection>
  )
}
