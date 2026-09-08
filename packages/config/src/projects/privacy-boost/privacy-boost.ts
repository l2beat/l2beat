import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { privacyBoostAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('privacy-boost')

// PrivacyBoost measures exit delays and auth-root staleness in blocks.
const OP_MAINNET_BLOCK_TIME = 2
const OP_MAINNET_CHAIN_ID = 10

const pool = discovery.getContract('PrivacyBoost')
const adminMultisigStats = discovery.getMultisigStats('AdminMultisig')
const PRIVACY_BOOST_SINCE_TIMESTAMP = UnixTime(pool.sinceTimestamp ?? 0)

const forcedWithdrawalDelay =
  discovery.getContractValue<number>('PrivacyBoost', 'forcedWithdrawalDelay') *
  OP_MAINNET_BLOCK_TIME
const epochAuthStaleness =
  discovery.getContractValue<number>(
    'PrivacyBoost',
    'maxEpochAuthStalenessBlocks',
  ) * OP_MAINNET_BLOCK_TIME
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

const registeredTokens = discovery
  .getContractValue<{ tokenAddress: string }[]>('TokenRegistry', 'tokens')
  .map((token) => {
    const address = ChainSpecificAddress.address(
      token.tokenAddress as ChainSpecificAddress,
    )
    return getTokenByAddress(address.toString(), OP_MAINNET_CHAIN_ID).symbol
  })

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
      'A shielded pool for ERC-20 tokens on OP Mainnet, designed for institutional users. Provides TEE-backed privacy, balancing better UX with worse privacy trust assumptions.',
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
      address: ChainSpecificAddress.address(pool.address),
      chain: ChainSpecificAddress.longChain(pool.address),
      sinceTimestamp: PRIVACY_BOOST_SINCE_TIMESTAMP,
      tokens: registeredTokens,
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
        ...TRUSTED_SETUPS.PrivacyBoostv2,
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
        hash: 'Privacy Boost epoch verifier 03.09.2026',
        name: 'Privacy Boost epoch verifier (September 2026)',
        description:
          'Verifies private transfer and withdrawal epochs. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/frontend/epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0xab52453B02ca68cfbe7B264d3C4bBa566198C6B6',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost deposit verifier 03.09.2026',
        name: 'Privacy Boost deposit verifier (September 2026)',
        description:
          'Verifies deposit epochs. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/frontend/deposit_epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x16e1dE876dEB1C3251A1E923A206605D084F25C5',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost forced withdrawal verifier 03.09.2026',
        name: 'Privacy Boost forced withdrawal verifier (September 2026)',
        description:
          'Verifies forced withdrawals. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/frontend/forced_withdraw_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x78ff16aD4D38e560B81A7B33ae06607fe69D6641',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost portal deposit verifier 03.09.2026',
        name: 'Privacy Boost portal deposit verifier (September 2026)',
        description:
          'Verifies portal deposits. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/frontend/deposit_portal_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x6806eA551C3c8350Ab156eC5001D28705dCda2B6',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: 'Privacy Boost gift claim verifier 03.09.2026',
        name: 'Privacy Boost gift claim verifier (September 2026)',
        description:
          'Verifies gift settlements and public gift exits. The deployed verification keys have not yet been reproduced by L2BEAT.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/23907eeebf0e50cd18da42a287671189e61ecb0f/frontend/gift_claim_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x249ae8887E15e3728187dd4E341a66cb0221B1B4',
            ),
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
  privacyInfo: {
    // TODO: Proposed tracking: deposits from DepositRequested (has tokenId + totalAmount),
    // withdrawals from ERC-20 Transfer logs with from == pool (epoch withdrawals emit no pool event).
    // Needs: (1) indexed-topic (topic1/2) filter support in LogsProvider/PrivacyFlowIndexerConfig,
    // (2) new extractors: privacyBoostDeposit (params: tokenId) and generic erc20TransferOut (params: pool).
    // Accepted errors: cancelled deposits overcounted; refunds/fee legs/relay fee exits count as withdrawals.
    tokens: [],
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The pool and both registries sit behind transparent proxies whose ProxyAdmins are owned by the admin multisig, which can upgrade them with no delay. Users get no window to exit before a change takes effect.',
      walkawayTest: {
        passed: false,
        reason:
          'If the TEE operators disappear, no new deposits or private transfers can be processed and the system enters exit-only mode.',
      },
    },
    reproducibility: {
      value: 'Not verified',
      sentiment: 'warning',
      description:
        'Circuit sources are published, but the verification keys deployed in September 2026 have not yet been reproduced by L2BEAT. TEE sources are not published, so the privacy logic has not been verified.',
    },
    privacy: {
      value: 'Admin API',
      sentiment: 'bad',
      description:
        "Registered 'auditors' can query the TEE's Audit API to retrieve the balance and transaction history of any address. These queries can be logged publicly on the AuditGateway smart contract, but there is no verifiable guarantee that all queries are logged.",
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
