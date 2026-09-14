import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

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

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const poolAddress = ChainSpecificAddress.address(pool.address)

const registeredTokens = discovery
  .getContractValue<{ tokenAddress: string }[]>('TokenRegistry', 'tokens')
  .map((token) => {
    const address = ChainSpecificAddress.address(
      token.tokenAddress as ChainSpecificAddress,
    )
    return {
      address,
      info: getTokenByAddress(address.toString(), OP_MAINNET_CHAIN_ID),
    }
  })

// The pool's own events carry no usable amounts: epoch withdrawals settle in
// batches without per-withdrawal events, and the deposit event signature
// changed with the September 2026 upgrade. Flows are therefore tracked as
// gross ERC-20 transfers across the pool boundary. Every deposit request,
// portal deposit and withdrawal moves tokens this way, but so do deposit
// cancellation refunds, treasury fee legs and gateway DeFi round trips, which
// are all counted as they cross.
const privacyTokens: ProjectPrivacyToken[] = registeredTokens.map(
  ({ address, info }) => {
    // Prices must cover the whole bucket range, so never start before listing.
    const sinceTimestamp = Math.max(
      PRIVACY_BOOST_SINCE_TIMESTAMP,
      info.coingeckoListingTimestamp,
    )

    return {
      token: {
        address: address.toString(),
        iconUrl: info.iconUrl,
        symbol: info.symbol,
        decimals: info.decimals,
        priceId: info.coingeckoId,
        sinceTimestamp,
      },
      buckets: [
        {
          id: `privacy-boost-${info.symbol}`,
          type: 'pool',
          label: info.symbol,
          address: pool.address,
          sinceTimestamp,
          deposit: {
            event: TRANSFER_EVENT,
            extractor: 'erc20Transfer',
            params: { to: poolAddress },
          },
          withdrawal: {
            event: TRANSFER_EVENT,
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
      tokens: registeredTokens.map((token) => token.info.symbol),
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
        hash: 'Privacy Boost epoch verifier 09.09.2026',
        name: 'Privacy Boost epoch verifier, 13 circuits',
        description:
          'Verifies the batched private transfer and withdrawal proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/9e3f34e1a91c20497bc7d8f47492761bc868843c/frontend/epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0xab52453B02ca68cfbe7B264d3C4bBa566198C6B6',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-epoch-09.09.2026',
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
              'oeth:0x16e1dE876dEB1C3251A1E923A206605D084F25C5',
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
        hash: 'Privacy Boost forced withdrawal verifier 09.09.2026',
        name: 'Privacy Boost forced withdrawal verifier, 1 circuit',
        description: 'Verifies the client-side forced withdrawal proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/9e3f34e1a91c20497bc7d8f47492761bc868843c/frontend/forced_withdraw_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x78ff16aD4D38e560B81A7B33ae06607fe69D6641',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-forced-09.09.2026',
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
              'oeth:0x6806eA551C3c8350Ab156eC5001D28705dCda2B6',
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
        hash: 'Privacy Boost gift claim verifier 09.09.2026',
        name: 'Privacy Boost gift claim verifier, 2 circuits',
        description:
          'Verifies the batched gift claim, refund and public gift exit proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/9e3f34e1a91c20497bc7d8f47492761bc868843c/frontend/gift_claim_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress(
              'oeth:0x249ae8887E15e3728187dd4E341a66cb0221B1B4',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-gift-09.09.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    tokens: privacyTokens,
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
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'ZK circuits guaranteeing user fund security are published and reproduced, however the TEE sources guaranteeing privacy are not yet published. TEE logic could not be verified for correctness.',
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
