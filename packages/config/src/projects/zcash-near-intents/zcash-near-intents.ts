import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import {
  PRIVACY_EXIT_WINDOW,
  PRIVACY_REPRODUCIBILITY,
} from '../../common/privacySummaryValues'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { zcashNearIntentsAdversaries } from './adversaries'
import { zcashNearIntentsCompliance } from './compliance'
import { zcashNearIntentsRiskSummary } from './riskSummary'

// The route has no Ethereum contracts: the custodial bridge holds funds in plain
// accounts, so there is nothing for discovery to track. Governance and
// custody live on NEAR and Zcash and are documented in the markdown files.
export const zcashNearIntents: BaseProject = {
  id: ProjectId('zcash-near-intents'),
  slug: 'zcash-near-intents',
  name: 'Zcash via NEAR Intents',
  shortName: undefined,
  aliases: ['Vizor', 'Zodl', 'Zashi'],
  addedAt: UnixTime.fromDate(new Date('2026-09-15')),
  statuses: {
    yellowWarning:
      'This route has no Ethereum contracts. Real-time monitoring is not supported.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger round trip: Vizor swaps Ethereum funds into shielded ZEC and back through NEAR Intents, which custodies the Ethereum side.',
    detailedDescription: readProjectMarkdown(
      'zcash-near-intents',
      'detailedDescription',
    ),
    links: {
      websites: [
        'https://near-intents.org',
        'https://z.cash',
        'https://vizor.cash',
      ],
      documentation: [
        'https://docs.near-intents.org',
        'https://zips.z.cash/protocol/protocol.pdf',
      ],
      explorers: [
        'https://nearblocks.io/address/intents.near',
        'https://nearblocks.io/address/zcash-connector.bridge.near',
        'https://etherscan.io/address/0x2CfF890f0378a11913B6129B2E97417a2c302680',
      ],
      repositories: [
        'https://github.com/near/intents',
        'https://github.com/Near-One/btc-bridge',
        'https://github.com/Near-One/btc-light-client-contract',
        'https://github.com/defuse-protocol/defuse-frontend',
        'https://github.com/chainapsis/vizor-wallet',
      ],
      socialMedia: ['https://x.com/near_intents'],
      other: [
        'https://docs.near-intents.org/security-compliance/terms-of-service',
        'https://docs.near-intents.org/security-compliance/risk-and-compliance',
        'https://mpc-operators.nearone.org/',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: {
      name: 'Vizor for Linux',
      url: 'https://github.com/chainapsis/vizor-wallet/releases/tag/release/v0.0.66',
      since: '2026-11-18',
      delivery: {
        type: 'pinned',
        pin: {
          type: 'sha256',
          file: 'Vizor-linux-x86_64.AppImage',
          hash: 'a454901c5f0e565c76f274fc6f2881e732b9504d0410b368a55c0d101c9c4244',
        },
        rebuild:
          'https://github.com/chainapsis/vizor-wallet/blob/c4d01dc120299d9456505c3340ee7fa9520c9285/fastlane/linux/Fastfile',
      },
      version: '0.0.66',
      source: {
        repository: 'https://github.com/chainapsis/vizor-wallet',
        commit: 'c4d01dc120299d9456505c3340ee7fa9520c9285',
      },
      checkedApps: [
        {
          name: 'Zodl',
          icon: 'zodl',
          finding:
            "Each sync sends the account's transparent addresses to its lightwalletd, Zodl's own by default, which can tie the payout and exit to the account.",
          fix: 'Fetch account records through private information retrieval, as Vizor does.',
          source:
            'https://github.com/zodl-inc/slipstream/blob/80f95741896543a22262182ab37a5a05d484d2e7/core/src/engine.rs#L360-L392',
        },
        // Next finding once this one is fixed: Mixpanel gets the wallet address,
        // deposit tx hashes and withdrawal intent hashes, and Sentry tags each
        // user with the wallet address (defuse-frontend 594085d,
        // src/hooks/useSignInLogger.ts#L15-L19, src/hooks/useSetSentry.ts#L71-L76,
        // src/hooks/useMixpanelBus.ts#L9-L20).
        {
          name: 'NEAR Intents web app',
          icon: 'near-intents',
          finding:
            'Every swap runs through an account named after the connected wallet, whose one ZEC deposit address links all its round trips publicly.',
          fix: 'Swap through a fresh 1Click deposit address per quote, as Vizor does.',
          source:
            'https://github.com/defuse-protocol/defuse-frontend/blob/594085d3c7e60ce912fb62b768b12f46c4917510/src/components/DefuseSDK/features/deposit/components/DepositUIMachineProvider.tsx#L112-L121',
        },
        {
          name: 'Cake Wallet',
          icon: 'monero-cake-wallet',
          finding:
            "Its built-in Tor skips the Zcash wallet, so the lightwalletd server gets each transaction it sends with the user's IP.",
          fix: "Route the Zcash wallet's lightwalletd connections through the built-in Tor.",
          source:
            'https://github.com/cake-tech/cake_wallet/blob/ae2765659afce6b353d20504830b81198b2fc5e2/cw_zcash/lib/src/zcash_wallet.dart#L176-L200',
        },
        {
          name: 'Brave Wallet',
          icon: 'brave',
          finding:
            "The wallet is disabled in Tor windows and has no Tor setting, so Brave's Zcash and swap servers get the user's IP.",
          fix: "Offer a Tor setting that covers the wallet's Zcash sync and swap requests.",
          source:
            'https://github.com/brave/brave-core/blob/7bfa200812971b7811541ae6e5b72620abebe3a7/browser/brave_wallet/brave_wallet_context_utils.cc#L17-L20',
        },
        {
          name: 'Unstoppable Wallet',
          icon: 'unstoppable',
          finding:
            "Pays NEAR swaps into ZEC only to a transparent address, by default the account's own, which links its swaps publicly.",
          fix: 'Pay each swap to a fresh shielded address, as Vizor does.',
          source:
            'https://github.com/horizontalsystems/unstoppable-wallet-android/blob/be15af281efe5ab5b1c3ee38efd0814f8ec2c2da/walletkit/src/main/java/io/horizontalsystems/walletkit/modules/multiswap/providers/USwapProvider.kt#L754-L767',
        },
        {
          name: 'Zkool',
          icon: 'zkool',
          finding:
            "Pays swaps only to the account's transparent address, which adds a public shielding step.",
          fix: 'Pay each swap to a fresh shielded address.',
          source:
            'https://github.com/hhanh00/zkool2/blob/59a558fb7383c03b3633f015b33ef120cfbc3bdc/lib/services/swap_quote.dart#L37-L41',
        },
      ],
    },
    trackedOn: ['ethereum'],
    tokens: [],
    zkCatalogId: ProjectId('zcash'),
    anonymitySet: {
      type: 'not-applicable',
      description:
        "The set is Zcash's shielded pool, outside the chains ETHBEAT indexes. Amounts are public at the pool edge, so an exit hides among the pool entries that could match it in amount and time.",
    },
    exitWindow: {
      ...PRIVACY_EXIT_WINDOW.none,
      description:
        'The NEAR Intents multisig upgrades the Verifier and the Rainbow Bridge multisig the Zcash bridge, both instantly. The Ethereum funds sit in an EOA the operator controls.',
      walkawayTest: {
        passed: false,
        reason:
          'The custodial bridge operator executes every Ethereum deposit and withdrawal offchain. For the Zcash light client on NEAR, anyone staking 1,000 NEAR can relay after seven days, unless the Rainbow Bridge multisig rejects them.',
      },
    },
    reproducibility: {
      ...PRIVACY_REPRODUCIBILITY.partial,
      description:
        "The Verifier, the bridge token, the Zcash bridge and Vizor are open source. Vizor's Linux release rebuilds from its tag. The bridge backend, the 1Click API and the solver relay that every Ethereum leg needs are closed.",
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: zcashNearIntentsAdversaries,
    riskSummary: zcashNearIntentsRiskSummary,
    compliance: zcashNearIntentsCompliance,
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'zcash-near-intents',
        'upgradesAndGovernance',
      ),
    },
  },
}
