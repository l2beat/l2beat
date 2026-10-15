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
const RELAYER_SDK =
  'https://github.com/zama-ai/relayer-sdk/blob/d06f1e585a78181135cb602109e5fa3da523b48d/src/'

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
          'Wraps and unwraps publish their amounts, while confidential transfers keep theirs encrypted.',
        exposureContinued:
          'Either party to a transfer can disclose its amount onchain at any time.',
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
        ],
      },
      chainAnalyst: {
        sentiment: 'warning',
        exposureShort:
          "An account's balance is bounded by its public wraps and unwraps, and exact if it never took part in a confidential transfer.",
        exposureContinued:
          'Transfer partners and timing are public, so a wrap, a transfer and an unwrap in a row pair up by amount. In October 2026, 95% of unwraps could be linked to a single wrap.',
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
              'Explorer linking unwraps to their wraps, searchable by address, handle and transaction',
            url: 'https://sekuba.github.io/zama-graph/',
          },
        ],
      },
      networkObserver: {
        sentiment: 'warning',
        exposureShort:
          "Zama's app is closed source, so what it sends to third parties is up to Zama and can change at any time.",
        exposureContinued:
          "Through Zama's open SDK, amounts leave the user's device only as FHE ciphertext and return encrypted to a key held only by that device. Today the app sends the user's address, chain reads and decryption requests to Zama's own servers, which forward chain reads to an RPC provider Zama does not name. Analytics wait for the user's consent.",
        advice: "Use a client built on Zama's open SDK.",
        interior: INTERIOR,
        sources: [
          {
            title: 'Inputs are encrypted on the device',
            url: `${RELAYER_SDK}relayer/sendEncryption.ts#L133-L146`,
          },
          {
            title: 'Balance reads use a device ML-KEM key pair',
            url: `${RELAYER_SDK}relayer/userDecrypt.ts#L85-L89`,
          },
          {
            title:
              "The app's content security policy lists every endpoint it contacts",
            url: 'https://app.zama.org',
          },
          {
            title:
              'The SDK the app bundles (@zama-fhe/sdk 3.6.0) is open source',
            url: 'https://github.com/zama-ai/sdk',
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: `Any ${kmsKeyThreshold} of the ${kmsOperatorCount} KMS operators can combine their key shares and decrypt every balance and transfer ever made.`,
        exposureContinued:
          'The token owner can instantly appoint an observer that sees all amounts forever, or upgrade the token and the ACL. Zama serves its closed-source app, so it can read amounts before they are encrypted.',
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
            title: "Zama's official app",
            url: 'https://docs.zama.org/protocol/protocol-apps/apps',
          },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography recovers a user's wallet key from any past transaction and can have the KMS decrypt that user's history.",
        exposureContinued:
          'A wallet signature alone authorizes decryption, permissions on past balances and transfers never expire, and the KMS encrypts its replies to whatever key the request names. The ciphertexts themselves rest on lattice assumptions with no known quantum attack, and anyone can download them today.',
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
