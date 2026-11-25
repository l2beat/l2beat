import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export const privacyPoolsV2RiskSummary = definePrivacyRisks({
  stolen: [
    R.proofSystem('spends or withdrawals'),
    R.trustedSetup,
    'the admin multisig deploys a malicious [upgrade](#upgrades-and-governance) of the PoolVault, which holds every deposit, or a verifier that accepts any proof, with no delay.',
  ],
  lost: [
    'a user loses the wallet whose signature derives their keys and the exported account key.',
    'the payer loses a claim link before the recipient claims it.',
    'Aave suffers a loss on the reserve behind a yield share.',
  ],
  frozen: [
    'the admin multisig lets the state tree fill by lowering its capacity, which stops every ragequit, deposit and spend, with no delay.',
    'Aave pauses a reserve behind the yield shares, which stops redeeming them for the underlying asset.',
  ],
  stopped: [
    'the admin multisig pauses deposits and spends, or raises the vetting fee on deposits up to 99.99% of their value.',
    'Aave freezes the reserves behind the yield shares, which stops every deposit through the app.',
  ],
  privacy: [
    {
      text: 'the ASP leaves deposits out of its latest list, which freezes every note from them, up to halting all private spends.',
      see: ['privilegedInsider'],
    },
    {
      text: 'the ASP keeps only a few labels in its latest list, so spends proven against it point to one of them.',
      see: ['privilegedInsider'],
    },
    {
      text: "0xbow's relayer refuses a withdrawal, so the user must self-relay from a public wallet.",
      see: ['chainAnalyst'],
    },
    {
      text: "a note's label, which passes to every later payee, links to its deposit when timed against the ASP's updates.",
      see: ['chainAnalyst'],
    },
    {
      text: '0xbow pairs the IP of a deposit session with the IP of a withdrawal request across its ASP and relayer.',
      see: ['privilegedInsider'],
    },
    {
      text: "a user's withdrawing session opens the deposit screen with a wallet connected, showing its address to the default RPC.",
      see: ['networkObserver'],
    },
    {
      text: 'elliptic-curve cryptography is broken, which decrypts every onchain note from the published viewing keys.',
      see: ['futureAdversary'],
    },
  ],
})
