import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const OZ =
  'https://github.com/OpenZeppelin/openzeppelin-confidential-contracts/blob/23ba15402346027f2416667acbb1e741179f8485/contracts/token/ERC7984/'
const WRAPPER =
  'https://github.com/zama-ai/protocol-apps/blob/85eef95c797da20875fe7eeae7f8d212d760486f/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol'
const FHEVM =
  'https://github.com/zama-ai/fhevm/blob/94f1f3b35c71175dc68bb36887e0525f7c5d80c5/'
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
          'Pay and get paid inside the confidential token, and unwrap only what you need.',
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
        sentiment: 'good',
        exposureShort:
          'Amounts leave your device only as FHE ciphertext and come back encrypted to a key only your device holds.',
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
          'One long-lived lattice key protects every balance and transfer amount, and anyone can download the ciphertexts today.',
        exposureContinued:
          'Balance reads also publish decryption shares on the Zama Gateway chain, encrypted to each user with ML-KEM, also lattice-based. Whoever breaks lattice cryptography, or later obtains enough KMS key shares, decrypts the entire history.',
        interior: ALL_EXPOSED,
        sources: [
          {
            title: 'Coprocessor ciphertext store (public listing)',
            url: 'https://coprocessor-1.mainnet.zama.org/',
          },
          {
            title: 'Gateway publishes encrypted decryption shares',
            url: `${FHEVM}gateway-contracts/contracts/Decryption.sol#L808-L817`,
          },
          {
            title: 'ML-KEM-512 encryption of decryption shares',
            url: `${KMS}core/service/src/cryptography/hybrid_ml_kem.rs`,
          },
        ],
      },
    },
  })
}
