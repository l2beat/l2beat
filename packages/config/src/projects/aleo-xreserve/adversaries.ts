import {
  ADVICE_SNIPPETS as A,
  definePrivacyAdversaries,
  toolLink,
} from '../../common/privacyAdversaries'
import type { ProjectPrivacyReferenceApp } from '../../types'

const EXPLORER = 'https://explorer.provable.com/program/'
// Leo source of the token, freeze list and bridge v1. The deployed token
// differs from it in the compliance address, so cells cite the deployed
// programs and use this only for the record layout.
const STABLECOIN_SOURCE =
  'https://github.com/ProvableHQ/compliant-stablecoin/blob/8f4a4ac400706d43deb94d4f9f1f299f593df31e/'
const SNARKVM =
  'https://github.com/ProvableHQ/snarkVM/blob/c2909c55efb0c2202e7471e3e2efd73de1c4a468/'
const BRIDGE_DOCS = 'https://docs.aleo.org/build/common-uses/usdcx_bridge'
const SHIELD_EXTENSION =
  'https://chromewebstore.google.com/detail/hhddpjpacfjaakjioinajgmhlbhfchao'

export const REFERENCE_APP: ProjectPrivacyReferenceApp = {
  name: 'Shield Swap with the Shield wallet',
  icon: 'shield-wallet',
  url: 'https://swap.shield.fi',
  since: '2026-11-16',
  // The Ethereum legs run in the hosted page, the Aleo side in the Shield
  // extension 1.47.0 (crx sha256 36b56f68…e88d), which the App section covers.
  build: 'dpl_JdZuPtCo67A6NCkouRDNN4kTnSui',
  checked: '2026-11-16',
  delivery: { type: 'hosted' },
  checkedApps: [
    {
      name: 'alcove',
      icon: 'alcove',
      finding:
        'Proves every transaction on a remote service, which receives its sender, recipient and amount.',
      fix: 'Offer local proving, as the Shield wallet does.',
      source: 'https://alcovewallet.com/privacy-policy.html',
      checked: '2026-11-16',
    },
  ],
}

export const aleoXreserveAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides which USDC leaving Ethereum comes back as which, by passing through private USDCx records on Aleo. The Ethereum deposit and withdrawal show address and amount.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'The private mint hides which Aleo account a deposit funds, and the private burn hides which account a withdrawal leaves from.',
      exposureContinued:
        "Inside Aleo, private transfers hide sender, recipient and amount. Provable's fee sponsor pays the network fees, so no fee names the user.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: {
          verdict: 'exposed',
          note: 'Only USDCx moves along this route.',
        },
        linkage: 'private',
      },
      sources: [
        {
          title:
            'Wrapper: private mint to a committed recipient, private burn (read 2026-11-16)',
          url: `${EXPLORER}shielded_usdcx_wrapper.aleo`,
        },
        {
          title: 'USDCx bridge guide: shielded mints (2026-11-16)',
          url: BRIDGE_DOCS,
        },
        {
          title: 'Private transfer hides sender, recipient and amount',
          url: `${STABLECOIN_SOURCE}stablecoin_program/src/main.leo#L617-L645`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        'Only 160 Ethereum addresses have deposited to Aleo since January 2026, and both ends show amount and time.',
      exposureContinued:
        'Just 35 of them used the private mint, and one trading account made 490 of its 589 deposits.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Amount and timing across Aleo pair a deposit with a later withdrawal.',
        },
      },
      sources: [
        {
          title: 'Aleo depositors counted from DepositedToRemote (2026-11-16)',
          url: 'https://etherscan.io/address/0x8888888199b2Df864bf678259607d6D5EBb4e3Ce#events',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposureShort:
        "Mixpanel can tie both legs to one browser unless the user turns on Do Not Track and turns the wallet's analytics off.",
      exposureContinued: `Provable's servers block Tor, so ${toolLink('nymVpn')} is the IP-hiding route that works. Sentry receives a session per wallet screen whatever the analytics choice.`,
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: "Private only over NymVPN, with Do Not Track on and the wallet's analytics off.",
        },
      },
      sources: [
        {
          title:
            'Shield Swap: Mixpanel browser id on each page load, none with Do Not Track (2026-11-16)',
          url: 'https://swap.shield.fi',
        },
        {
          title:
            'Shield 1.47.0: analytics checkbox pre-checked, Sentry not gated (2026-11-16)',
          url: SHIELD_EXTENSION,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        'A compliance key decrypts sender, recipient and amount of every private USDCx action, the private mint and burn included.',
      exposureContinued:
        "Aleo's documentation says Circle uses these records. Provable's record scanner also receives every Shield user's view key, and Shield Swap is hosted and closed.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title:
            'Every private function outputs a ComplianceRecord to one fixed address (read 2026-11-16)',
          url: `${EXPLORER}usdcx_stablecoin.aleo`,
        },
        {
          title: 'USDCx bridge guide: "Circle uses these records" (2026-11-16)',
          url: BRIDGE_DOCS,
        },
        {
          title:
            "Shield 1.47.0 registers the view key with Provable's scanner, no attestation check (2026-11-16)",
          url: SHIELD_EXTENSION,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'Whoever breaks elliptic-curve cryptography recovers the compliance view key from its address in the program and decrypts every compliance record.',
      exposureContinued:
        'Those records name sender, recipient and amount of every private mint, transfer and burn.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Record keys come from the owner address and a public nonce',
          url: `${SNARKVM}console/program/src/data/record/encrypt.rs#L28-L40`,
        },
        {
          title:
            'Compliance address hardcoded in the token program (read 2026-11-16)',
          url: `${EXPLORER}usdcx_stablecoin.aleo`,
        },
      ],
    },
  },
  advice: [
    {
      name: 'Set up',
      text: `In Chrome's privacy settings, turn on sending a "Do Not Track" request. Run Chrome with all traffic through ${toolLink('nymVpn')}, since Provable's servers block Tor.`,
      against: ['networkObserver'],
      outside: true,
    },
    {
      name: 'Install',
      text: 'Untick analytics when the Shield wallet asks during setup.',
      against: ['networkObserver'],
    },
    {
      name: 'Deposit',
      text: A.commonAmounts,
      against: ['chainAnalyst'],
    },
    {
      name: 'Wait',
      text: A.wait,
      against: ['chainAnalyst'],
      randomWait: true,
    },
    {
      name: 'Withdraw',
      text: A.freshAddress,
      against: ['chainAnalyst'],
    },
  ],
})
