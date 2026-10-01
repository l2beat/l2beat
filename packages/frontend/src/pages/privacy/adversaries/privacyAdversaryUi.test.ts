import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
} from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesScore,
  getPrivacyAdversariesTableValue,
  getPrivacyAdversaryGist,
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
      description: '',
      value: '',
      sentiment,
      exposure: '',
      alsoExposed: [],
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

describe(getPrivacyAdversaryTitle.name, () => {
  it('prefixes the label in lower case', () => {
    expect(getPrivacyAdversaryTitle('Public observer')).toEqual(
      'Against public observer',
    )
  })
})

describe(getPrivacyAdversaryGist.name, () => {
  it('keeps the first sentence', () => {
    expect(
      getPrivacyAdversaryGist(
        'Commitments use a Pedersen hash on an elliptic curve. A quantum computer could test them.',
      ),
    ).toEqual('Commitments use a Pedersen hash on an elliptic curve.')
  })

  it('does not split on decimals or abbreviations', () => {
    expect(
      getPrivacyAdversaryGist(
        'The 0.1 ETH pool, e.g. its relayer, sees it. Nothing else.',
      ),
    ).toEqual('The 0.1 ETH pool, e.g. its relayer, sees it.')
  })

  it('returns a single sentence whole', () => {
    expect(getPrivacyAdversaryGist('Only the amount is hidden.')).toEqual(
      'Only the amount is hidden.',
    )
  })
})

describe(getPrivacyAdversariesScore.name, () => {
  const score = (...s: PrivacyAdversarySentiment[]) =>
    getPrivacyAdversariesScore(summary(...s))

  it('gives green two points and yellow one', () => {
    expect(score('good', 'good', 'good', 'good', 'good')).toEqual(10)
    expect(
      score('warning', 'warning', 'warning', 'warning', 'warning'),
    ).toEqual(5)
    expect(score('bad', 'bad', 'bad', 'bad', 'bad')).toEqual(0)
  })

  it('counts the future adversary, unlike the folded value', () => {
    expect(score('good', 'good', 'good', 'good', 'bad')).toEqual(8)
    expect(score('good', 'good', 'good', 'good', 'good')).toEqual(10)
  })

  it('ranks a protocol with more green above one with more yellow', () => {
    expect(score('good', 'good', 'bad', 'bad', 'bad')).toBeGreaterThan(
      score('warning', 'warning', 'warning', 'bad', 'bad'),
    )
  })
})
