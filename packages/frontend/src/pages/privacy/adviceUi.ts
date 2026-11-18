import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyUsageFlowStep,
} from '@l2beat/config'
import {
  PRIVACY_ADVICE_HREF,
  PRIVACY_ADVICE_TITLE,
  PRIVACY_LEGACY_ADVICE_ANCHOR,
} from './methodology/paths'

/**
 * Copy shared by the project page and its markdown alternate. Only project
 * pages import this on the client, which keeps it in their chunk.
 */
export const ADVICE = {
  sectionId: 'usage-flow',
  title: PRIVACY_ADVICE_TITLE,
  againstLabel: 'Against',
  /** Leads the adversaries whose cell is not green and that no step names. */
  uncoveredLabel: 'No step helps against',
  /** Marks a step that needs something the reference app does not ship. */
  outsideLabel: 'outside the app',
  drawWaitLabel: 'Draw a wait',
  redrawWaitLabel: 'Draw again',
  waitAfterDeposit: 'after the deposit',
  /** Under the control once a wait is drawn. */
  redrawWaitNote: 'Clicking often to get a shorter time reduces privacy.',
  /** Leads the steps an adversary block links. */
  label: 'Assumption',
  methodologyLink: 'Assumptions explained',
  methodologyHref: PRIVACY_ADVICE_HREF,
} as const

/** Leads the section, before the steps. */
export function getAdviceNotice(projectName: string): string {
  return `This is the technical setup of a careful user that our ratings assume, not a recommendation to use ${projectName}.`
}

/**
 * The adversaries the steps leave the promised field exposed or at risk to:
 * a cell that is not green and that no step defends. In rosette order.
 */
export function getUncoveredAdversaries(
  steps: PrivacyUsageFlowStep[],
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
  step: PrivacyUsageFlowStep,
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
  steps: PrivacyUsageFlowStep[] | undefined,
  id: PrivacyAdversaryId,
): { step: PrivacyUsageFlowStep; index: number }[] {
  return (steps ?? [])
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.against.includes(id))
}

/**
 * The new anchor for an old #stay-private or #stay-private-N link, or
 * undefined when the hash is not one of them.
 */
export function getLegacyAdviceHash(hash: string): string | undefined {
  const legacy = `#${PRIVACY_LEGACY_ADVICE_ANCHOR}`
  if (hash !== legacy && !hash.startsWith(`${legacy}-`)) return undefined
  return `#${ADVICE.sectionId}${hash.slice(legacy.length)}`
}

/** Under the draw button: the range the wait comes from. */
export function getWaitNote(windowDays: number): string {
  return `Random between 0 and ${windowDays} days, the anonymity set's window.`
}

/** The markdown alternate cannot draw, so it says where the range comes from. */
export function getWaitInstruction(windowDays: number): string {
  return `The 0–${windowDays} day range is the window the anonymity set counts.`
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
