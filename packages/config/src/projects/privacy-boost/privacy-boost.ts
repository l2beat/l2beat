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

// PrivacyBoost measures both of its delays in blocks, not seconds.
const OP_MAINNET_BLOCK_TIME = 2
const OP_MAINNET_CHAIN_ID = 10

const pool = discovery.getContract('PrivacyBoost')
const adminMultisigStats = discovery.getMultisigStats('AdminMultisig')
const PRIVACY_BOOST_SINCE_TIMESTAMP = UnixTime(pool.sinceTimestamp ?? 0)

const forcedWithdrawalDelay =
  discovery.getContractValue<number>('PrivacyBoost', 'forcedWithdrawalDelay') *
  OP_MAINNET_BLOCK_TIME
const authSnapshotInterval =
  discovery.getContractValue<number>('PrivacyBoost', 'authSnapshotInterval') *
  OP_MAINNET_BLOCK_TIME
const withdrawFeeBps = discovery.getContractValue<number>(
  'PrivacyBoost',
  'withdrawFeeBps',
)

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

// topic0 of DepositRequested(uint256,address,uint16,uint96,uint16,uint256,uint256[],(bytes32,bytes32,bytes32,bytes32,bytes32,bytes16)[])
const DEPOSIT_REQUESTED_EVENT =
  '0xa15fc34b5443213f492feff5b6ffa403b1c6398b9b02f237b44f5a4e128a4630'
// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const registeredTokens = discovery
  .getContractValue<{ tokenAddress: string }[]>('TokenRegistry', 'tokens')
  .map((token, index) => {
    const chainSpecificAddress = token.tokenAddress as ChainSpecificAddress
    const address = ChainSpecificAddress.address(chainSpecificAddress)
    return {
      // TokenRegistry assigns ids sequentially starting at 1
      tokenId: index + 1,
      chainSpecificAddress,
      address,
      info: getTokenByAddress(address.toString(), OP_MAINNET_CHAIN_ID),
    }
  })

const poolAddress = ChainSpecificAddress.address(pool.address)

const privacyTokens: ProjectPrivacyToken[] = registeredTokens.map(
  ({ tokenId, chainSpecificAddress, address, info }) => {
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
          // Deposits are counted at request time from DepositRequested, so
          // later cancelled deposits are overcounted (DepositCancelled
          // carries no amount).
          // To correct: subtract cancelled deposits
          deposit: {
            event: DEPOSIT_REQUESTED_EVENT,
            extractor: 'privacyBoostDeposit',
            params: { tokenId },
          },
          // Epoch withdrawals emit no pool event with an amount, so
          // withdrawals are tracked as ERC-20 transfers out of the pool.
          // This also covers forced withdrawals, but overcounts fee legs to
          // the treasury, relay fee payouts and deposit cancellation refunds.
          // To correct: subtract withdrawals to the treasury for all forces withdrawals
          withdrawal: {
            address: chainSpecificAddress,
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
        authSnapshotInterval: formatSeconds(authSnapshotInterval, {
          fullUnit: true,
        }),
        withdrawFee: formatBasisPoints(withdrawFeeBps),
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
        ...TRUSTED_SETUPS.PrivacyBoost,
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
        hash: 'Privacy Boost epoch verifier 18.08.2026',
        name: 'Privacy Boost epoch verifier, 14 circuits',
        description:
          'Verifies the batched private transfer and withdrawal proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/7b2a01864a706a6d440ada20a92e4ae75dcbfc0a/frontend/epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'optimism',
              '0x67b1bD839203223870fBF51e4CDf2104E3Ca966b',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-epoch-18.08.2026',
        ),
      },
      {
        hash: 'Privacy Boost deposit verifier 18.08.2026',
        name: 'Privacy Boost deposit verifier, 3 circuits',
        description: 'Verifies the batched deposit epoch proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/7b2a01864a706a6d440ada20a92e4ae75dcbfc0a/frontend/deposit_epoch_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'optimism',
              '0xC829061276e95D11aF92E678DE2B767AcFB4e924',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-deposit-18.08.2026',
        ),
      },
      {
        hash: 'Privacy Boost forced withdrawal verifier 18.08.2026',
        name: 'Privacy Boost forced withdrawal verifier, 1 circuit',
        description: 'Verifies the client-side forced withdrawal proofs.',
        sourceLink:
          'https://github.com/sunnyside-io/privacy-boost-protocol/blob/7b2a01864a706a6d440ada20a92e4ae75dcbfc0a/frontend/forced_withdraw_circuit.go',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Gnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'optimism',
              '0xF023c61C5c745Be40fd30B0d48C0929839Ec3C67',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-boost',
          'verificationSteps-forced-18.08.2026',
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
      value: 'Reproducible',
      sentiment: 'warning',
      description:
        'ZK circuits guaranteeing user fund security are published and reproduced, however the TEE sources guaranteeing privacy are not yet published. TEE logic could not be verified for correctness.',
    },
    privacy: {
      value: 'Auditable admin API',
      sentiment: 'bad',
      description:
        "All private data lives as plaintext within a TEE server. Registered auditors can use the TEE's Audit API to fetch the balance and transaction history of any address, and the TEE produces an auditable onchain record on the AuditGateway smart contract.",
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
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
  ]
}
