import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

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

export const privacyBoostAdversaries = definePrivacyAdversaries({
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
      interior: INTERIOR,
      sources: [
        { contract: 'PrivacyBoost' },
        {
          title: 'Epoch calldata: withdrawals, nullifiers and transfer shapes',
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
      exposureContinued:
        'Most pool activity is one address that keeps depositing and withdrawing 0.001 WETH, which an analyst can filter out.',
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
      sources: [
        {
          title: 'Address with 0.001 WETH round trips',
          url: 'https://basescan.org/address/0xf977237b7d978dde922ee4909619740c73d8a49b',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        'Anyone on your network path sees when your wallet deposits and when the app contacts the operator, and can match both to the chain.',
      exposureContinued: 'The SDK has no Tor or proxy setting.',
      advice: 'Route the app through Tor with system-wide tools.',
      interior: {
        ...INTERIOR,
        linkage: {
          verdict: 'atRisk',
          note: 'Private only over Tor, which the SDK lacks.',
        },
      },
      sources: [
        {
          title: 'Operator endpoint',
          url: 'https://base.privacyboost.io/api/v1/info',
        },
        { title: 'SDK 1.2.5, configured with one server URL', url: SDK },
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
        { contract: 'AuditGateway' },
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
        "Every note wraps its key to the enclave's long-lived elliptic-curve public key as well as the receiver's.",
      exposureContinued:
        'Whoever breaks elliptic-curve cryptography or obtains that one key decrypts the entire history.',
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
