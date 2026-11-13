import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'

/**
 * The efforts a user can refuse. A refusal only leaves steps out of the
 * project's advice, chosen by a flag the step already carries, so a path never
 * says anything the advice does not. The ratings assume every step, so a path
 * that leaves one out never shows the rating that step defended.
 */
export const ADVICE_EFFORT_IDS = ['wait', 'outside'] as const
export type AdviceEffortId = (typeof ADVICE_EFFORT_IDS)[number]

export interface AdviceEffort {
  id: AdviceEffortId
  label: (windowDays: number) => string
  description: string
  /** The steps a user who refuses the effort leaves out. */
  skips: (step: PrivacyAdviceStep) => boolean
  /** What leaving those steps out gives up. */
  cost: string
}

export const ADVICE_EFFORTS: Record<AdviceEffortId, AdviceEffort> = {
  wait: {
    id: 'wait',
    label: (windowDays) => `Wait up to ${windowDays} days`,
    description: 'Let a random time pass between entry and exit.',
    skips: (step) => step.randomWait === true,
    cost: 'Exiting soon after entering lets timing pair the two.',
  },
  outside: {
    id: 'outside',
    label: () => 'Set up tools outside the app',
    description: 'Install another program or run a node.',
    skips: (step) => step.outside === true,
    cost: 'Without them you rely on the defaults of the app and of your network.',
  },
}

/** Which efforts the user accepts. All of them gives the full advice. */
export type AdviceAccepts = Record<AdviceEffortId, boolean>

export const ACCEPT_ALL: AdviceAccepts = { wait: true, outside: true }

export function isAdviceEffortId(value: unknown): value is AdviceEffortId {
  return ADVICE_EFFORT_IDS.includes(value as AdviceEffortId)
}

export interface AdvicePath<S extends PrivacyAdviceStep = PrivacyAdviceStep> {
  taken: S[]
  skipped: S[]
  /** One row per adversary, in rosette order. */
  adversaries: AdvicePathAdversary[]
}

export type AdvicePathAdversary = {
  adversary: PrivacyAdversary
  /** The published rating, which assumes every step. */
  sentiment: PrivacyAdversarySentiment
} & (
  | {
      /** Every step that names it is on the path, so the rating holds. */
      status: 'rated'
      /** Positions on the path, 1-based. */
      steps: number[]
    }
  | {
      /** The path leaves out a step the rating assumes. */
      status: 'unrated'
      skipped: string[]
    }
  | {
      /** No step names it: green without help, or nothing the user can do. */
      status: 'no-step'
    }
)

export function getAdvicePath<S extends PrivacyAdviceStep>(
  steps: S[],
  accepts: AdviceAccepts,
  adversaries: PrivacyAdversary[],
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>,
): AdvicePath<S> {
  const skips = (step: S) =>
    ADVICE_EFFORT_IDS.some(
      (id) => !accepts[id] && ADVICE_EFFORTS[id].skips(step),
    )
  const taken = steps.filter((step) => !skips(step))
  const skipped = steps.filter(skips)
  return {
    taken,
    skipped,
    adversaries: adversaries.map((adversary): AdvicePathAdversary => {
      const sentiment = sentiments[adversary.id]
      const skippedNames = namesAgainst(skipped, adversary.id)
      if (skippedNames.length > 0) {
        return {
          adversary,
          sentiment,
          status: 'unrated',
          skipped: skippedNames,
        }
      }
      const onPath = taken
        .map((step, i) => (step.against.includes(adversary.id) ? i + 1 : 0))
        .filter((position) => position > 0)
      return onPath.length > 0
        ? { adversary, sentiment, status: 'rated', steps: onPath }
        : { adversary, sentiment, status: 'no-step' }
    }),
  }
}

/**
 * What refusing each effort alone costs one protocol: the steps left out and
 * the ratings that stop holding. Efforts the advice never asks for are absent.
 */
export interface AdviceEffortCost {
  effort: AdviceEffort
  skipped: string[]
  unrated: PrivacyAdversary[]
}

export function getAdviceEffortCosts(
  steps: PrivacyAdviceStep[],
  adversaries: PrivacyAdversary[],
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>,
): AdviceEffortCost[] {
  return ADVICE_EFFORT_IDS.flatMap((id) => {
    const path = getAdvicePath(
      steps,
      { ...ACCEPT_ALL, [id]: false },
      adversaries,
      sentiments,
    )
    if (path.skipped.length === 0) return []
    return [
      {
        effort: ADVICE_EFFORTS[id],
        skipped: path.skipped.map((step) => step.name),
        unrated: path.adversaries
          .filter((row) => row.status === 'unrated')
          .map((row) => row.adversary),
      },
    ]
  })
}

function namesAgainst(steps: PrivacyAdviceStep[], id: PrivacyAdversaryId) {
  return steps
    .filter((step) => step.against.includes(id))
    .map((step) => step.name)
}
