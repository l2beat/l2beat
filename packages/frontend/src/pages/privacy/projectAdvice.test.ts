import type { PrivacyAdversary, PrivacyAdviceStep } from '@l2beat/config'
import { expect } from 'earl'
import {
  getAdviceStepId,
  getStepsAgainst,
  getUncoveredAdversaries,
} from './projectAdvice'

const ADVERSARIES = (
  ['publicObserver', 'chainAnalyst', 'privilegedInsider'] as const
).map((id) => ({ id, label: id }) as PrivacyAdversary)

const STEPS: PrivacyAdviceStep[] = [
  { name: 'Set up', text: 'a', against: ['chainAnalyst'] },
  { name: 'Exit', text: 'b', against: ['publicObserver', 'chainAnalyst'] },
]

describe('projectAdvice', () => {
  describe(getUncoveredAdversaries.name, () => {
    it('lists cells that are not green and that no step defends', () => {
      const uncovered = getUncoveredAdversaries(STEPS, ADVERSARIES, {
        publicObserver: 'good',
        chainAnalyst: 'warning',
        networkObserver: 'good',
        privilegedInsider: 'bad',
        futureAdversary: 'bad',
      })
      // futureAdversary is not among the adversaries passed in
      expect(uncovered.map((a) => a.id)).toEqual(['privilegedInsider'])
    })

    it('leaves out a green cell without steps', () => {
      const uncovered = getUncoveredAdversaries([], ADVERSARIES, {
        publicObserver: 'good',
        chainAnalyst: 'good',
        networkObserver: 'good',
        privilegedInsider: 'good',
        futureAdversary: 'good',
      })
      expect(uncovered).toEqual([])
    })
  })

  describe(getStepsAgainst.name, () => {
    it('keeps each step with its position in the list', () => {
      expect(
        getStepsAgainst(STEPS, 'publicObserver').map(
          ({ step, index }) => `${index} ${step.name}`,
        ),
      ).toEqual(['1 Exit'])
      expect(getStepsAgainst(STEPS, 'chainAnalyst').length).toEqual(2)
    })

    it('returns nothing for a project without advice', () => {
      expect(getStepsAgainst(undefined, 'chainAnalyst')).toEqual([])
    })
  })

  it('numbers step anchors from one, like the list', () => {
    expect(getAdviceStepId(0)).toEqual('stay-private-1')
  })
})
