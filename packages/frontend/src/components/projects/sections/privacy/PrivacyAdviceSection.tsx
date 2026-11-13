import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { CustomLink } from '~/components/link/CustomLink'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { ADVICE } from '~/pages/privacy/adviceUi'
import {
  getAdviceStepId,
  getUncoveredAdversaries,
} from '~/pages/privacy/projectAdvice'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { PrivacyAdversaryLink, PrivacyAdviceSteps } from './PrivacyAdviceSteps'

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
      <div className="mt-6">
        <PrivacyAdviceSteps
          steps={steps}
          adversaries={adversaries}
          sentiments={sentiments}
          waitWindowDays={waitWindowDays}
          getAdversaryHref={getAdversaryAnchor}
          getStepId={getAdviceStepId}
        />
      </div>
      {uncovered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-divider border-t pt-4 text-paragraph-15 md:text-paragraph-16">
          <span className="font-medium">{ADVICE.uncoveredLabel}:</span>
          {uncovered.map((adversary) => (
            <PrivacyAdversaryLink
              key={adversary.id}
              adversary={adversary}
              href={getAdversaryAnchor(adversary.id)}
              sentiment={sentiments[adversary.id]}
            />
          ))}
        </div>
      )}
    </ProjectSection>
  )
}

function getAdversaryAnchor(id: PrivacyAdversaryId) {
  return `#${getPrivacyAdversaryBlockId(id)}`
}
