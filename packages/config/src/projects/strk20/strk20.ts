import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
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
const STRK20_POOL_SINCE = UnixTime.fromDate(new Date('2026-04-20T10:08:48Z'))
const STRK20_STRKBTC_SINCE = UnixTime(1777893725)
const STRK20_TOKENS = [
  {
    address:
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    iconUrl:
      'https://assets.coingecko.com/coins/images/26433/large/starknet.png?1696525507',
    symbol: 'STRK',
    decimals: 18,
    priceId: 'starknet',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
  {
    address:
      '0x033068f6539f8e6e6b131e6b2b814e6c34a5224bc66947c47dab9dfee93b35fb',
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696501661',
    symbol: 'USDC',
    decimals: 6,
    priceId: 'usd-coin',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
  {
    address:
      '0x0787150e306e6eae6e3f79dea881770e8bbff2c1b8eb490f969669ee945b3135',
    iconUrl:
      'https://coin-images.coingecko.com/coins/images/102173511/large/strkBTC_Logo.png?1779888214',
    symbol: 'strkBTC',
    decimals: 8,
    priceId: 'strkbtc',
    sinceTimestamp: STRK20_STRKBTC_SINCE,
  },
  {
    address:
      '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    iconUrl:
      'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1696507857',
    symbol: 'WBTC',
    decimals: 8,
    priceId: 'wrapped-bitcoin',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
  {
    address:
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    iconUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    symbol: 'ETH',
    decimals: 18,
    priceId: 'ethereum',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
  {
    address:
      '0x028d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a',
    iconUrl:
      'https://assets.coingecko.com/coins/images/54172/standard/logo200x200.png?1738561141',
    symbol: 'XSTRK',
    decimals: 18,
    priceId: 'endur-fi-staked-strk',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
  {
    address:
      '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    iconUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
    decimals: 6,
    symbol: 'USDT',
    priceId: 'tether',
    sinceTimestamp: STRK20_POOL_SINCE,
  },
] as const

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
    tokens: getPrivacyTokens(),
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
    upgradesAndGovernance: {
      content: readProjectMarkdown('strk20', 'upgradesAndGovernance'),
    },
  },
}

function getPrivacyTokens(): ProjectPrivacyToken[] {
  return STRK20_TOKENS.map((token) => ({
    token,
    buckets: [
      {
        id: `strk20-${token.symbol}`,
        type: 'pool',
        label: `${token.symbol} pool`,
        address: STRK20_POOL,
        sinceTimestamp: token.sinceTimestamp,
        deposit: {
          event: STRK20_DEPOSIT_EVENT,
          extractor: 'strk20Deposit',
          params: { tokenAddress: token.address },
        },
        withdrawal: {
          event: STRK20_WITHDRAWAL_EVENT,
          extractor: 'strk20Withdrawal',
          params: { tokenAddress: token.address },
        },
      },
    ],
  }))
}
