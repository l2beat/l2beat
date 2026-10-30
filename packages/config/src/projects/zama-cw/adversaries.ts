import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const OZ =
  'https://github.com/OpenZeppelin/openzeppelin-confidential-contracts/blob/23ba15402346027f2416667acbb1e741179f8485/contracts/token/ERC7984/'
const WRAPPER =
  'https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol'
const KMS =
  'https://github.com/zama-ai/kms/blob/b5cd5cf465dc488ff04ac8c19f3ef12877abffa0/'
// @zama-fhe/sdk v3.6.0, the release line the app bundles.
const SDK =
  'https://github.com/zama-ai/sdk/blob/464764577777367e869c47ae53e6ba0de35e3f93/packages/sdk/src/'

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
        advice:
          'Pay and get paid inside the confidential token, and unwrap only what the user needs.',
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
        advice: `Transfer often, even zero amounts, and unwrap only after a while. ${S.commonAmounts}`,
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
          "No third party sees an amount, and the user's address and decryption requests go only to Zama's servers.",
        exposureContinued:
          "The app encrypts amounts on the device with Zama's open SDK and reads balances under a key only the device holds.",
        advice:
          'Reject the analytics prompt, so Google Analytics and Sentry receive nothing.',
        interior: INTERIOR,
        sources: [
          {
            title:
              'Served app, build Rh4Nfrd-QpbxA2axbN31u (checked 2026-10-22)',
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
          "The token owner can instantly appoint an observer that sees all amounts. Zama's closed-source app can read amounts before encryption, and today sends every swap amount to Zama in cleartext. The swap's compliance address decrypts every swap, and the vault feature shares balances with Merkl by default.",
        interior: ALL_EXPOSED,
        sources: [
          {
            title: 'KMS parties and key-share threshold',
            url: `${KMS}ai-docs/ARCHITECTURE.md#L22-L25`,
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
            title: 'A wallet signature authorizes a user decryption request',
          },
          {
            contract: 'ACL',
            title: 'Permissions on past ciphertexts have no expiry',
          },
          {
            title: 'Replies are encrypted to the key the request names',
            url: `${KMS}core/service/src/cryptography/hybrid_ml_kem.rs`,
          },
          {
            title: 'Coprocessor ciphertext store (public listing)',
            url: 'https://coprocessor-1.mainnet.zama.org/',
          },
        ],
      },
    },
  })
}
