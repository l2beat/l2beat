import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { expect } from 'earl'
import {
  ADVICE_GOALS,
  compareAdviceGoals,
  getAdvicePath,
  isAdviceGoalId,
} from './advicePaths'

// Method: one pool-shaped advice with a setup step outside the app, a random
// wait and an exit, checked against each goal. The assertions are on what a
// path keeps, which positions it shows and which ratings it stops claiming.

const ADVERSARIES = (
  [
    'publicObserver',
    'chainAnalyst',
    'networkObserver',
    'privilegedInsider',
    'futureAdversary',
  ] as const
).map((id) => ({ id, label: id }) as PrivacyAdversary)

const SENTIMENTS: Record<PrivacyAdversaryId, PrivacyAdversarySentiment> = {
  publicObserver: 'good',
  chainAnalyst: 'good',
  networkObserver: 'good',
  privilegedInsider: 'warning',
  futureAdversary: 'bad',
}

const STEPS: PrivacyAdviceStep[] = [
  {
    name: 'Set up',
    text: '',
    against: ['networkObserver', 'privilegedInsider'],
    outside: true,
  },
  { name: 'Deposit', text: '', against: ['chainAnalyst'] },
  { name: 'Wait', text: '', against: ['chainAnalyst'], randomWait: true },
  { name: 'Exit', text: '', against: ['publicObserver', 'chainAnalyst'] },
]

function path(goal: keyof typeof ADVICE_GOALS, steps = STEPS) {
  return getAdvicePath(steps, ADVICE_GOALS[goal], ADVERSARIES, SENTIMENTS)
}

function statuses(goal: keyof typeof ADVICE_GOALS, steps = STEPS) {
  return Object.fromEntries(
    path(goal, steps).adversaries.map((row) => [row.adversary.id, row.status]),
  )
}

describe('advicePaths', () => {
  describe(getAdvicePath.name, () => {
    it('keeps every step for the most private path, and every rating holds', () => {
      const result = path('private')
      expect(result.taken.map((step) => step.name)).toEqual([
        'Set up',
        'Deposit',
        'Wait',
        'Exit',
      ])
      expect(result.skipped).toEqual([])
      expect(statuses('private')).toEqual({
        publicObserver: 'rated',
        chainAnalyst: 'rated',
        networkObserver: 'rated',
        privilegedInsider: 'rated',
        futureAdversary: 'no-step',
      })
    })

    it('leaves out the random wait for the fastest path, and stops claiming what it defended', () => {
      const result = path('fast')
      expect(result.skipped.map((step) => step.name)).toEqual(['Wait'])
      // Deposit and Exit still name the chain analyst, but its rating assumed the wait too.
      const analyst = result.adversaries.find(
        (row) => row.adversary.id === 'chainAnalyst',
      )
      expect(analyst).toEqual({
        adversary: ADVERSARIES[1]!,
        sentiment: 'good',
        status: 'unrated',
        skipped: ['Wait'],
      })
      expect(statuses('fast').networkObserver).toEqual('rated')
    })

    it('leaves out the steps outside the app for the least setup path', () => {
      const result = path('light')
      expect(result.skipped.map((step) => step.name)).toEqual(['Set up'])
      expect(statuses('light')).toEqual({
        publicObserver: 'rated',
        chainAnalyst: 'rated',
        networkObserver: 'unrated',
        privilegedInsider: 'unrated',
        futureAdversary: 'no-step',
      })
    })

    it('numbers the steps that defend an adversary by their place on the path', () => {
      const result = path('light')
      const publicObserver = result.adversaries.find(
        (row) => row.adversary.id === 'publicObserver',
      )
      expect(publicObserver).toEqual({
        adversary: ADVERSARIES[0]!,
        sentiment: 'good',
        status: 'rated',
        steps: [3],
      })
    })

    it('puts the operator first for the least trust path, without leaving steps out', () => {
      const result = path('operator')
      expect(result.skipped).toEqual([])
      expect(result.adversaries[0]?.adversary.id).toEqual('privilegedInsider')
      expect(
        result.adversaries.map((row) => row.adversary.id).slice(1),
      ).toEqual([
        'publicObserver',
        'chainAnalyst',
        'networkObserver',
        'futureAdversary',
      ])
    })

    it('matches the full path when the advice has nothing the goal leaves out', () => {
      const noWait = STEPS.filter((step) => !step.randomWait)
      expect(path('fast', noWait)).toEqual(path('private', noWait))
    })
  })

  describe(compareAdviceGoals.name, () => {
    it('says for each goal what it leaves out and which ratings stop holding', () => {
      const rows = compareAdviceGoals(STEPS, ADVERSARIES, SENTIMENTS).map(
        (row) => ({
          goal: row.goal.id,
          stepCount: row.stepCount,
          skipped: row.skipped,
          waits: row.waits,
          outsideCount: row.outsideCount,
          unrated: row.unrated.map((a) => a.id),
        }),
      )
      expect(rows).toEqual([
        {
          goal: 'private',
          stepCount: 4,
          skipped: [],
          waits: true,
          outsideCount: 1,
          unrated: [],
        },
        {
          goal: 'fast',
          stepCount: 3,
          skipped: ['Wait'],
          waits: false,
          outsideCount: 1,
          unrated: ['chainAnalyst'],
        },
        {
          goal: 'light',
          stepCount: 3,
          skipped: ['Set up'],
          waits: true,
          outsideCount: 0,
          unrated: ['networkObserver', 'privilegedInsider'],
        },
        {
          goal: 'operator',
          stepCount: 4,
          skipped: [],
          waits: true,
          outsideCount: 1,
          unrated: [],
        },
      ])
    })
  })

  describe(isAdviceGoalId.name, () => {
    it('accepts only known goals, so a stale link falls back to the default', () => {
      expect(isAdviceGoalId('fast')).toEqual(true)
      expect(isAdviceGoalId('cheapest')).toEqual(false)
      expect(isAdviceGoalId(undefined)).toEqual(false)
    })
  })
})
