import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { PRIVACY_ADVICE_HREF, PRIVACY_ADVICE_TITLE } from './methodology/paths'

/**
 * Copy shared by the project page and its markdown alternate. Only project
 * pages import this on the client, which keeps it in their chunk.
 */
export const ADVICE = {
  sectionId: 'stay-private',
  title: PRIVACY_ADVICE_TITLE,
  intro:
    'What a careful user does with the reference app, in order. The ratings assume these steps.',
  againstLabel: 'Against',
  /** Leads the adversaries whose cell is not green and that no step names. */
  uncoveredLabel: 'No step helps against',
  /** Marks a step that needs something the reference app does not ship. */
  outsideLabel: 'outside the app',
  drawWaitLabel: 'Draw a wait',
  redrawWaitLabel: 'Draw again',
  waitAfterDeposit: 'after your deposit',
  /** Under the control once a wait is drawn. */
  redrawWaitNote: 'Clicking often to get a shorter time reduces privacy.',
  /** Our word for the steps, as the framework uses it, linking to this section. */
  label: 'Advice',
  methodologyLink: 'Every habit explained',
  methodologyHref: PRIVACY_ADVICE_HREF,
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

/** The adversaries one step defends, in rosette order. */
export function getStepAdversaries(
  step: PrivacyAdviceStep,
  adversaries: PrivacyAdversary[],
): PrivacyAdversary[] {
  return adversaries.filter((adversary) => step.against.includes(adversary.id))
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

/** Under the draw button: the range the wait comes from. */
export function getWaitNote(windowDays: number): string {
  return `Random between 0 and ${windowDays} days, the anonymity set's window.`
}

/** The markdown alternate cannot draw, so it says how to. */
export function getWaitInstruction(windowDays: number): string {
  return `Draw the wait once, at random between 0 and ${windowDays} days, the window the anonymity set counts.`
}

/** "12 days 7 hours", "7 hours", and minutes only under an hour: "42 minutes". */
export function formatWait(minutes: number): string {
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const parts = [
    days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '',
    hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '',
  ].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
}
