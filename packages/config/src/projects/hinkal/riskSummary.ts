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
      R.proofSystem('spends or withdrawals'),
      'whoever made the single phase 2 contribution of a circuit in the [trusted setup](#trusted-setups) kept its secret, allowing forged proofs.',
      `the ${multisigStats} multisig registers a malicious verifier or helper through the [timelock](#upgrades-and-governance), which takes effect after ${timelockDelay}.`,
      `the ${multisigStats} multisig upgrades the Emporium through the timelock, which can then move the funds of public accounts delegated to the HinkalWallet.`,
      'a Hinkal relayer settles a deposit address with a fee of nearly its whole balance, since the recipient does not sign the fee.',
      "a single Safe signer redirects wrapper deposits, cuts swap output to the user's minimum, spends approvals for scheduled sends or upgrades the ReceiveVaultFactory.",
    ],
    lost: ['a user loses their recovery phrase.'],
    frozen: [
      "Hinkal's relayers refuse a withdrawal, since the extension submits only through them.",
    ],
    privacy: [
      {
        text: "Hinkal decrypts notes with its enclave key, learns each spend's notes at its relayers, or receives the nullifying key by default.",
        see: ['privilegedInsider'],
      },
      {
        text: 'a token has few depositors who leave funds in the pool, as most USDT deposits meet a matching withdrawal within minutes.',
        see: ['chainAnalyst'],
      },
      {
        text: 'a public RPC ties the public accounts it reads to a withdrawal, by the requests the extension makes while waiting for it.',
        see: ['networkObserver'],
      },
      {
        text: "elliptic-curve cryptography is broken, which decrypts every note through the enclave's public key.",
        see: ['futureAdversary'],
      },
    ],
  })
}
