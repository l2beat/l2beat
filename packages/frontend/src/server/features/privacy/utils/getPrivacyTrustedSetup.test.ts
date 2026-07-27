import type { TrustedSetup } from '@l2beat/config'
import { expect } from 'earl'
import { toTrustedSetupSummaryValue } from './getPrivacyTrustedSetup'

describe(toTrustedSetupSummaryValue.name, () => {
  const trustedSetup: TrustedSetup = {
    id: 'trusted-setup-id',
    name: 'Trusted setup name',
    risk: 'green',
    shortDescription: 'Trusted setup description.',
    longDescription: 'Long trusted setup description.',
    participantCount: 123,
  }

  it('formats the trusted setup as a privacy summary value', () => {
    expect(toTrustedSetupSummaryValue(trustedSetup)).toEqual({
      value: '123 participants',
      sentiment: 'good',
      description: 'Trusted setup name: Trusted setup description.',
    })
  })

  it('falls back to the trusted setup name without a participant count', () => {
    expect(
      toTrustedSetupSummaryValue({
        ...trustedSetup,
        participantCount: undefined,
      }).value,
    ).toEqual('Trusted setup name')
  })

  for (const [risk, sentiment] of [
    ['green', 'good'],
    ['yellow', 'warning'],
    ['red', 'bad'],
    ['N/A', 'neutral'],
  ] as const) {
    it(`maps ${risk} risk to ${sentiment} sentiment`, () => {
      expect(
        toTrustedSetupSummaryValue({ ...trustedSetup, risk }).sentiment,
      ).toEqual(sentiment)
    })
  }
})
