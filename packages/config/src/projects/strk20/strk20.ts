import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const STRK20_POOL = {
  chain: 'starknet',
  address: '0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
}
const STRK20_DEPOSIT_EVENT =
  '0x9149d2123147c5f43d258257fef0b7b969db78269369ebcf5ebb9eef8592f2'
const STRK20_WITHDRAWAL_EVENT =
  '0x2eed7e29b3502a726faf503ac4316b7101f3da813654e8df02c13449e03da8'
const STRK20_SINCE = UnixTime.fromDate(new Date('2026-06-17'))

export const strk20: BaseProject = {
  id: ProjectId('strk20'),
  slug: 'strk20',
  name: 'STRK-20',
  shortName: undefined,
  addedAt: STRK20_SINCE,
  statuses: {
    yellowWarning:
      'The proven program is not made available so it is unknown what logic is verified by the smart contract. Furthermore, real-time monitoring for this project is not supported.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A privacy pool on Starknet for arbitrary-amount private transfers and DeFi actions, using Cairo execution proofs and auditor-accessible compliance data.',
    detailedDescription: readProjectMarkdown('strk20', 'detailedDescription'),
    links: {
      documentation: [
        'https://docs.starknet.io/build/starknet-privacy/overview',
      ],
      websites: ['https://strk20.starknet.io/'],
      explorers: [
        'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a',
      ],
      other: ['https://eprint.iacr.org/2026/474'],
    },
    badges: [],
  },
  privacyInfo: {
    tokens: [
      {
        token: {
          address:
            '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
          iconUrl:
            'https://assets.coingecko.com/coins/images/26433/large/starknet.png?1696525507',
          symbol: 'STRK',
          decimals: 18,
          priceId: 'starknet',
          sinceTimestamp: STRK20_SINCE,
        },
        buckets: [
          {
            id: 'strk20-STRK',
            type: 'pool',
            label: 'STRK pool',
            address: STRK20_POOL,
            sinceTimestamp: STRK20_SINCE,
            deposit: {
              event: STRK20_DEPOSIT_EVENT,
              extractor: 'strk20Deposit',
              params: {
                tokenAddress:
                  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
              },
            },
            withdrawal: {
              event: STRK20_WITHDRAWAL_EVENT,
              extractor: 'strk20Withdrawal',
              params: {
                tokenAddress:
                  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
              },
            },
          },
        ],
      },
      {
        token: {
          address:
            '0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
          iconUrl:
            'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696501661',
          symbol: 'USDC',
          decimals: 6,
          priceId: 'usd-coin',
          sinceTimestamp: STRK20_SINCE,
        },
        buckets: [
          {
            id: 'strk20-USDC',
            type: 'pool',
            label: 'USDC pool',
            address: STRK20_POOL,
            sinceTimestamp: STRK20_SINCE,
            deposit: {
              event: STRK20_DEPOSIT_EVENT,
              extractor: 'strk20Deposit',
              params: {
                tokenAddress:
                  '0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
              },
            },
            withdrawal: {
              event: STRK20_WITHDRAWAL_EVENT,
              extractor: 'strk20Withdrawal',
              params: {
                tokenAddress:
                  '0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
              },
            },
          },
        ],
      },
    ],
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The pool implementation is immediately upgradeable, so users have no delay to withdraw before a malicious upgrade can take effect.',
      walkawayTest: {
        passed: false,
        reason:
          'Currently, only centrally operated provers can generate ZK proofs for interacting with STRK-20.',
      },
    },
    reproducibility: {
      value: 'Not published',
      sentiment: 'bad',
      description:
        'The STRK-20 protocol program and the sources for proving stack are not published. Users cannot independently verify the correctness of STRK-20 ZK program. They also cannot generate required ZK proofs locally and are forced to reveal private data to third party - the prover.',
    },
    privacy: {
      value: 'Admin view key',
      sentiment: 'bad',
      description:
        'All private actions include auditor-encrypted metadata, so whoever controls the auditor private key can decrypt user activity retroactively. Users can not know whether their privacy was violated. Compliance is facilitated by this mandatory auditor-encrypted metadata.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    quantumResistant: true,
    riskSummary: readProjectMarkdown('strk20', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'strk20',
      'upgradesAndGovernance',
    ),
  },
}
