import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { ADVICE } from './adviceUi'

/**
 * Advice helpers only the project page and its markdown use. Kept out of
 * adviceUi, which the How to stay private guide shares with project pages:
 * the shared modules must stay small enough to merge into a chunk project
 * pages load already (smallSharedChunks, e2e/nav-perf).
 */

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

/** The markdown alternate cannot draw, so it says how to. */
export function getWaitInstruction(windowDays: number): string {
  return `Draw the wait once, at random between 0 and ${windowDays} days, the window the anonymity set counts.`
}
