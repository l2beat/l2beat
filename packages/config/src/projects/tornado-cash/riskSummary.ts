import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export function tornadoCashRiskSummary({
  upgradeDelay,
}: {
  upgradeDelay: string
}) {
  return definePrivacyRisks({
    stolen: [
      R.proofSystem('withdrawals'),
      R.trustedSetup,
      `TORN holders pin a malicious app or [upgrade](#upgrades-and-governance) the InstanceRegistry after ${upgradeDelay}, stealing notes from app users or tokens approved to the router.`,
    ],
    lost: ['a user loses the note required to withdraw.'],
    privacy: [
      {
        text: 'elliptic-curve cryptography is broken, which lets an attacker test candidate deposits for each withdrawal and read notes backed up onchain.',
        see: ['futureAdversary'],
      },
    ],
  })
}
