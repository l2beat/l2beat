import { definePrivacyRisks } from '../../common/privacyRisks'

export function interfoldRiskSummary({
  decryptionThreshold,
  committeeMembers,
}: {
  decryptionThreshold: number
  committeeMembers: number
}) {
  return definePrivacyRisks({
    stolen: [
      'the VotingEscrowMultisig deploys a malicious [upgrade](#upgrades-and-governance) of VotingEscrow, which holds locked FOLD, with no delay.',
      'either Interfold multisig deploys a malicious [upgrade](#upgrades-and-governance) of VotingEscrow or BondingRegistry, which hold locked and bonded FOLD, with no delay.',
    ],
    privacy: [
      {
        text: `${decryptionThreshold} of the ${committeeMembers} ciphernodes in a vote's committee combine their key shares.`,
        see: ['privilegedInsider'],
      },
      {
        text: 'either Interfold multisig instantly shrinks future committees or swaps the program that sums future ballots for one that outputs a single ballot.',
        see: ['privilegedInsider'],
      },
      {
        text: "one voter's power exceeds the totals of all but one option.",
        see: ['chainAnalyst', 'futureAdversary'],
      },
    ],
  })
}
