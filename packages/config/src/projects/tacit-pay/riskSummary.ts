import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export const tacitPayRiskSummary = definePrivacyRisks({
  stolen: [R.proofSystem('spends or withdrawals'), R.trustedSetup],
  lost: [
    'a user loses the wallet whose signature derives their keys.',
    'a user signs the Tacit identity message on a malicious site, which can then spend their notes.',
    'a user sends a token other than ETH to a deposit address, which releases only ETH.',
  ],
  privacy: [
    {
      text: 'few depositors use the pool, so timing and amounts can pair a withdrawal with its deposit.',
      see: ['chainAnalyst'],
    },
    {
      text: "Tacit's relay, the only one running, refuses a withdrawal, so the user must self-relay from a public wallet.",
      see: ['chainAnalyst'],
    },
    {
      text: 'a user keeps the default RPC nodes, which receive the deposit addresses and the withdrawal recipient in one session.',
      see: ['networkObserver'],
    },
    {
      text: 'the Z DAO points anon.wei at another page or changes the default relay host and RPC nodes, 1 day after a vote.',
      see: ['privilegedInsider'],
    },
    {
      text: 'elliptic-curve cryptography is broken, which opens every note derived from a wallet that signed in and sent a transaction.',
      see: ['futureAdversary'],
    },
  ],
})
