import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type {
  PrivacyAdversaryAssessment,
  PrivacyExposureMap,
} from '../../types'

const PROTOCOL =
  'https://github.com/sunnyside-io/privacy-boost-protocol/blob/5792c139b9529ed80643262d75b5489055be11b0/contracts/src/'
const SDK = 'https://www.npmjs.com/package/@sunnyside-io/privacy-boost/v/1.2.5'

const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: { verdict: 'atRisk', note: 'Public in gateway DeFi legs.' },
  asset: { verdict: 'atRisk', note: 'Public in gateway DeFi legs.' },
  linkage: 'private',
}

/** What differs between the deployments: each has its own contracts and its own traffic. */
export interface PrivacyBoostAdversariesDeployment {
  /** Discovery names of the deployment's contracts. */
  contracts: { pool: string; auditGateway: string }
  /** The anonymity set is rated from the deployment's own deposits. */
  chainAnalyst: Pick<
    PrivacyAdversaryAssessment,
    'exposureContinued' | 'sources'
  >
}

export function getPrivacyBoostAdversaries({
  contracts,
  chainAnalyst,
}: PrivacyBoostAdversariesDeployment) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides everything inside the ledger, including which deposits fund a withdrawal. Deposits and withdrawals are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort: 'Transfers inside publish only encrypted notes.',
        exposureContinued: `${S.entryExitPublic()} Each epoch pairs every exit with the nullifiers and note shape of the transfer that funded it. Forced withdrawals publish the spent notes and the account, public gift exits the destination.`,
        advice: "Exit through the operator's relay.",
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Exposed in a forced withdrawal.',
          },
        },
        sources: [
          { contract: contracts.pool },
          {
            title:
              'Epoch calldata: withdrawals, nullifiers and transfer shapes',
            url: `${PROTOCOL}interfaces/IPrivacyBoost.sol#L828-L852`,
          },
          {
            title: 'Forced withdrawal publishes account and notes',
            url: `${PROTOCOL}interfaces/IPrivacyBoost.sol#L582-L591`,
          },
          {
            title: 'Public gift exit names the destination',
            url: `${PROTOCOL}interfaces/IPrivacyBoost.sol#L707`,
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'bad',
        exposureShort: 'The anonymity set is very small.',
        ...chainAnalyst,
        interior: {
          sender: 'atRisk',
          recipient: 'atRisk',
          amount: {
            verdict: 'atRisk',
            note: 'Bounded by the public deposit and exit amounts.',
          },
          asset: 'atRisk',
          linkage: {
            verdict: 'exposed',
            note: 'The set is too small to hide in.',
          },
        },
      },
      networkObserver: {
        sentiment: 'bad',
        exposureShort:
          "Alchemy, under the operator's key, sees the signed-in wallet in the session that submits each withdrawal, so it can pair them by timing.",
        exposureContinued:
          "The hosted wallet works over Tor but has no RPC setting to leave Alchemy out. Its key core runs in an iframe without network access and reaches only the operator's server and Alchemy through the page. Other third parties get token ids or nothing.",
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only on a busy pool, since Alchemy sees the wallet in each withdrawal session.',
          },
        },
        sources: [
          {
            title: 'Operator endpoint',
            url: 'https://base.privacyboost.io/api/v1/info',
          },
          { title: 'SDK 1.2.5, configured with one server URL', url: SDK },
          {
            title:
              'The compiled core builds and sends every request, its Rust source is unpublished',
            url: SDK + '?activeTab=code',
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort:
          "The operator's enclave holds every transfer in plaintext and a key to every note.",
        exposureContinued:
          "The SDK trusts the enclave key it fetches from the operator's endpoint. Auditors appointed by the admin can pull any account's history without consent.",
        interior: {
          sender: 'exposed',
          recipient: 'exposed',
          amount: 'exposed',
          asset: 'exposed',
          linkage: 'exposed',
        },
        sources: [
          { contract: contracts.auditGateway },
          { section: 'permissions', title: 'Admin and operator multisigs' },
          { title: 'SDK fetches the enclave key from the endpoint', url: SDK },
          {
            title: 'Notes wrap a key for the enclave beside the receiver',
            url: `${PROTOCOL}interfaces/IStructs.sol#L36-L56`,
          },
        ],
      },
      futureAdversary: {
        sentiment: 'bad',
        exposureShort:
          "Whoever breaks elliptic-curve cryptography decrypts every note, since each one also wraps its key to the enclave's long-lived public key.",
        exposureContinued:
          'That one key opens the entire history, deposits included.',
        interior: {
          sender: 'exposed',
          recipient: 'exposed',
          amount: 'exposed',
          asset: 'exposed',
          linkage: 'exposed',
        },
        sources: [
          {
            title: 'Every output and deposit ciphertext carries an enclave key',
            url: `${PROTOCOL}interfaces/IStructs.sol#L36-L125`,
          },
        ],
      },
    },
  })
}
