import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { expect } from 'earl'
import {
  ACCEPT_ALL,
  type AdviceAccepts,
  getAdviceEffortCosts,
  getAdvicePath,
} from './advicePaths'

// Method: one pool-shaped advice with a setup step outside the app, a random
// wait and an exit, walked with each effort refused. The assertions are on
// what a path keeps, which positions it shows and which ratings it stops
// claiming.

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

function path(accepts: Partial<AdviceAccepts> = {}, steps = STEPS) {
  return getAdvicePath(
    steps,
    { ...ACCEPT_ALL, ...accepts },
    ADVERSARIES,
    SENTIMENTS,
  )
}

function statuses(accepts: Partial<AdviceAccepts> = {}) {
  return Object.fromEntries(
    path(accepts).adversaries.map((row) => [row.adversary.id, row.status]),
  )
}

describe('advicePaths', () => {
  describe(getAdvicePath.name, () => {
    it('keeps every step when every effort is accepted, and every rating holds', () => {
      const result = path()
      expect(result.taken.map((step) => step.name)).toEqual([
        'Set up',
        'Deposit',
        'Wait',
        'Exit',
      ])
      expect(result.skipped).toEqual([])
      expect(statuses()).toEqual({
        publicObserver: 'rated',
        chainAnalyst: 'rated',
        networkObserver: 'rated',
        privilegedInsider: 'rated',
        futureAdversary: 'no-step',
      })
    })

    it('leaves the wait out for a user who cannot wait, and stops rating the chain analyst', () => {
      const result = path({ wait: false })
      expect(result.skipped.map((step) => step.name)).toEqual(['Wait'])
      expect(statuses({ wait: false }).chainAnalyst).toEqual('unrated')
      expect(statuses({ wait: false }).networkObserver).toEqual('rated')
    })

    it('leaves the outside steps out for a user who sets up nothing, and stops rating what they defended', () => {
      const result = path({ outside: false })
      expect(result.skipped.map((step) => step.name)).toEqual(['Set up'])
      expect(statuses({ outside: false })).toEqual({
        publicObserver: 'rated',
        chainAnalyst: 'rated',
        networkObserver: 'unrated',
        privilegedInsider: 'unrated',
        futureAdversary: 'no-step',
      })
    })

    it('leaves both out when both efforts are refused', () => {
      const result = path({ wait: false, outside: false })
      expect(result.taken.map((step) => step.name)).toEqual(['Deposit', 'Exit'])
    })

    it('numbers the steps of the path, not of the full advice', () => {
      const publicObserver = path({ outside: false }).adversaries[0]
      expect(publicObserver).toEqual({
        adversary: ADVERSARIES[0] as PrivacyAdversary,
        sentiment: 'good',
        status: 'rated',
        steps: [3],
      })
    })

    it('names the skipped steps a rating assumes', () => {
      const chainAnalyst = path({ wait: false }).adversaries[1]
      expect(chainAnalyst).toEqual({
        adversary: ADVERSARIES[1] as PrivacyAdversary,
        sentiment: 'good',
        status: 'unrated',
        skipped: ['Wait'],
      })
    })
  })

  describe(getAdviceEffortCosts.name, () => {
    it('says for each effort which steps go and which ratings stop holding', () => {
      const costs = getAdviceEffortCosts(STEPS, ADVERSARIES, SENTIMENTS)
      expect(
        costs.map((cost) => ({
          effort: cost.effort.id,
          skipped: cost.skipped,
          unrated: cost.unrated.map((a) => a.id),
        })),
      ).toEqual([
        { effort: 'wait', skipped: ['Wait'], unrated: ['chainAnalyst'] },
        {
          effort: 'outside',
          skipped: ['Set up'],
          unrated: ['networkObserver', 'privilegedInsider'],
        },
      ])
    })

    it('omits an effort the advice never asks for', () => {
      const costs = getAdviceEffortCosts(
        STEPS.filter((step) => !step.randomWait),
        ADVERSARIES,
        SENTIMENTS,
      )
      expect(costs.map((cost) => cost.effort.id)).toEqual(['outside'])
    })
  })
})
