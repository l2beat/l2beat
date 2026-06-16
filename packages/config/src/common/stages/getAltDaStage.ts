import { PROJECT_COUNTDOWNS } from '../../global/countdowns'
import {
  type ChecklistTemplate,
  createGetStage,
  isSatisfied,
  type UpcomingStageRequirements,
} from './stage'

interface GetAltDaStageOptions {
  nodeSourceLink?: string
  securityCouncilReference?: string
  stage1PrincipleDescription?: string
  additionalConsiderations?: {
    short: string
    long: string
  }
  proverSourceLink?: string
  daVerifierLink?: string
}
type Blueprint = ReturnType<typeof getBlueprint>
type BlueprintChecklist = ChecklistTemplate<Blueprint>

const UPCOMING_STAGE_REQUIREMENTS: UpcomingStageRequirements = {
  stage1: {
    expiresAt: PROJECT_COUNTDOWNS.stageChanges,
    items: [
      'noRedTrustedSetups',
      'proverSourcePublished',
      'verifierContractsReproducible',
      'programHashesReproducible',
    ],
  },
}

export const getAltDaStage = (
  blueprintChecklist: BlueprintChecklist,
  opts?: GetAltDaStageOptions,
) => {
  const node = isSatisfied(blueprintChecklist.stage0.nodeSourceAvailable)
  if (node === true && !opts?.nodeSourceLink) {
    throw new Error('Node source link is required')
  }

  const blueprint = getBlueprint(opts)

  return {
    ...createGetStage(
      blueprint,
      UPCOMING_STAGE_REQUIREMENTS,
    )(blueprintChecklist),
    additionalConsiderations: opts?.additionalConsiderations,
    stage1PrincipleDescription: opts?.stage1PrincipleDescription,
  }
}

const getBlueprint = (opts?: GetAltDaStageOptions) =>
  ({
    stage0: {
      name: 'Stage 0',
      items: {
        callsItselfValidiumOrOptimium: {
          positive: 'The project self-identifies as a Validium or Optimium.',
          negative:
            'The project does not self-identify as a Validium or Optimium.',
        },
        stateRootsPostedToL1: {
          positive: 'State roots are posted to Ethereum L1.',
          negative: 'State roots are not posted to Ethereum L1.',
        },
        stateVerificationOnL1: {
          positive:
            'A complete and functional proof system (fraud or validity proofs) is deployed.',
          negative: 'The proof system is still under development.',
        },
        daAttestedByIndependentParty: {
          positive:
            'DA is attested by a committee or external DA layer, not solely by the sequencer.',
          negative:
            'DA is attested solely by the sequencer, which can withhold data unilaterally.',
        },
        nodeSourceAvailable: {
          positive:
            'A source-available node exists that can reconstruct the L2 state when DA is accessible. Please note that the L2BEAT team has not verified the validity of the node source code.' +
            (opts?.nodeSourceLink
              ? ` [View code](${opts.nodeSourceLink})`
              : ''),
          negative:
            'No source-available node exists that can reconstruct the L2 state from the DA layer.',
          underReviewMessage:
            'The requirement for available node software is under review.',
          warningMessage:
            'There is no available node software that can reconstruct L2 state transitions from available DA, so this system cannot be independently verified.',
        },
        fraudProofSystemAtLeast5Outsiders: {
          positive:
            'There are at least 5 external actors who can submit fraud proofs.',
          negative: 'Fraud proof submission is not sufficiently decentralized.',
        },
      },
    },
    stage1: {
      name: 'Stage 1',
      principle: {
        positive:
          'The only ways (other than bugs) to steal funds or block withdrawals indefinitely are: (1) compromising ≥75% of the Security Council to push a malicious upgrade, or (2) the sequencer colluding with the DA committee to withhold data and finalize invalid state roots.',
        negative:
          'Compromising ≥75% of the Security Council to push a malicious upgrade, or sequencer+DA-committee collusion to withhold data and finalize invalid state roots, should be the only ways (other than bugs) to steal funds or block withdrawals indefinitely.',
      },
      items: {
        usersCanExitWithoutCooperation: {
          positive:
            'Users are able to exit without the help of the permissioned operators, provided DA is accessible.',
          negative: `Users' withdrawals can be censored by the permissioned operators.`,
        },
        usersHave7DaysToExit: {
          positive:
            'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
          negative:
            'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
        },
        securityCouncilProperlySetUp: {
          positive:
            'The Security Council is properly set up' +
            (opts?.securityCouncilReference
              ? ` [(List of members)](${opts.securityCouncilReference}).`
              : '.'),
          negative: 'The Security Council is not properly set up.',
        },
        daVerifierSecureOnL1: {
          positive:
            'A secure DA verifier is integrated on L1 that checks DA attestations onchain, enabling challengers to retrieve data and construct proofs.' +
            (opts?.daVerifierLink
              ? ` [View code](${opts.daVerifierLink})`
              : ''),
          negative:
            'No secure onchain DA verifier is integrated on L1, so DA attestations cannot be independently verified by challengers.',
        },
        daVerifier7DayExitWindow: {
          positive:
            'The DA verifier is non-upgradeable, or upgrades to it provide at least a 7d independent exit window.',
          negative:
            'The DA verifier is upgradeable with less than 7d independent exit window.',
        },
        daCommitteeDecentralized: {
          positive:
            'The DA layer meets minimum decentralization: a DAC with ≥5 external members under an honest-minority assumption, or an external DA chain with an attestation verifier.',
          negative:
            'The DA layer does not meet minimum decentralization requirements (DAC <5 external members, or no attestation verifier for an external DA chain).',
        },
        noRedTrustedSetups: {
          positive:
            'The proof system meets the minimum trusted setup requirements defined in the L2BEAT [trusted setup assessment framework](https://forum.l2beat.com/t/the-trusted-setups-framework-for-zk-catalog/381).',
          negative:
            'The proof system does not meet the minimum trusted setup requirements defined in the L2BEAT [trusted setup assessment framework](https://forum.l2beat.com/t/the-trusted-setups-framework-for-zk-catalog/381).',
        },
        proverSourcePublished: {
          positive:
            'Prover source code is published.' +
            (opts?.proverSourceLink
              ? ` [View code](${opts.proverSourceLink})`
              : ''),
          negative: 'Prover source code is not published.',
        },
        verifierContractsReproducible: {
          positive:
            "Onchain verifiers' smart contracts (including the DA verifier) can be independently regenerated from the verifier source code.",
          negative:
            "Not all onchain verifiers' smart contracts can be independently regenerated from the verifier source code.",
        },
        programHashesReproducible: {
          positive:
            'The sources of all programs used are public and program hashes can be independently regenerated.',
          negative:
            'Not all program sources are public or not all program hashes can be independently regenerated.',
        },
      },
    },
    stage2: {
      name: 'Stage 2',
      items: {
        fraudProofSystemIsPermissionless: {
          positive: 'Fraud proof submission is open to everyone.',
          negative:
            'Fraud proof submission is open only to whitelisted actors.',
        },
        delayWith30DExitWindow: {
          positive:
            'Upgrades unrelated to onchain provable bugs, including upgrades to the DA verifier, provide at least 30d to exit.',
          negative:
            'Upgrades unrelated to onchain provable bugs, including upgrades to the DA verifier, provide less than 30d to exit.',
        },
        proofSystemOverriddenOnlyInCaseOfABug: {
          positive:
            'The Security Council is limited to acting solely on onchain provable bugs.',
          negative: `The Security Council's actions are not confined to onchain provable bugs.`,
        },
        daVerifier30DayExitWindow: {
          positive:
            'The DA verifier (and related contracts) is non-upgradeable, or upgrades to it provide at least a 30d independent exit window.',
          negative:
            'The DA verifier (and related contracts) is upgradeable with less than 30d independent exit window.',
        },
        daMechanismEconomicSecurity: {
          positive:
            'The DA mechanism has economic security (as per DA risk framework): staked assets at risk for DA misbehavior with slashable value higher than TVS.',
          negative:
            'The DA mechanism relies on reputational security alone; no staked assets are at risk for DA misbehavior or slashable < TVS.',
        },
      },
    },
  }) as const
