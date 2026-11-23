import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export function hinkalRiskSummary({
  multisigStats,
  timelockDelay,
}: {
  multisigStats: string
  timelockDelay: string
}) {
  return definePrivacyRisks({
    stolen: [
      'whoever made the single phase 2 contribution of the [trusted setup](#trusted-setups) kept or leaks its secret, which allows forged proofs.',
      R.proofSystem('spends or withdrawals'),
      `the ${multisigStats} multisig registers a malicious verifier or helper through the timelock, which takes effect after ${timelockDelay}.`,
      `the ${multisigStats} multisig upgrades the Emporium through the timelock, which can then move the funds of every public account delegated to the HinkalWallet.`,
    ],
    lost: [
      'a user loses the recovery phrase or the wallet whose signature derives their keys.',
    ],
    frozen: [
      "Hinkal's relayers refuse a withdrawal, since no released app can submit it from the user's own wallet.",
    ],
    privacy: [
      {
        text: 'Hinkal reads notes with its enclave key, to which every note is encrypted.',
        see: ['privilegedInsider'],
      },
      {
        text: "a user signs in to Hinkal Pay, or keeps the extension's default Remote Proving, which send keys to Hinkal's enclave.",
        see: ['privilegedInsider'],
      },
      {
        text: 'most deposits of a token leave again as the same amount, so few deposits hide a withdrawal.',
        see: ['chainAnalyst'],
      },
      {
        text: 'a public RPC ties the public accounts it reads to a withdrawal, by the requests the extension makes while waiting for it.',
        see: ['networkObserver'],
      },
      {
        text: "elliptic-curve cryptography is broken, which opens every note through the enclave key or the sender's published H1.",
        see: ['futureAdversary'],
      },
    ],
  })
}
