import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import { describe, expect, it } from 'vitest'
import {
  getPrivacyTrustedSetup,
  toTrustedSetupSummaryValue,
} from './getPrivacyTrustedSetup'

describe(getPrivacyTrustedSetup.name, () => {
  const proofSystem: ZkCatalogTag = {
    id: 'proof-system-id',
    type: 'STARK',
    name: 'Proof system',
    description: 'Proof system description.',
  }

  it('returns the first trusted setup without the proof system', () => {
    const trustedSetup: TrustedSetup = {
      id: 'trusted-setup-id',
      name: 'Trusted setup name',
      risk: 'green',
      shortDescription: 'Trusted setup description.',
      longDescription: 'Long trusted setup description.',
    }

    expect(getPrivacyTrustedSetup([{ ...trustedSetup, proofSystem }])).toEqual(
      trustedSetup,
    )
  })

  it('falls back to No setup when there are no trusted setups', () => {
    const trustedSetup = getPrivacyTrustedSetup([])
    expect(trustedSetup.id).toBe('NoSetup')
    expect(trustedSetup.name).toBe('No setup')
    expect(trustedSetup.risk).toBe('None')
  })
})

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
      risk: 'green',
    })
  })

  it('falls back to the trusted setup name without a participant count', () => {
    expect(
      toTrustedSetupSummaryValue({
        ...trustedSetup,
        participantCount: undefined,
      }).value,
    ).toBe('Trusted setup name')
  })

  for (const [risk, sentiment] of [
    ['green', 'good'],
    ['yellow', 'warning'],
    ['red', 'bad'],
    ['N/A', 'neutral'],
    ['None', 'neutral'],
  ] as const) {
    it(`maps ${risk} risk to ${sentiment} sentiment`, () => {
      expect(
        toTrustedSetupSummaryValue({ ...trustedSetup, risk }).sentiment,
      ).toEqual(sentiment)
    })
  }
})
