import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { ADVICE_ANCHORS } from '@l2beat/config/build/common/privacyAdversaries'
import { PRIVACY_METHODOLOGY_PATH } from './methodology/paths'

/** Copy shared by the HTML page and its markdown alternate. */
export const ADVICE = {
  sectionId: 'stay-private',
  title: 'How to stay private',
  intro:
    'What a careful user does with the reference app, in order. The ratings assume these steps.',
  againstLabel: 'Against',
  /** Leads the adversaries whose cell is not green and that no step names. */
  uncoveredLabel: 'No step helps against',
  /** Marks a step that needs something the reference app does not ship. */
  outsideLabel: 'outside the app',
  /** Our word for the steps, as the framework uses it, linking to this section. */
  label: 'Advice',
  methodologyLink: 'Every habit explained',
  methodologyHref: `${PRIVACY_METHODOLOGY_PATH}#${ADVICE_ANCHORS.section}`,
} as const

/**
 * The adversaries the steps leave the promised field exposed or at risk to:
 * a cell that is not green and that no step defends. In rosette order.
 */
export function getUncoveredAdversaries(
  steps: PrivacyAdviceStep[],
  adversaries: PrivacyAdversary[],
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>,
): PrivacyAdversary[] {
  return adversaries.filter(
    (adversary) =>
      sentiments[adversary.id] !== 'good' &&
      !steps.some((step) => step.against.includes(adversary.id)),
  )
}

/** Anchor of one step on the project page, which adversary blocks link. */
export function getAdviceStepId(index: number): string {
  return `${ADVICE.sectionId}-${index + 1}`
}

/** The steps that defend one adversary, with their position in the list. */
export function getStepsAgainst(
  steps: PrivacyAdviceStep[] | undefined,
  id: PrivacyAdversaryId,
): { step: PrivacyAdviceStep; index: number }[] {
  return (steps ?? [])
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.against.includes(id))
}
