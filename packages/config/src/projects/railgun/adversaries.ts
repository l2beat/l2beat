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
  'https://github.com/triamazikamno/railoxide/blob/8773f4ecb00c6ac7cf164ba1f989eb77dd4b0ec5/'

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
        exposure: `${S.entryExitPublic('Shields and unshields')} DeFi bundles unshield to the adapter in cleartext.`,
        advice: S.exitViaRelayer('broadcaster'),
        interior: INTERIOR,
        sources: [
          { contract: 'RailgunSmartWallet', title: 'Shield and unshield' },
          { contract: 'RelayAdapt', title: 'DeFi bundles' },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposure:
          'The candidates for an unshield are the shields of the same token. In-pool transfers break a one-to-one match, while timing and exact amounts narrow it.',
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
        exposure:
          'RailOxide sends all traffic over built-in Tor, broadcaster messages included, and finds your notes by decrypting every note locally.',
        advice:
          'Use RailOxide, the wallet these ratings assume, and read the chain from your own node.',
        interior: {
          ...INTERIOR,
          linkage: {
            verdict: 'atRisk',
            note: 'Private only over Tor, which RailOxide uses by default.',
          },
        },
        sources: [
          {
            title: 'RailOxide privacy model',
            url: `${RAILOXIDE}docs/privacy-model.md`,
          },
          {
            title: 'Built-in Tor is the default',
            url: `${RAILOXIDE}crates/wallet-ops/src/settings/network_chains.rs#L10-L15`,
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'good',
        exposure: `Only the user holds viewing keys, and DAO upgrades wait ${upgradeDelay}. PPoI list providers can refuse a shield, which leaves a self-broadcast exit. RailOxide builds PPoIs from a local copy of the lists, so the notes you spend stay on your device.`,
        advice:
          'Watch governance proposals and unshield before an upgrade you reject executes.',
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
            url: `${RAILOXIDE}crates/wallet-ops/src/poi_contexts.rs#L116-L150`,
          },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposure:
          'Notes are encrypted with elliptic-curve key exchange. A quantum computer decrypts every note sent to a 0zk address that was ever shared, broadcaster fee notes included.',
        advice:
          'Share your 0zk address privately, with a fresh one per counterparty where you can.',
        interior: {
          sender: 'atRisk',
          recipient: 'atRisk',
          amount: 'atRisk',
          asset: 'atRisk',
          linkage: {
            verdict: 'atRisk',
            note: 'Private only while your 0zk address stays unshared.',
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
