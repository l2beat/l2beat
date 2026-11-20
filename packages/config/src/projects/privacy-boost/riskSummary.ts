import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export const privacyBoostRiskSummary = definePrivacyRisks({
  stolen: [
    R.proofSystem('spends or withdrawals'),
    R.trustedSetup,
    'the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or registers a malicious verifying key, with no delay.',
  ],
  lost: [
    'a user loses their note secrets, or both the account-owner wallet and every usable authorization key.',
  ],
  privacy: [
    {
      text: "the TEE's hardware vendor, or anyone with physical access to the enclave, breaks its isolation.",
      see: ['privilegedInsider'],
    },
    {
      text: "an auditor appointed by the admin multisig fetches the user's history through the Audit API.",
      see: ['privilegedInsider'],
    },
    {
      text: 'the operator refuses a spend, by its screening or by stopping, which leaves only a public forced withdrawal.',
      see: ['publicObserver'],
    },
    {
      text: 'a user relies on the anonymity set, which is too small to hide in.',
      see: ['chainAnalyst'],
    },
    {
      text: 'the operator deploys an enclave image or a closed SDK core that leaks user data.',
      see: ['privilegedInsider'],
    },
    {
      text: 'Alchemy pairs the signed-in wallet with the withdrawal by timing.',
      see: ['networkObserver'],
    },
    {
      text: "elliptic-curve cryptography is broken, which decrypts every note through the enclave's long-lived public key.",
      see: ['futureAdversary'],
    },
  ],
})
