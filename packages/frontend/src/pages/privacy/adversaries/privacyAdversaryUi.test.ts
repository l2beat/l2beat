import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
} from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesTableValue,
  getPrivacyAdversaryDescription,
  getPrivacyAdversaryRosetteValues,
  getPrivacyAdversaryTitle,
} from './privacyAdversaryUi'

const IDS: PrivacyAdversaryId[] = [
  'publicObserver',
  'chainAnalyst',
  'networkObserver',
  'privilegedInsider',
  'futureAdversary',
]

function summary(
  ...sentiments: PrivacyAdversarySentiment[]
): PrivacyAdversariesSummary {
  return {
    promise: { protects: 'linkage', text: '' },
    promiseLabel: 'Link privacy',
    cells: sentiments.map((sentiment, i) => ({
      id: IDS[i] ?? 'publicObserver',
      label: IDS[i] ?? 'publicObserver',
      value: '',
      sentiment,
      reason: '',
    })),
  }
}

describe(getPrivacyAdversariesTableValue.name, () => {
  const sentiment = (...s: PrivacyAdversarySentiment[]) =>
    getPrivacyAdversariesTableValue(summary(...s)).sentiment

  it('ignores the future adversary', () => {
    expect(sentiment('good', 'good', 'good', 'good', 'bad')).toEqual('good')
  })

  it('is red when any other adversary is red', () => {
    expect(sentiment('good', 'good', 'good', 'bad', 'good')).toEqual('bad')
  })

  it('takes the majority colour', () => {
    expect(sentiment('good', 'warning', 'warning', 'warning', 'good')).toEqual(
      'warning',
    )
    expect(sentiment('good', 'good', 'good', 'warning', 'bad')).toEqual('good')
  })

  it('is green on a tie', () => {
    expect(sentiment('good', 'good', 'warning', 'warning', 'bad')).toEqual(
      'good',
    )
  })

  it('sorts fewer red and yellow cells first within a colour', () => {
    const hint = (...s: PrivacyAdversarySentiment[]) =>
      getPrivacyAdversariesTableValue(summary(...s)).orderHint ?? 0
    expect(hint('good', 'good', 'good', 'good', 'bad')).toEqual(0)
    expect(hint('good', 'warning', 'good', 'good', 'good')).toBeGreaterThan(
      hint('good', 'warning', 'warning', 'good', 'good'),
    )
    expect(hint('good', 'warning', 'warning', 'good', 'good')).toBeGreaterThan(
      hint('good', 'bad', 'good', 'good', 'good'),
    )
  })
})

describe(getPrivacyAdversaryRosetteValues.name, () => {
  it('carries the quantum resistant badge on the slice of its cell only', () => {
    const adversaries = summary('good', 'good', 'good', 'good', 'warning')
    const values = getPrivacyAdversaryRosetteValues({
      ...adversaries,
      cells: adversaries.cells.map((cell) =>
        cell.id === 'futureAdversary'
          ? { ...cell, quantumResistant: true }
          : cell,
      ),
    })
    expect(values.map((value) => value.quantumResistant)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    ])
  })
})

describe(getPrivacyAdversaryTitle.name, () => {
  it('prefixes the label in lower case', () => {
    expect(getPrivacyAdversaryTitle('Public observer')).toEqual(
      'Against public observer',
    )
  })
})

describe(getPrivacyAdversaryDescription.name, () => {
  it('follows the short description with the long one', () => {
    expect(
      getPrivacyAdversaryDescription({
        exposureShort: 'The relayer sees your IP.',
        exposureContinued: 'Tor hides it.',
      }),
    ).toEqual('The relayer sees your IP. Tor hides it.')
  })

  it('is the short description alone when there is no long one', () => {
    expect(
      getPrivacyAdversaryDescription({
        exposureShort: 'The relayer sees your IP.',
      }),
    ).toEqual('The relayer sees your IP.')
  })
})
