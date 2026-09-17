import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
} from '@l2beat/config'
import { expect } from 'earl'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesMergedSentiment,
  getPrivacyAdversaryTitle,
} from './privacyAdversaryUi'

const IDS: PrivacyAdversaryId[] = [
  'publicObserver',
  'chainAnalyst',
  'networkObserver',
  'privilegedInsider',
  'futureAdversary',
]

function cells(
  ...sentiments: PrivacyAdversarySentiment[]
): PrivacyAdversarySummaryCell[] {
  return sentiments.map((sentiment, i) => ({
    id: IDS[i] ?? 'publicObserver',
    label: IDS[i] ?? 'publicObserver',
    description: '',
    value: '',
    sentiment,
    exposure: '',
    alsoExposed: [],
  }))
}

describe(getPrivacyAdversariesMergedSentiment.name, () => {
  it('ignores the future adversary', () => {
    expect(
      getPrivacyAdversariesMergedSentiment(
        cells('good', 'good', 'good', 'good', 'bad'),
      ),
    ).toEqual('good')
  })

  it('is red when any other adversary is red', () => {
    expect(
      getPrivacyAdversariesMergedSentiment(
        cells('good', 'good', 'good', 'bad', 'good'),
      ),
    ).toEqual('bad')
  })

  it('takes the majority colour', () => {
    expect(
      getPrivacyAdversariesMergedSentiment(
        cells('good', 'warning', 'warning', 'warning', 'good'),
      ),
    ).toEqual('warning')
    expect(
      getPrivacyAdversariesMergedSentiment(
        cells('good', 'good', 'good', 'warning', 'bad'),
      ),
    ).toEqual('good')
  })

  it('is green on a tie', () => {
    expect(
      getPrivacyAdversariesMergedSentiment(
        cells('good', 'good', 'warning', 'warning', 'bad'),
      ),
    ).toEqual('good')
  })
})

describe(getPrivacyAdversaryTitle.name, () => {
  it('prefixes the label in lower case', () => {
    expect(getPrivacyAdversaryTitle('Public observer')).toEqual(
      'Against public observer',
    )
  })
})
