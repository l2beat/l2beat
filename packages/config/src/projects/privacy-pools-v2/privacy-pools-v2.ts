import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatBasisPoints } from '../../common/formatBasisPoints'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type {
  BaseProject,
  PrivacyRelayerExtractorConfig,
  ProjectPrivacyOnchainRelayerSource,
  ProjectPrivacyToken,
} from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { privacyPoolsV2Adversaries } from './adversaries'

const discovery = new ProjectDiscovery('privacy-pools-v2')

// PoolVault events: Deposited, Transacted and Ragequit all index the asset.
const DEPOSITED_EVENT =
  '0xed45e0df2bf0e287a792a7b79b19292af5cbab76cc8819049bf37aa067bf8501'
const TRANSACTED_EVENT =
  '0x10763cc44bf9290f53ec1afd9f70684d93fe62b7d1956d9a18410ae38da9d048'
const RAGEQUIT_EVENT =
  '0x507455b25c1a4595720da5b6a8f6b76e4aa36db987a63b47266112d3cbf2e103'

const POOL_VAULT = discovery.getContract('PoolVault')
const RELAY = discovery.getContract('PrivacyPoolRelay')
const RELAY_SWAPS = discovery.getContract('RelaySwaps')
const ROUTERS = ['PPRouterUSDC', 'PPRouterUSDT', 'PPRouterETH'].map((name) =>
  discovery.getContract(name),
)
const SHARE_TOKENS = ['ppUSDC', 'ppUSDT', 'ppETH']

assert(
  POOL_VAULT.sinceTimestamp !== undefined,
  'PoolVault must have a sinceTimestamp',
)
const SINCE_TIMESTAMP = UnixTime(POOL_VAULT.sinceTimestamp)

const yieldFeeBps = discovery.getContractValue<number>('ppUSDC', 'feeBps')
assert(
  SHARE_TOKENS.every(
    (name) =>
      discovery.getContractValue<number>(name, 'feeBps') === yieldFeeBps,
  ),
  'Share tokens must charge the same yield fee',
)
const yieldFee = formatBasisPoints(yieldFeeBps)
const maxYieldFee = formatBasisPoints(
  discovery.getContractValue<number>('ppUSDC', 'MAX_FEE_BPS'),
)
const rootLiveness = formatSeconds(
  discovery.getContractValue<number>('Keystore', 'keystoreRootLiveness'),
)

const ETH = EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
const POOL_ASSETS = [
  ETH,
  ...SHARE_TOKENS.map((name) =>
    ChainSpecificAddress.address(discovery.getContract(name).address),
  ),
]

// Every verifier the vault routes proofs to, replaced together on 2026-10-20
// with the ceremony keys (DepositVerifierSet, RagequitVerifierSet and 25
// VerifierConfigured events in block 26234240).
const VERIFIERS = [
  'DepositVerifier',
  'RagequitVerifier',
  ...[1, 2, 3, 4, 5].flatMap((n) =>
    [1, 2, 3, 4, 5].map((m) => `Transact${n}x${m}Verifier`),
  ),
].map((name) => discovery.getContract(name).address)

export const privacyPoolsV2: BaseProject = {
  id: ProjectId('privacy-pools-v2'),
  slug: 'privacy-pools-v2',
  name: 'Privacy Pools v2',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-10-20')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning:
      'Privacy Pools v2 opened to the public on 2026-10-20 after a capped beta. We are still early, so the ratings rest on the design and the anonymity set is tracked but not rated.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger with private transfers, swaps and Aave yield inside the pool, where only deposits the ASP approves can be spent privately.',
    detailedDescription: readProjectMarkdown(
      'privacy-pools-v2',
      'detailedDescription',
      { yieldFee, rootLiveness },
    ),
    links: {
      websites: ['https://privacypools.com'],
      documentation: ['https://privacy-pools-v2-docs.vercel.app'],
      repositories: [
        'https://github.com/0xbow-io/privacy-pools-v2-monorepo',
        'https://github.com/0xbow-io/privacy-pools-website-v2',
      ],
    },
    badges: [],
  },
  milestones: [
    {
      // Website v1.0.0 CHANGELOG: "First public release of the Privacy Pools
      // v2 web app, live at https://privacypools.com". v1 moved to
      // v1.privacypools.com the same day (privacy-pools-website PR #232).
      title: 'Privacy Pools v2 public launch',
      url: 'https://github.com/0xbow-io/privacy-pools-website-v2/releases/tag/v1.0.0',
      date: '2026-10-20T00:00:00Z',
      description:
        'The v2 app opens at privacypools.com with transfers, swaps and yield inside the pool.',
      type: 'general',
    },
    {
      // All 27 verifiers were replaced in block 26234240 (2026-10-20 13:57
      // UTC). Monorepo CHANGELOG 1.0.1: "1.0.0 shipped single-contributor dev
      // keys", and the verifiers set at deployment (block 25884277,
      // 2026-09-01) were those. Whoever generated those keys could forge
      // proofs against the beta deposits until this rotation.
      title: 'Beta verifiers used single-contributor keys',
      url: 'https://github.com/0xbow-io/privacy-pools-v2-monorepo/blob/61fac03acd1fc306164ddc234f7fac4147d04493/CHANGELOG.md',
      date: '2026-10-20T00:00:00Z',
      description:
        'From 2026-09-01 until this rotation, every verifier held a developer key, not the ceremony key.',
      type: 'incident',
    },
    {
      // environments.ts: "Prod launches at $100 (Ameen, 2026-09-03)". First
      // mainnet deposit in block 25893288, 2026-09-03 00:47 UTC. The v1 site
      // invited users with "deposits capped at $100 for now".
      title: 'Mainnet beta with a $100 deposit cap',
      url: 'https://github.com/0xbow-io/privacy-pools-website/pull/232',
      date: '2026-09-03T00:00:00Z',
      description:
        'The production contracts take their first deposits, capped at $100 each by the ASP and the app.',
      type: 'general',
    },
  ],
  escrows: [
    {
      address: ChainSpecificAddress.address(POOL_VAULT.address),
      chain: ChainSpecificAddress.longChain(POOL_VAULT.address),
      sinceTimestamp: SINCE_TIMESTAMP,
      tokens: ['ETH', 'USDC', 'ppUSDC', 'ppUSDT', 'ppETH'],
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: '0xbow',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.PrivacyPoolsV2,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('privacy-pools-v2'),
        sinceTimestamp: SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Privacy Pools v2 verifiers 20.10.2026',
        name: 'Privacy Pools v2 verifiers v1.0.1',
        sourceLink:
          'https://github.com/0xbow-io/privacy-pools-v2-monorepo/tree/61fac03acd1fc306164ddc234f7fac4147d04493/packages/circuits',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: VERIFIERS.map((address) => ({ address })),
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-pools-v2',
          'verificationSteps-20.10.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceClient: {
      name: 'privacypools.com',
      repository: 'https://github.com/0xbow-io/privacy-pools-website-v2',
      commit: 'bfb752cdf7c0659bb4fd25e97933e04fce844c4a',
    },
    trackedOn: ['ethereum'],
    tokens: getPrivacyTokens(),
    relayerTracking: {
      type: 'onchainEvents',
      sources: [
        relayerSource(RELAY, 'privacyPoolsV2Relayed'),
        relayerSource(RELAY, 'privacyPoolsV2RelayedBatch'),
        ...ROUTERS.map((router) =>
          relayerSource(router, 'privacyPoolsV2RouterWithdrawal'),
        ),
        relayerSource(RELAY_SWAPS, 'privacyPoolsV2SwapExecuted'),
      ],
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'The upgrader role can replace the PoolVault that escrows deposits without delay, so a malicious upgrade takes the funds before anyone can leave. Ragequit works while the vault is paused, but not against a new implementation.',
      walkawayTest: {
        passed: false,
        reason:
          "New deposits need the ASP's approval to be spent privately. The app offers only 0xbow's relayer.",
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'Contracts, circuits, SDK, relayer and website are public and build locally, the contracts under a Business Source License. The 27 verifiers rebuild from the circuit sources and ceremony keys. The deployed RelaySwaps matches no version of its published source. The ASP service is closed.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: privacyPoolsV2Adversaries,
    riskSummary: readProjectMarkdown('privacy-pools-v2', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'privacy-pools-v2',
        'upgradesAndGovernance',
        {
          maxYieldFee,
        },
      ),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: VERIFIERS,
  },
}

function relayerSource(
  contract: { address: ChainSpecificAddress; sinceTimestamp?: number },
  extractor: Exclude<
    PrivacyRelayerExtractorConfig,
    { params: unknown }
  >['extractor'],
): ProjectPrivacyOnchainRelayerSource {
  assert(
    contract.sinceTimestamp !== undefined,
    'Relayer source contract must have a sinceTimestamp',
  )
  return {
    address: contract.address,
    sinceTimestamp: UnixTime(contract.sinceTimestamp),
    extractor,
  }
}

// One vault holds every asset, so each asset is a bucket on the same address.
function getPrivacyTokens(): ProjectPrivacyToken[] {
  return POOL_ASSETS.map((tokenAddress) => {
    const resolved = getTokenByAddress(tokenAddress.toString())
    const minimumAmounts =
      PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[resolved.symbol]
    assert(
      minimumAmounts,
      `Missing anonymity set thresholds for ${resolved.symbol}`,
    )
    const flow = {
      extractor: 'privacyPoolsV2Value' as const,
      params: { tokenAddress },
    }
    return {
      token: {
        address: tokenAddress,
        iconUrl: resolved.iconUrl,
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        priceId: resolved.coingeckoId,
        sinceTimestamp: SINCE_TIMESTAMP,
      },
      buckets: [
        {
          id: `privacy-pools-v2-${resolved.symbol}`,
          type: 'pool',
          label: resolved.symbol,
          address: POOL_VAULT.address,
          sinceTimestamp: SINCE_TIMESTAMP,
          anonymitySet: { minimumAmounts },
          deposit: { event: DEPOSITED_EVENT, ...flow },
          withdrawal: { event: TRANSACTED_EVENT, ...flow },
          additionalWithdrawals: [{ event: RAGEQUIT_EVENT, ...flow }],
        },
      ],
    }
  })
}
