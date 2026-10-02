import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import { expect } from 'earl'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetup,
  toTrustedSetupSummaryValue,
} from './getPrivacyTrustedSetup'

describe(getPrivacyTrustedSetup.name, () => {
  const proofSystem: ZkCatalogTag = {
    id: 'proof-system-id',
    type: 'STARK',
    name: 'Proof system',
    description: 'Proof system description.',
  }
  const trustedSetup: TrustedSetup = {
    id: 'trusted-setup-id',
    name: 'Trusted setup name',
    risk: 'red',
    shortDescription: 'Trusted setup description.',
    longDescription: 'Long trusted setup description.',
  }

  it('returns the first trusted setup without the proof system, labelled with its participants', () => {
    expect(
      getPrivacyTrustedSetup([
        { ...trustedSetup, participantCount: 123, proofSystem },
      ]),
    ).toEqual({
      ...trustedSetup,
      participantCount: 123,
      label: '123 participants',
    })
  })

  it('leaves a ceremony without a participant count unlabelled', () => {
    expect(
      getPrivacyTrustedSetup([{ ...trustedSetup, proofSystem }]).label,
    ).toEqual(undefined)
  })

  it('names a transparent setup', () => {
    expect(
      getPrivacyTrustedSetup([{ ...trustedSetup, risk: 'N/A', proofSystem }])
        .label,
    ).toEqual('Trusted setup name')
  })

  it('falls back to a named No setup when there are no trusted setups', () => {
    const noSetup = getPrivacyTrustedSetup([])
    expect(noSetup.id).toEqual('NoSetup')
    expect(noSetup.risk).toEqual('None')
    expect(noSetup.label).toEqual('No setup')
  })
})

describe(toTrustedSetupSummaryValue.name, () => {
  const trustedSetup: PrivacyTrustedSetup = {
    id: 'trusted-setup-id',
    name: 'Trusted setup name',
    risk: 'green',
    shortDescription: 'Trusted setup description.',
    longDescription: 'Long trusted setup description.',
    participantCount: 123,
    label: '123 participants',
  }

  it('formats the trusted setup as a privacy summary value', () => {
    expect(toTrustedSetupSummaryValue(trustedSetup)).toEqual({
      value: '123 participants',
      sentiment: 'good',
      description: 'Trusted setup name: Trusted setup description.',
      risk: 'green',
      label: '123 participants',
    })
  })

  it('falls back to the trusted setup name without a label', () => {
    expect(
      toTrustedSetupSummaryValue({ ...trustedSetup, label: undefined }).value,
    ).toEqual('Trusted setup name')
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
