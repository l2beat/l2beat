import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'
import type { PrivacyExposureMap } from '../../types'

const ENGINE =
  'https://github.com/Railgun-Community/engine/blob/6e2614d53a106dd62abad91e7ce03ee4a3956138/src/'
// Railgun names no reference wallet. The cells are rated with RailOxide, the
// most private released open-source client we found.
const RAILOXIDE =
  'https://github.com/triamazikamno/railoxide/blob/7981f35afe8fe5a198a450e0cad66d37f159556e/'

const INTERIOR: PrivacyExposureMap = {
  sender: 'private',
  recipient: 'private',
  amount: { verdict: 'atRisk', note: 'Public in DeFi bundles.' },
  asset: { verdict: 'atRisk', note: 'Public in DeFi bundles.' },
  linkage: 'private',
}

/** @param upgradeDelay formatted DAO execution delay, from discovery */
export function railgunAdversaries(upgradeDelay: string) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'linkage',
      text: 'Hides everything inside the pool, including which shield funds which unshield. Shields and unshields are public.',
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'Everything inside the pool is hidden, including which shield funds which unshield.',
        exposureContinued: `${S.entryExitPublic('Shields and unshields')} DeFi bundles unshield to an adapter in cleartext.`,
        advice: S.exitViaRelayer('broadcaster'),
        interior: INTERIOR,
        sources: [
          { contract: 'RailgunSmartWallet', title: 'Shield and unshield' },
          { contract: 'RelayAdapt', title: 'DeFi bundles' },
          { contract: 'RelayAdapt7702_05ae', title: 'Swap accounts' },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposureShort:
          'The candidates for an unshield are the shields of the same token.',
        exposureContinued:
          'In-pool transfers break a one-to-one match, while timing and exact amounts narrow it.',
        advice: `${S.commonAmounts} ${S.freshExit}`,
        interior: INTERIOR,
        sources: [
          {
            title: 'A Tattered Cloak of Invisibility (arXiv:2606.25926)',
            url: 'https://arxiv.org/abs/2606.25926',
          },
          {
            title: 'The Anonymity Gap (arXiv:2608.22987)',
            url: 'https://arxiv.org/abs/2608.22987',
          },
        ],
      },
      networkObserver: {
        sentiment: 'good',
        exposureShort:
          'With a local node as direct endpoint for reads, RailOxide keeps Ethereum reads local and sends the rest over built-in Tor.',
        exposureContinued:
          'By default public RPCs get the reads that name the user, each over its own Tor circuit, so only timing ties them.',
        advice:
          'Before unlocking, set a local Ethereum node as the direct endpoint for reads, and keep one public endpoint for submissions.',
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only with a local node as the direct endpoint for reads.',
          },
        },
        sources: [
          {
            title: 'An endpoint can bypass Tor',
            url: `${RAILOXIDE}crates/wallet-ops/src/rpc_broker/model.rs#L800-L808`,
          },
          {
            title: 'Each request goes only to endpoints whose roles allow it',
            url: `${RAILOXIDE}crates/wallet-ops/src/rpc_broker/model.rs#L830-L869`,
          },
          {
            title: 'Sensitive reads go over their own isolated route',
            url: `${RAILOXIDE}crates/wallet-ops/src/public_wallet/balances.rs#L152-L160`,
          },
          {
            title: 'An isolated route never shares a Tor circuit',
            url: `${RAILOXIDE}crates/wallet-ops/src/http.rs#L844-L857`,
          },
          {
            title: 'A custom RPC list replaces the public pool',
            url: `${RAILOXIDE}crates/wallet-ops/src/settings/effective.rs#L267-L278`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'good',
        exposureShort: `Only the user holds viewing keys, and DAO upgrades wait ${upgradeDelay}.`,
        exposureContinued:
          "PPoI list providers can refuse a shield, which leaves a self-broadcast exit. RailOxide builds PPoIs from a local copy of the lists. After each transaction it sends the PPoI node only that transaction's new notes with their proofs.",
        advice:
          'Watch governance proposals and unshield before an upgrade the user rejects executes.',
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only with a wallet that builds PPoIs locally, like RailOxide.',
          },
        },
        sources: [
          { section: 'upgrades-and-governance' },
          {
            title: 'RailOxide builds PPoIs locally',
            url: `${RAILOXIDE}crates/wallet-ops/src/poi_contexts.rs#L116-L152`,
          },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposureShort: 'Notes are encrypted with elliptic-curve key exchange.',
        exposureContinued:
          'Whoever breaks elliptic-curve cryptography decrypts every note sent to a 0zk address they know. A user who gives theirs to payers depends on each of them keeping it private.',
        advice:
          "Share the user's 0zk address privately, with a fresh one per counterparty where possible.",
        interior: {
          sender: 'atRisk',
          recipient: 'atRisk',
          amount: 'atRisk',
          asset: 'atRisk',
          linkage: {
            verdict: 'atRisk',
            note: "Private only while the user's 0zk address stays unshared.",
          },
        },
        sources: [
          {
            title: 'Shared key derivation (Ed25519 ECDH)',
            url: `${ENGINE}utils/keys-utils.ts#L186-L224`,
          },
          {
            title: 'AES-GCM note encryption',
            url: `${ENGINE}utils/encryption/aes.ts#L24-L40`,
          },
        ],
      },
    },
  })
}
