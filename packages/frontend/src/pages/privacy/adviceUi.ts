import type { PrivacyAdversary, PrivacyAdviceStep } from '@l2beat/config'
import { PRIVACY_ADVICE_HREF, PRIVACY_ADVICE_TITLE } from './methodology/paths'

/**
 * Copy shared by the project page, the How to stay private guide and their
 * markdown alternates. Only those pages import this on the client.
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

/** The adversaries one step defends, in rosette order. */
export function getStepAdversaries(
  step: PrivacyAdviceStep,
  adversaries: PrivacyAdversary[],
): PrivacyAdversary[] {
  return adversaries.filter((adversary) => step.against.includes(adversary.id))
}

/** Under the draw button: the range the wait comes from. */
export function getWaitNote(windowDays: number): string {
  return `Random between 0 and ${windowDays} days, the anonymity set's window.`
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
