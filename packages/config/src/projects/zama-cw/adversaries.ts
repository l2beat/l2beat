import {
  ADVICE_SNIPPETS as A,
  definePrivacyAdversaries,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const OZ =
  'https://github.com/OpenZeppelin/openzeppelin-confidential-contracts/blob/23ba15402346027f2416667acbb1e741179f8485/contracts/token/ERC7984/'
const WRAPPER =
  'https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol'
const FHEVM =
  'https://github.com/zama-ai/fhevm/blob/e3a7d1e263655f2b0dbd6230c3b00a7693fb8609/'
// @zama-fhe/sdk v3.7.1, the version the app bundles.
const SDK =
  'https://github.com/zama-ai/sdk/blob/cc1d5589a242987ceb1ca083bb0b4523b08e3d21/packages/sdk/src/'

const INTERIOR: PrivacyExposureMap = {
  sender: 'exposed',
  recipient: 'exposed',
  amount: 'private',
  asset: 'exposed',
  linkage: 'exposed',
}

const ALL_EXPOSED: PrivacyExposureMap = {
  sender: 'exposed',
  recipient: 'exposed',
  amount: 'exposed',
  asset: 'exposed',
  linkage: 'exposed',
}

/**
 * @param kmsKeyThreshold KMS operators that can reconstruct the FHE key, from discovery
 * @param kmsOperatorCount KMS operators in the current context, from discovery
 */
export function zamaCwAdversaries(
  kmsKeyThreshold: number,
  kmsOperatorCount: number,
) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'amount',
      text: 'Hides balances and transfer amounts. Senders, recipients and every wrap and unwrap amount are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'warning',
        exposureShort:
          'Wraps, unwraps and vault batch totals publish their amounts, while confidential transfers keep theirs encrypted.',
        exposureContinued:
          "Either party to a transfer can disclose its amount onchain at any time. A vault batch with a single depositor publishes that depositor's amount.",
        interior: INTERIOR,
        sources: [
          {
            title: 'Wrap event carries the clear amount',
            url: `${OZ}extensions/ERC7984ERC20Wrapper.sol#L256`,
          },
          {
            title: 'Unwrap makes the burned amount publicly decryptable',
            url: `${OZ}extensions/ERC7984ERC20Wrapper.sol#L262-L268`,
          },
          {
            title: 'Either party can disclose a transfer amount',
            url: `${OZ}ERC7984.sol#L202-L209`,
          },
          {
            contract: 'SteakcUSDCDepositBatcher',
            title:
              'Batchers log every depositor and unwrap each batch total publicly',
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'warning',
        exposureShort:
          "An account's balance is bounded by its public wraps and unwraps, and exact if it never took part in a confidential transfer.",
        exposureContinued:
          'Transfer partners and timing are public, so a wrap, a transfer and an unwrap in a row pair up by amount. Swap market makers decrypt the amounts of each order and its decoys, and the winner learns which one is real.',
        interior: {
          ...INTERIOR,
          amount: {
            verdict: 'atRisk',
            note: "Hidden only within an account's confidential transfers.",
          },
        },
        sources: [
          {
            title:
              'ERC-7984: public sender, recipient and encrypted amount per transfer',
            url: 'https://eips.ethereum.org/EIPS/eip-7984',
          },
          {
            title:
              'Explorer linking unwraps to their wraps: 95% link to a single wrap (October 2026)',
            url: 'https://sekuba.github.io/zama-graph/',
          },
          {
            contract: 'ConfidentialSwap',
            title:
              'Market makers decrypt each order and its decoys through a shared delegation',
          },
        ],
      },
      networkObserver: {
        sentiment: 'good',
        exposureShort:
          'No third party sees a transfer amount, since the app encrypts amounts on the device and reads balances under a key only the device holds.',
        exposureContinued:
          "A swap quote sends the cleartext amount to Zama's server, which can pass it to LI.FI. Each wallet connection sends the address to Dynamic, a third party, which sees it with the user's IP.",
        interior: {
          ...INTERIOR,
          amount: {
            verdict: 'atRisk',
            note: 'Private only without swaps, whose quotes can reach LI.FI.',
          },
        },
        sources: [
          {
            title:
              'Served app, deployment dpl_8nxK5TFwZggVq61MJ5AzJorbdsYe (checked 2026-11-11)',
            url: 'https://app.zama.org',
          },
          {
            title: 'Inputs are encrypted on the device',
            url: `${SDK}worker/encrypt.worker.ts#L112-L128`,
          },
          {
            title: 'Balance reads use a device ML-KEM key pair',
            url: `${SDK}credentials/keypair-vault.ts#L118-L133`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: `Any ${kmsKeyThreshold} of the ${kmsOperatorCount} KMS operators can combine their key shares and decrypt every balance and transfer ever made.`,
        exposureContinued:
          "The token owner can instantly appoint an observer that sees all amounts, and the swap's compliance address decrypts every swap. Zama's closed-source app can read amounts before encryption, sends every swap amount to Zama in cleartext and shares vault balances with Merkl by default.",
        interior: ALL_EXPOSED,
        sources: [
          {
            title:
              'The key is secret-shared among the operators and holds while at most a third collude',
            url: `${FHEVM}docs/protocol/architecture/kms.md#L47-L53`,
          },
          {
            title: 'Observer gets a wildcard delegation without expiration',
            url: `${WRAPPER}#L395-L403`,
          },
          {
            contract: 'ConfidentialSwap',
            title:
              'The compliance address decrypts every intent, quote and settlement',
          },
          {
            title: 'Sharing vault balances with Merkl is on by default',
            url: 'https://www.zama.org/post/confidential-rewards-with-merkl-are-now-available-to-claim',
          },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography recovers a user's wallet key from any past transaction and can have the KMS decrypt that user's history.",
        exposureContinued:
          'A wallet signature alone authorizes decryption of past balances and transfers, and the KMS encrypts its reply to any key the request names. The ciphertexts themselves rest on lattice assumptions with no known quantum attack.',
        interior: ALL_EXPOSED,
        sources: [
          {
            contract: 'Decryption',
            title:
              'A wallet signature authorizes a user decryption request and names the key the reply is encrypted to',
          },
          {
            contract: 'ACL',
            title: 'Permissions on past ciphertexts have no expiry',
          },
          {
            title: 'Coprocessor ciphertext store (public listing)',
            url: 'https://coprocessor-1.mainnet.zama.org/',
          },
        ],
      },
    },
    advice: [
      {
        name: 'Set up',
        text: 'Reject the analytics prompt, so Google Analytics and Sentry receive nothing.',
        against: ['networkObserver'],
      },
      {
        name: 'Pay',
        text: 'Pay and get paid inside the confidential token, since wraps and unwraps show their amounts. Transfer often, even zero amounts, so your balance stops matching your wraps. Skip swaps for amounts that must stay hidden.',
        against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
      },
      {
        name: 'Unwrap',
        text: `Unwrap only what you need and only after a while. ${A.commonAmounts}`,
        against: ['publicObserver', 'chainAnalyst'],
      },
    ],
  })
}
