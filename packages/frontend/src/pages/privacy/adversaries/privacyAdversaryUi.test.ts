import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
} from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesScore,
  getPrivacyAdversariesSentence,
  getPrivacyAdversariesTableValue,
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
    promiseSubject: 'Link',
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

describe(getPrivacyAdversariesSentence.name, () => {
  const sentence = (...s: PrivacyAdversarySentiment[]) =>
    getPrivacyAdversariesSentence(summary(...s))

  it('counts only the green cells', () => {
    expect(sentence('good', 'good', 'good', 'good', 'warning')).toEqual({
      subject: 'Link',
      held: 4,
      total: 5,
    })
  })

  it('reports zero for a protocol that holds against nobody', () => {
    expect(
      sentence('warning', 'warning', 'warning', 'bad', 'bad').held,
    ).toEqual(0)
  })
})
