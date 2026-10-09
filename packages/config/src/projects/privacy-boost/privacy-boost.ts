import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { privacyBoostAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('privacy-boost')

// PrivacyBoost measures exit delays and auth-root staleness in blocks.
const BASE_BLOCK_TIME = 2
const BASE_CHAIN_ID = 8453

const pool = discovery.getContract('PrivacyBoost')
const adminMultisigStats = discovery.getMultisigStats('AdminMultisig')
const PRIVACY_BOOST_SINCE_TIMESTAMP = UnixTime(pool.sinceTimestamp ?? 0)

const forcedWithdrawalDelay =
  discovery.getContractValue<number>('PrivacyBoost', 'forcedWithdrawalDelay') *
  BASE_BLOCK_TIME
const epochAuthStaleness =
  discovery.getContractValue<number>(
    'PrivacyBoost',
    'maxEpochAuthStalenessBlocks',
  ) * BASE_BLOCK_TIME
const maxForcedInputs = discovery.getContractValue<number>(
  'PrivacyBoost',
  'maxForcedInputs',
)
const portalSweepFeeBps = discovery.getContractValue<number>(
  'PrivacyBoost',
  'portalSweepFeeBps',
)
const withdrawFeeBps = discovery.getContractValue<number>(
  'PrivacyBoost',
  'withdrawFeeBps',
)

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const poolAddress = ChainSpecificAddress.address(pool.address)

// The registry lists dozens of long-tail tokens and vault shares, most of them
// unused. Only the tokens below are tracked; others must be added here (and to
// the token list) to be counted.
const TRACKED_TOKENS = [
  '0x4200000000000000000000000000000000000006', // WETH
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
  '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC
  '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42', // EURC
  '0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82', // SOL
  '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // USDT
  '0x940181a94A35A4569E4529A3CDfB74e38FD98631', // AERO
  '0xB2000000000000000000004c27f6523082f41D01', // Basecat
  '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', // wstETH
  '0xb200000000000000000000C2e324d24d7eEcd1fb', // AAPLc
  '0xcb585250f852C6c6bf90434AB21A00f02833a4af', // cbXRP
  '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4', // TOSHI
  '0x532f27101965dd16442E59d40670FaF5eBB142E4', // BRETT
  '0xbeeff7aE5E00Aae3Db302e4B0d8C883810a58100', // bbqUSDC
  '0x1deEfABEe758AAbdC29a542B24ca3b75aFD56765', // gtusdcf
  '0xFeFeC33668E22677c4762d0853d56245a800ff08', // gtwethb
  '0x1D3b1Cd0a0f242d598834b3F2d126dC6bd774657', // CSUSDC
  '0x5435BC53f2C61298167cdB11Cdf0Db2BFa259ca0', // edgeUSDC
].map(EthereumAddress)

const registryTokens = new Set(
  discovery
    .getContractValue<{ tokenAddress: string }[]>('TokenRegistry', 'tokens')
    .map((token) =>
      ChainSpecificAddress.address(token.tokenAddress as ChainSpecificAddress),
    ),
)

const registeredTokens = TRACKED_TOKENS.map((address) => {
  assert(
    registryTokens.has(address),
    `Privacy Boost: ${address} is not in the TokenRegistry`,
  )
  return {
    address,
    tokenInfo: getTokenByAddress(address.toString(), BASE_CHAIN_ID),
  }
})

// The pool's own events carry no usable amounts: epoch withdrawals settle in
// batches without per-withdrawal events, and the deposit event signature
// changed with the September 2026 upgrade. Flows are therefore tracked as
// gross ERC-20 transfers across the pool boundary. What that includes is
// spelled out for users in detailedDescription.md.
const privacyTokens: ProjectPrivacyToken[] = registeredTokens.map(
  ({ address, tokenInfo }) => {
    // Prices must cover the whole bucket range, so never start before listing.
    const sinceTimestamp = Math.max(
      PRIVACY_BOOST_SINCE_TIMESTAMP,
      tokenInfo.coingeckoListingTimestamp,
    )

    return {
      token: {
        address: address.toString(),
        iconUrl: tokenInfo.iconUrl,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        priceId: tokenInfo.coingeckoId,
        sinceTimestamp,
      },
      buckets: [
        {
          id: `privacy-boost-${tokenInfo.symbol}`,
          type: 'pool',
          label: tokenInfo.symbol,
          address: pool.address,
          sinceTimestamp,
          deposit: {
            event: ERC20_TRANSFER_EVENT,
            extractor: 'erc20Transfer',
            params: { to: poolAddress },
          },
          withdrawal: {
            event: ERC20_TRANSFER_EVENT,
            extractor: 'erc20Transfer',
            params: { from: poolAddress },
          },
        },
      ],
    }
  },
)

export const privacyBoost: BaseProject = {
  id: ProjectId('privacy-boost'),
  slug: 'privacy-boost',
  name: 'Privacy Boost',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-08-18')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A shielded ledger for ERC-20 tokens on Base, aimed at institutional users, whose privacy rests on the operator's TEE.",
    detailedDescription: readProjectMarkdown(
      'privacy-boost',
      'detailedDescription',
      {
        forcedWithdrawalDelay: formatSeconds(forcedWithdrawalDelay, {
          fullUnit: true,
        }),
        epochAuthStaleness: formatSeconds(epochAuthStaleness, {
          fullUnit: true,
        }),
        withdrawFee: formatBasisPoints(withdrawFeeBps),
        portalSweepFee: formatBasisPoints(portalSweepFeeBps),
        maxForcedInputs: String(maxForcedInputs),
        auditorCount: discovery.getContractValue<string[]>(
          'AuditGateway',
          'getAllAuditors',
        ).length,
      },
    ),
    links: {
      websites: ['https://www.privacyboost.io/'],
      documentation: ['https://docs.privacyboost.io/'],
      repositories: [
        'https://github.com/sunnyside-io/privacy-boost-protocol',
        'https://github.com/sunnyside-io/privacy-boost-ceremony',
      ],
    },
    badges: [],
  },
  escrows: [
    {
      address: poolAddress,
      chain: ChainSpecificAddress.longChain(pool.address),
      sinceTimestamp: PRIVACY_BOOST_SINCE_TIMESTAMP,
      tokens: registeredTokens.map((token) => token.tokenInfo.symbol),
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Sunnyside Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.Groth16.Gnark,
        ZK_CATALOG_TAGS.Arithmetization.R1CS,
        ZK_CATALOG_TAGS.Other.CustomCircuits,
      ],
    },
    proofSystemInfo: readProjectMarkdown('privacy-boost', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        ...TRUSTED_SETUPS.PrivacyBoostv3,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('privacy-boost'),
        sinceTimestamp: PRIVACY_BOOST_SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Privacy Boost epoch verifier 23.09.2026',
        name: 'Privacy Boost epoch verifier, 9 circuits',
        description:
          'Verifies the batched private transfer and withdrawal proofs. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/5792c139b9529ed80643262d75b5489055be11b0/frontend/epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'base:0xB144eb785E2CCe17681395Cd475093C01AEeb11e',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost deposit verifier 09.09.2026',
        name: 'Privacy Boost deposit verifier, 3 circuits',
        description: 'Verifies the batched deposit epoch proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/9e3f34e1a91c20497bc7d8f47492761bc868843c/frontend/deposit_epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'base:0xac60252EF8dbC139e0da63cE7F2a13D25a5B627d',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-deposit-09.09.2026',
        ),
      },
      {
        hash: 'Privacy Boost forced withdrawal verifier 23.09.2026',
        name: 'Privacy Boost forced withdrawal verifier, 1 circuit',
        description:
          'Verifies the client-side forced withdrawal proofs. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/5792c139b9529ed80643262d75b5489055be11b0/frontend/forced_withdraw_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'base:0x40e93d3357A5A3d249437717Da936f6141ba85cE',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost portal deposit verifier 09.09.2026',
        name: 'Privacy Boost portal deposit verifier, 2 circuits',
        description:
          'Verifies the batched hidden-recipient portal deposit proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/9e3f34e1a91c20497bc7d8f47492761bc868843c/frontend/deposit_portal_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'base:0x0c8bb018a3d8DF4c5fC86518ca57F8E1445BCF63',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-portal-09.09.2026',
        ),
      },
      {
        hash: 'Privacy Boost gift claim verifier 23.09.2026',
        name: 'Privacy Boost gift claim verifier, 2 circuits',
        description:
          'Verifies the batched gift claim, refund and public gift exit proofs. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/5792c139b9529ed80643262d75b5489055be11b0/frontend/gift_claim_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'base:0x8f394a08A7544daf39aF38FEA5B2E348180bDC05',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    tokens: privacyTokens,
    trackedOn: ['base'],
    anonymitySet: { type: 'too-small' },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The admin multisig upgrades the pool and both registries instantly through their ProxyAdmins.',
      walkawayTest: {
        passed: false,
        reason:
          'Without the TEE operator, deposits and private transfers stop and only forced withdrawals remain.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        "The circuits are published. The epoch, forced withdrawal and gift claim verification keys deployed in September 2026 remain unreproduced, and the source code of the TEE and of the SDK's compiled core is unpublished.",
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: privacyBoostAdversaries,
    riskSummary: readProjectMarkdown('privacy-boost', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('privacy-boost', 'upgradesAndGovernance', {
        adminMultisigStats,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: getPrivacyBoostVerifiers(),
  },
}

function getPrivacyBoostVerifiers(): ChainSpecificAddress[] {
  return [
    discovery.getContractValue<ChainSpecificAddress>(
      'PrivacyBoost',
      'depositVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      'PrivacyBoost',
      'epochVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      'PrivacyBoost',
      'forcedVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      'PrivacyBoost',
      'portalDepositVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      'PrivacyBoost',
      'giftClaimVerifier',
    ),
  ]
}
