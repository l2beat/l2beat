import { expect } from 'earl'

import { getAltDaStage } from './getAltDaStage'

describe(getAltDaStage.name, () => {
  it('should return stage object', () => {
    const result = getAltDaStage(
      {
        stage0: {
          callsItselfValidiumOrOptimium: true,
          stateRootsPostedToL1: true,
          stateVerificationOnL1: true,
          daAttestedByIndependentParty: true,
          nodeSourceAvailable: true,
          fraudProofSystemAtLeast5Outsiders: true,
        },
        stage1: {
          principle: true,
          usersCanExitWithoutCooperation: true,
          usersHave7DaysToExit: true,
          securityCouncilProperlySetUp: true,
          daVerifierSecureOnL1: true,
          daVerifier7DayExitWindow: true,
          daCommitteeDecentralized: true,
          noRedTrustedSetups: true,
          proverSourcePublished: true,
          verifierContractsReproducible: true,
          programHashesReproducible: true,
        },
      },
      {
        nodeSourceLink: 'nodelink',
        daVerifierLink: 'daverifierlink',
        additionalConsiderations: {
          short: 'short notice',
          long: 'long notice',
        },
      },
    )
    expect(result.stage).toEqual('Stage 1')
    expect(result.missing).toEqual(undefined)
    expect(result.summary.map((s) => s.stage)).toEqual(['Stage 0', 'Stage 1'])
    expect(result.additionalConsiderations).toEqual({
      short: 'short notice',
      long: 'long notice',
    })
    const stage0Summary = result.summary.find((s) => s.stage === 'Stage 0')
    expect(
      stage0Summary?.requirements.some((r) =>
        r.description.includes('[View code](nodelink)'),
      ),
    ).toEqual(true)
    const stage1Summary = result.summary.find((s) => s.stage === 'Stage 1')
    expect(
      stage1Summary?.requirements.some((r) =>
        r.description.includes('[View code](daverifierlink)'),
      ),
    ).toEqual(true)
  })

  it('should throw error if no node source link is present and nodeSourceAvailable is satisfied', () => {
    expect(() =>
      getAltDaStage({
        stage0: {
          callsItselfValidiumOrOptimium: true,
          stateRootsPostedToL1: true,
          stateVerificationOnL1: true,
          daAttestedByIndependentParty: true,
          nodeSourceAvailable: true,
          fraudProofSystemAtLeast5Outsiders: true,
        },
        stage1: {
          principle: true,
          usersCanExitWithoutCooperation: true,
          usersHave7DaysToExit: true,
          securityCouncilProperlySetUp: true,
          daVerifierSecureOnL1: true,
          daVerifier7DayExitWindow: true,
          daCommitteeDecentralized: true,
          noRedTrustedSetups: true,
          proverSourcePublished: true,
          verifierContractsReproducible: true,
          programHashesReproducible: true,
        },
      }),
    ).toThrow('Node source link is required')
  })

  it('should allow null for fraud proof items on ZK validity systems', () => {
    const result = getAltDaStage(
      {
        stage0: {
          callsItselfValidiumOrOptimium: true,
          stateRootsPostedToL1: true,
          stateVerificationOnL1: true,
          daAttestedByIndependentParty: true,
          nodeSourceAvailable: true,
          fraudProofSystemAtLeast5Outsiders: null,
        },
        stage1: {
          principle: true,
          usersCanExitWithoutCooperation: true,
          usersHave7DaysToExit: true,
          securityCouncilProperlySetUp: true,
          daVerifierSecureOnL1: true,
          daVerifier7DayExitWindow: true,
          daCommitteeDecentralized: true,
          noRedTrustedSetups: true,
          proverSourcePublished: true,
          verifierContractsReproducible: true,
          programHashesReproducible: true,
        },
      },
      { nodeSourceLink: 'nodelink' },
    )
    expect(result.stage).toEqual('Stage 1')
  })
})
