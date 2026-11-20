import { definePrivacyRisks } from '../../common/privacyRisks'

export function zamaCwRiskSummary({
  coprocessorThreshold,
  coprocessorSignerCount,
  kmsKeyThreshold,
  kmsSignerCount,
}: {
  coprocessorThreshold: number
  coprocessorSignerCount: number
  kmsKeyThreshold: number
  kmsSignerCount: number
}) {
  return definePrivacyRisks({
    stolen: [
      'a governance multisig deploys a malicious [upgrade](#upgrades-and-governance), which takes effect instantly.',
      'a KMS signer set, which either multisig can create instantly, attests an inflated unwrap amount.',
      `${coprocessorThreshold} of ${coprocessorSignerCount} coprocessors accept invalid encrypted inputs that bypass balance checks.`,
    ],
    lost: [
      'the coprocessors lose ciphertext data, so balances can no longer be decrypted.',
    ],
    frozen: [
      "an underlying token issuer blacklists a confidential token's address.",
      'the token owner or an underlying denylist blocks a user before they unwrap.',
      'an ACL, Gateway or token pauser halts tokens and the owner keeps them paused.',
      'the KMS or the coprocessors stop, which halts every unwrap.',
    ],
    privacy: [
      {
        text: `${kmsKeyThreshold} of ${kmsSignerCount} KMS operators combine their key shares.`,
        see: ['privilegedInsider'],
      },
      {
        text: 'the token owner appoints an observer or upgrades the token.',
        see: ['privilegedInsider'],
      },
      {
        text: "a user swaps: Zama and the swap's compliance address see the amount, which can reach LI.FI.",
        see: ['privilegedInsider', 'networkObserver'],
      },
      {
        text: "a user keeps the vault form's default of sharing their balance with Merkl.",
        see: ['privilegedInsider'],
      },
      {
        text: 'Zama changes its closed-source app to leak amounts to itself or to third parties.',
        see: ['privilegedInsider'],
      },
      {
        text: "public wraps, unwraps and vault batch totals bound a user's balance.",
        see: ['publicObserver', 'chainAnalyst'],
      },
      {
        text: "elliptic-curve cryptography is broken, which lets anyone impersonate a user to the KMS and decrypt that user's history.",
        see: ['futureAdversary'],
      },
    ],
  })
}
