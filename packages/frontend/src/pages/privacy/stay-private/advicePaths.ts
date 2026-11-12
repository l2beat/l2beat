import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'

/**
 * What a user can ask the guide for. Each goal only leaves steps out of the
 * project's advice, chosen by a flag the step already carries, so a path never
 * says anything the advice does not. The ratings assume every step, so a goal
 * that leaves one out is never presented as rated.
 */
export const ADVICE_GOAL_IDS = ['private', 'fast', 'light', 'operator'] as const
export type AdviceGoalId = (typeof ADVICE_GOAL_IDS)[number]

export interface AdviceGoal {
  id: AdviceGoalId
  label: string
  description: string
  /** Absent for goals that keep every step. */
  shortcut?: {
    skips: (step: PrivacyAdviceStep) => boolean
    /** What leaving those steps out gives up. */
    cost: string
  }
  /** The adversary the goal is about, shown first. */
  focus?: PrivacyAdversaryId
}

export const ADVICE_GOALS: Record<AdviceGoalId, AdviceGoal> = {
  private: {
    id: 'private',
    label: 'Most private',
    description: 'Every step, in order. Our ratings assume all of them.',
  },
  fast: {
    id: 'fast',
    label: 'Fastest',
    description:
      'Leaves out the random wait, so you exit as soon as you are ready.',
    shortcut: {
      skips: (step) => step.randomWait === true,
      cost: 'Exiting soon after depositing lets timing narrow down which deposit is yours.',
    },
  },
  light: {
    id: 'light',
    label: 'Least setup',
    description:
      'Leaves out the steps that need something the reference app does not ship.',
    shortcut: {
      skips: (step) => step.outside === true,
      cost: 'Without them you rely on the defaults of the app and of your network.',
    },
  },
  operator: {
    id: 'operator',
    label: 'Least trust in the operator',
    description:
      'Every step, with what the operator can see or change put first.',
    focus: 'privilegedInsider',
  },
}

export const DEFAULT_ADVICE_GOAL: AdviceGoalId = 'private'

export function isAdviceGoalId(value: unknown): value is AdviceGoalId {
  return ADVICE_GOAL_IDS.includes(value as AdviceGoalId)
}

export interface AdvicePath {
  taken: PrivacyAdviceStep[]
  skipped: PrivacyAdviceStep[]
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

export function getAdvicePath(
  steps: PrivacyAdviceStep[],
  goal: AdviceGoal,
  adversaries: PrivacyAdversary[],
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>,
): AdvicePath {
  const skips = goal.shortcut?.skips ?? (() => false)
  const taken = steps.filter((step) => !skips(step))
  const skipped = steps.filter(skips)
  return {
    taken,
    skipped,
    adversaries: orderByFocus(adversaries, goal.focus).map(
      (adversary): AdvicePathAdversary => {
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
      },
    ),
  }
}

/**
 * The trade-offs between goals for one protocol: what each leaves out and
 * which ratings stop holding. Goals that leave out nothing match the full path.
 */
export interface AdviceGoalComparison {
  goal: AdviceGoal
  stepCount: number
  skipped: string[]
  waits: boolean
  outsideCount: number
  unrated: PrivacyAdversary[]
}

export function compareAdviceGoals(
  steps: PrivacyAdviceStep[],
  adversaries: PrivacyAdversary[],
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>,
): AdviceGoalComparison[] {
  return ADVICE_GOAL_IDS.map((id) => {
    const goal = ADVICE_GOALS[id]
    const path = getAdvicePath(steps, goal, adversaries, sentiments)
    return {
      goal,
      stepCount: path.taken.length,
      skipped: path.skipped.map((step) => step.name),
      waits: path.taken.some((step) => step.randomWait),
      outsideCount: path.taken.filter((step) => step.outside).length,
      unrated: path.adversaries
        .filter((row) => row.status === 'unrated')
        .map((row) => row.adversary),
    }
  })
}

function namesAgainst(steps: PrivacyAdviceStep[], id: PrivacyAdversaryId) {
  return steps
    .filter((step) => step.against.includes(id))
    .map((step) => step.name)
}

function orderByFocus(
  adversaries: PrivacyAdversary[],
  focus: PrivacyAdversaryId | undefined,
) {
  if (focus === undefined) return adversaries
  return [
    ...adversaries.filter((a) => a.id === focus),
    ...adversaries.filter((a) => a.id !== focus),
  ]
}
