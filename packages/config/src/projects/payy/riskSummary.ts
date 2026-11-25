import { definePrivacyRisks } from '../../common/privacyRisks'

export const payyRiskSummary = definePrivacyRisks({
  stolen: [
    'the verifier or the circuits accept an invalid withdrawal.',
    'the PayyMultisig deploys a malicious [upgrade](#upgrades-and-governance) of RollupV1 or overwrites its state root, with no delay.',
  ],
  lost: [
    'a user loses the note data or the keys required to spend their notes.',
    'the offchain transaction data becomes unavailable, as data availability is not verified on Ethereum.',
    'the operators stop including withdrawals in proven state updates, as there is no forced exit mechanism.',
  ],
  privacy: [
    {
      text: "anyone with Payy's block data follows which notes fund which, from a deposit address to a withdrawal address.",
      see: ['publicObserver'],
    },
    {
      text: 'a path without splits or merges reveals every amount between a deposit and a withdrawal.',
      see: ['chainAnalyst'],
    },
    {
      text: 'a payment link is opened in a browser, which hands its redeem secret to PostHog and Framer.',
      see: ['networkObserver'],
    },
    {
      text: "Payy's backend, which ties each wallet to its KYC record, deposit address and notes, leaks or uses this data.",
      see: ['privilegedInsider'],
    },
    {
      text: 'elliptic-curve cryptography is broken, which may open the public per-transaction proofs that lack zero knowledge.',
      see: ['futureAdversary'],
    },
  ],
})
