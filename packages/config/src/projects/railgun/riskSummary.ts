import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export function railgunRiskSummary({
  executionDelay,
}: {
  executionDelay: string
}) {
  return definePrivacyRisks({
    stolen: [
      R.proofSystem('spends or withdrawals'),
      R.trustedSetup,
      `the DAO passes a malicious [upgrade](#upgrades-and-governance) and users stay in the pool past its ${executionDelay} execution delay.`,
    ],
    lost: ['a user loses the keys of their private balance.'],
    privacy: [
      {
        text: 'a user sends transactions from their own public address.',
        see: ['publicObserver'],
      },
      {
        text: "a user keeps RailOxide's public RPCs, which can pair their public addresses with their private transactions by timing.",
        see: ['networkObserver'],
      },
      {
        text: 'elliptic-curve cryptography is broken, which decrypts every note sent to a 0zk address the attacker knows.',
        see: ['futureAdversary'],
      },
    ],
  })
}
