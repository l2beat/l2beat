import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { zcashNearIntentsAdversaries } from './adversaries'

// The route has no Ethereum contracts: the custodial bridge holds funds in plain
// accounts, so there is nothing for discovery to track. Governance and
// custody live on NEAR and Zcash and are documented in the markdown files.
export const zcashNearIntents: BaseProject = {
  id: ProjectId('zcash-near-intents'),
  slug: 'zcash-near-intents',
  name: 'Zcash via NEAR Intents',
  shortName: undefined,
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
      "A round trip from Ethereum into shielded ZEC and back through NEAR Intents, so that Zcash's shielded pool serves as the privacy pool.",
    detailedDescription: readProjectMarkdown(
      'zcash-near-intents',
      'detailedDescription',
    ),
    links: {
      websites: [
        'https://near-intents.org',
        'https://z.cash',
        'https://zodl.com',
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
        'https://github.com/zodl-inc/zodl-ios',
      ],
      socialMedia: ['https://x.com/near_intents', 'https://x.com/zodl_app'],
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
    trackedOn: ['ethereum'],
    tokens: [],
    zkCatalogId: ProjectId('zcash'),
    anonymitySet: {
      type: 'not-applicable',
      description:
        "The anonymity set is Zcash's Ironwood shielded pool, which lives outside the chains L2BEAT indexes. Payout and deposit amounts are public at the pool edge, so the effective set behind an exit is the pool entries (public on NEAR) that could match it in amount and time.",
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The Verifier can be upgraded at once by 4/5 NEAR Intents DAO members, the Zcash bridge by 3/5 Rainbow Bridge DAO members with no verified delay, and the Ethereum-side funds sit in an operator-controlled EOA, so there is no window to leave before a change takes effect.',
      walkawayTest: {
        passed: false,
        reason:
          'Ethereum deposits and withdrawals are executed off-chain by the custodial bridge operator, and Zcash withdrawals need a whitelisted relayer to trigger the MPC signature. Without the operators, only Zcash deposits that were never credited can be refunded, after a two-day timelock.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The Verifier, the custodial bridge token, the Zcash bridge and the Zodl wallet are open source, but the bridge back end, the 1Click API and the solver relay are closed services that every Ethereum leg depends on.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: zcashNearIntentsAdversaries,
    riskSummary: readProjectMarkdown('zcash-near-intents', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'zcash-near-intents',
        'upgradesAndGovernance',
      ),
    },
  },
}
