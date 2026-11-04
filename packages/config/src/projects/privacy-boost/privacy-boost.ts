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
import { getTokenBySymbol } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { privacyBoostAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('privacy-boost')

interface PrivacyBoostDeployment {
  chain: string
  chainId: number
  /** Tokens tracked on this chain, by symbol in the token list. */
  tokens: string[]
}

// The primary chain comes first. Bucket ids on Base predate Optimism and
// stay as they are, so no Base data resyncs. The registry lists dozens of
// long-tail tokens and vault shares, most of them unused. Only the tokens
// below are tracked; others must be added here (and to the token list) to
// be counted.
const DEPLOYMENTS: PrivacyBoostDeployment[] = [
  {
    chain: 'base',
    chainId: 8453,
    tokens: [
      'WETH',
      'USDC',
      'cbBTC',
      'EURC',
      'SOL',
      'USDT',
      'AERO',
      'Basecat',
      'wstETH',
      'AAPLc',
      'cbXRP',
      'TOSHI',
      'BRETT',
      'bbqUSDC',
      'gtusdcf',
      'gtwethb',
      'CSUSDC',
      'edgeUSDC',
    ],
  },
  {
    chain: 'optimism',
    chainId: 10,
    tokens: ['USDC', 'OP'],
  },
]

// Deployments with pools too small to track, shown as dimmed icons.
const UNTRACKED_DEPLOYMENTS = ['soneium', 'ink']

// PrivacyBoost measures exit delays and auth-root staleness in blocks. The
// parameters in the descriptions come from Base, the primary chain. Contract
// names repeat across chains, so lookups name the chain.
const BASE_BLOCK_TIME = 2

const pool = discovery.getContract('PrivacyBoost', 'base')
const adminMultisigStats = discovery.getMultisigStats(
  discovery.getContract('AdminMultisig', 'base').address.toString(),
)
const PRIVACY_BOOST_SINCE_TIMESTAMP = UnixTime(
  Math.min(
    ...DEPLOYMENTS.map(
      (deployment) =>
        discovery.getContract('PrivacyBoost', deployment.chain)
          .sinceTimestamp ?? 0,
    ),
  ),
)

const forcedWithdrawalDelay =
  discovery.getContractValue<number>(pool.address, 'forcedWithdrawalDelay') *
  BASE_BLOCK_TIME
const epochAuthStaleness =
  discovery.getContractValue<number>(
    pool.address,
    'maxEpochAuthStalenessBlocks',
  ) * BASE_BLOCK_TIME
const maxForcedInputs = discovery.getContractValue<number>(
  pool.address,
  'maxForcedInputs',
)
const portalSweepFeeBps = discovery.getContractValue<number>(
  pool.address,
  'portalSweepFeeBps',
)
const withdrawFeeBps = discovery.getContractValue<number>(
  pool.address,
  'withdrawFeeBps',
)
const auditorCount = discovery.getContractValue<string[]>(
  discovery.getContract('AuditGateway', 'base').address,
  'getAllAuditors',
).length

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

// The pool's own events carry no usable amounts: epoch withdrawals settle in
// batches without per-withdrawal events, and the deposit event signature
// changed with the September 2026 upgrade. Flows are therefore tracked as
// gross ERC-20 transfers across the pool boundary. What that includes is
// spelled out for users in detailedDescription.md.
const privacyTokens: ProjectPrivacyToken[] = DEPLOYMENTS.flatMap(
  (deployment) => {
    const chainPool = discovery.getContract('PrivacyBoost', deployment.chain)
    const chainPoolAddress = ChainSpecificAddress.address(chainPool.address)
    const chainSinceTimestamp = UnixTime(chainPool.sinceTimestamp ?? 0)
    const registryTokens = new Set(
      discovery
        .getContractValue<{ tokenAddress: string }[]>(
          discovery.getContract('TokenRegistry', deployment.chain).address,
          'tokens',
        )
        .map((token) =>
          ChainSpecificAddress.address(
            token.tokenAddress as ChainSpecificAddress,
          ),
        ),
    )

    return deployment.tokens.map((symbol) => {
      const tokenInfo = getTokenBySymbol(symbol, deployment.chainId)
      const address = EthereumAddress(tokenInfo.address ?? '')
      assert(
        registryTokens.has(address),
        `Privacy Boost: ${symbol} is not in the ${deployment.chain} TokenRegistry`,
      )
      // Prices must cover the whole bucket range, so never start before listing.
      const sinceTimestamp = Math.max(
        chainSinceTimestamp,
        tokenInfo.coingeckoListingTimestamp,
      )
      const bucketId =
        deployment.chain === 'base'
          ? `privacy-boost-${tokenInfo.symbol}`
          : `privacy-boost-${deployment.chain}-${tokenInfo.symbol}`

      return {
        token: {
          chain: deployment.chain,
          address: address.toString(),
          iconUrl: tokenInfo.iconUrl,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          priceId: tokenInfo.coingeckoId,
          sinceTimestamp,
        },
        buckets: [
          {
            id: bucketId,
            type: 'pool',
            label: tokenInfo.symbol,
            address: chainPool.address,
            sinceTimestamp,
            deposit: {
              event: ERC20_TRANSFER_EVENT,
              extractor: 'erc20Transfer',
              params: { to: chainPoolAddress },
            },
            withdrawal: {
              event: ERC20_TRANSFER_EVENT,
              extractor: 'erc20Transfer',
              params: { from: chainPoolAddress },
            },
          },
        ],
      }
    })
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
      "A shielded ledger for ERC-20 tokens on Base and OP Mainnet, aimed at institutional users, whose privacy rests on the operator's TEE.",
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
        auditorCount,
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
  milestones: [
    {
      // Pool proxy deployed on OP Mainnet 2026-04-14 (tx 0xdcf02ee3…).
      title: 'Privacy Boost live on OP Mainnet',
      url: 'https://optimism.io/blog/privacy-comes-to-the-op-stack',
      date: '2026-04-20T00:00:00Z',
      description:
        'Sunnyside Labs opens Privacy Boost to its customers on OP Mainnet.',
      type: 'general',
    },
    {
      // Pool proxy deployed on Base 2026-09-02 19:37 UTC (tx 0xb57d5d9d…).
      title: 'Privacy Boost live on Base',
      url: 'https://privacyboost.io/resources/blog/privacy-boost-live-on-base',
      date: '2026-09-08T00:00:00Z',
      description:
        'Sunnyside Labs opens the hosted wallet and SDK to anyone on Base.',
      type: 'general',
    },
  ],
  escrows: DEPLOYMENTS.map((deployment) => {
    const chainPool = discovery.getContract('PrivacyBoost', deployment.chain)
    return {
      address: ChainSpecificAddress.address(chainPool.address),
      chain: deployment.chain,
      sinceTimestamp: chainPool.sinceTimestamp ?? 0,
      tokens: privacyTokens
        .filter((token) => token.token.chain === deployment.chain)
        .map((token) => token.token.symbol),
    }
  }),
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
          'Verifies the batched private transfer and withdrawal proofs.',
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
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-round3-23.09.2026',
        ),
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
        description: 'Verifies the client-side forced withdrawal proofs.',
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
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-round3-23.09.2026',
        ),
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
          'Verifies the batched gift claim, refund and public gift exit proofs.',
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
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-round3-23.09.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: {
      name: 'Privacy Boost wallet',
      url: 'https://app.privacyboost.io',
      since: '2026-10-13',
      build: 'dpl_GoQKQWZv8oxvnAMMf5RVDPBhoipo',
      checked: '2026-10-30',
    },
    tokens: privacyTokens,
    deployedOn: [
      ...DEPLOYMENTS.map((deployment) => deployment.chain),
      ...UNTRACKED_DEPLOYMENTS,
    ],
    trackedOn: DEPLOYMENTS.map((deployment) => deployment.chain),
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
        "The circuits and the trusted setup transcripts are published, and every deployed verification key reproduces from them. The source code of the TEE and of the SDK's compiled core is unpublished.",
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
      pool.address,
      'depositVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      pool.address,
      'epochVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      pool.address,
      'forcedVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      pool.address,
      'portalDepositVerifier',
    ),
    discovery.getContractValue<ChainSpecificAddress>(
      pool.address,
      'giftClaimVerifier',
    ),
  ]
}
