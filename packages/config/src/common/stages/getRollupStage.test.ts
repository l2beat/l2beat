import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getRollupStage, UPCOMING_STAGE_1_ITEMS } from './getRollupStage'
import type { UpcomingStageRequirements } from './stage'

const PAST_TIME = UnixTime.now() - 30 * UnixTime.DAY
const FUTURE_TIME = UnixTime.now() + 30 * UnixTime.DAY

const upcomingExpiringAt = (expiresAt: number): UpcomingStageRequirements => ({
  stage1: { expiresAt, items: UPCOMING_STAGE_1_ITEMS },
})

const FULLY_SATISFIED_CHECKLIST = {
  stage0: {
    callsItselfRollup: true,
    stateRootsPostedToL1: true,
    dataAvailabilityOnL1: true,
    rollupNodeSourceAvailable: true,
    stateVerificationOnL1: true,
    fraudProofSystemAtLeast5Outsiders: true,
  },
  stage1: {
    principle: true,
    usersHave7DaysToExit: true,
    usersCanExitWithoutCooperation: true,
    securityCouncilProperlySetUp: true,
    noRedTrustedSetups: true,
    proverSourcePublished: true,
    verifierContractsReproducible: true,
    programHashesReproducible: true,
  },
  stage2: {
    proofSystemOverriddenOnlyInCaseOfABug: false,
    fraudProofSystemIsPermissionless: false,
    delayWith30DExitWindow: false,
  },
} as const

const OPTS = {
  rollupNodeLink: 'randomlink',
  additionalConsiderations: {
    short: 'short notice',
    long: 'long notice',
  },
}

describe(getRollupStage.name, () => {
  it('should return stage object', () => {
    const result = getRollupStage(
      FULLY_SATISFIED_CHECKLIST,
      OPTS,
      upcomingExpiringAt(PAST_TIME),
    )
    expect(result).toEqual({
      message: undefined,
      additionalConsiderations: {
        short: 'short notice',
        long: 'long notice',
      },
      stage1PrincipleDescription: undefined,
      downgradePending: undefined,
      missing: {
        nextStage: 'Stage 2',
        principle: undefined,
        requirements: [
          'Fraud proof submission is open only to whitelisted actors.',
          'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
          "The Security Council's actions are not confined to onchain provable bugs.",
        ],
      },
      stage: 'Stage 1',
      summary: [
        {
          requirements: [
            {
              description:
                'A complete and functional proof system is deployed.',
              satisfied: true,
            },
            {
              description:
                'There are at least 5 external actors who can submit fraud proofs.',
              satisfied: true,
            },
            {
              description: 'The project calls itself a rollup.',
              satisfied: true,
            },
            {
              description: 'State roots are posted to Ethereum L1.',
              satisfied: true,
            },
            {
              description:
                'Inputs for the state transition function are posted to Ethereum L1.',
              satisfied: true,
            },
            {
              description:
                'A source-available node exists that can recreate the state from Ethereum L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](randomlink)',
              satisfied: true,
            },
          ],
          stage: 'Stage 0',
          principle: undefined,
        },
        {
          requirements: [
            {
              description:
                'Users are able to exit without the help of the permissioned operators.',
              satisfied: true,
            },
            {
              description:
                'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
              satisfied: true,
            },
            {
              description: 'The Security Council is properly set up.',
              satisfied: true,
            },
            {
              description:
                'The proof system meets the minimum trusted setup requirements defined in the L2BEAT [trusted setup assessment framework](https://forum.l2beat.com/t/the-trusted-setups-framework-for-zk-catalog/381).',
              satisfied: true,
            },
            {
              description: 'Prover source code is published.',
              satisfied: true,
            },
            {
              description:
                "Onchain verifiers' smart contracts can be independently regenerated from the verifier source code.",
              satisfied: true,
            },
            {
              description:
                'The sources of all programs used are public and program hashes can be independently regenerated.',
              satisfied: true,
            },
          ],
          stage: 'Stage 1',
          principle: {
            description:
              'Compromising ≥75% of the Security Council is the only way (other than bugs) for a rollup to indefinitely block an L2→L1 message (e.g. a withdrawal) or push an invalid L2→L1 message (e.g. an invalid withdrawal) with a <7d exit window.',
            satisfied: true,
          },
        },
        {
          requirements: [
            {
              description:
                'Fraud proof submission is open only to whitelisted actors.',
              satisfied: false,
            },
            {
              description:
                'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
              satisfied: false,
            },
            {
              description:
                "The Security Council's actions are not confined to onchain provable bugs.",
              satisfied: false,
            },
          ],
          stage: 'Stage 2',
          principle: undefined,
        },
      ],
    })
  })

  it('should throw error if no rollup node link is present and rollupNodeSourceAvailable is satisfied', () => {
    expect(() => getRollupStage(FULLY_SATISFIED_CHECKLIST)).toThrow(
      'Rollup node link is required',
    )
  })

  describe('upcoming Stage 1 requirements', () => {
    it('flags them as upcoming while the countdown is still running', () => {
      const result = getRollupStage(
        FULLY_SATISFIED_CHECKLIST,
        OPTS,
        upcomingExpiringAt(FUTURE_TIME),
      )

      const stage1 = result.summary.find((s) => s.stage === 'Stage 1')
      expect(
        stage1?.requirements.filter((r) => r.upcoming === true).length,
      ).toEqual(UPCOMING_STAGE_1_ITEMS.length)
      expect(result.stage).toEqual('Stage 1')
    })

    it('keeps Stage 1 but marks a downgrade as pending when an upcoming requirement fails before expiry', () => {
      const result = getRollupStage(
        {
          ...FULLY_SATISFIED_CHECKLIST,
          stage1: {
            ...FULLY_SATISFIED_CHECKLIST.stage1,
            proverSourcePublished: false,
          },
        },
        OPTS,
        upcomingExpiringAt(FUTURE_TIME),
      )

      expect(result.stage).toEqual('Stage 1')
      // Stage 1 itself is not missing anything yet - only Stage 2 is.
      expect(result.missing?.nextStage).toEqual('Stage 2')
      expect(result.downgradePending).toEqual({
        expiresAt: FUTURE_TIME,
        reasons: ['Prover source code is not published.'],
        toStage: 'Stage 0',
      })
    })

    it('downgrades to Stage 0 once the countdown has expired', () => {
      const result = getRollupStage(
        {
          ...FULLY_SATISFIED_CHECKLIST,
          stage1: {
            ...FULLY_SATISFIED_CHECKLIST.stage1,
            proverSourcePublished: false,
          },
        },
        OPTS,
        upcomingExpiringAt(PAST_TIME),
      )

      expect(result.stage).toEqual('Stage 0')
      expect(result.downgradePending).toEqual(undefined)
      expect(result.missing?.requirements).toEqual([
        'Prover source code is not published.',
      ])
    })
  })
})
