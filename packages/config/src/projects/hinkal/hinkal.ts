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
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { hinkalAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('hinkal')

const pool = discovery.getContract('Hinkal')
const poolAddress = ChainSpecificAddress.address(pool.address)
const SINCE_TIMESTAMP = UnixTime(pool.sinceTimestamp ?? 0)

const timelockDelay = discovery.getContractValue<number>(
  'TimelockController',
  'getMinDelay',
)
const upgradeDelay = formatSeconds(timelockDelay, { fullUnit: true })
const multisig = discovery.getMultisigStats('Hinkal Multisig')

// The texts below rest on these facts. Each assert fails the build when its
// fact changes, so the text gets reviewed.
const timelock = discovery.getContract('TimelockController').address
assert(
  discovery.getContractValue<string>('Hinkal', 'owner') === timelock &&
    discovery
      .getContractValue<string[]>('Hinkal', 'helperManager')
      .every((holder) => holder === timelock),
  'Hinkal: the timelock must own the pool and be the only helper manager',
)
assert(
  discovery.getContract('HinkalHelper').unverified === true,
  'Hinkal: the HinkalHelper is verified now, review the risk summary',
)
assert(
  discovery.isEOA(
    discovery.getContractValue<ChainSpecificAddress>(
      'ReceiveVaultFactory',
      '$admin',
    ),
  ),
  'Hinkal: the ReceiveVaultFactory admin is no longer an EOA',
)
assert(
  discovery
    .getContractValue<string[]>('Hinkal', 'defaultAdmin')
    .includes(discovery.getContract('HinkalFactory').address),
  'Hinkal: the HinkalFactory no longer holds the admin role',
)

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

// The pool emits no event with a token and amount for deposits or
// withdrawals, so flows are tracked as gross ERC-20 transfers across the pool
// boundary. ETH moves without a Transfer event and is not tracked.
const TRACKED_TOKENS = [
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
].map(EthereumAddress)

const privacyTokens: ProjectPrivacyToken[] = TRACKED_TOKENS.map((address) => {
  const tokenInfo = getTokenByAddress(address.toString())
  const sinceTimestamp = Math.max(
    SINCE_TIMESTAMP,
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
        id: `hinkal-${tokenInfo.symbol}`,
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
})

// The 15 Groth16 verifiers behind the wrappers the pool calls for internal
// transactions, by circuit size (tokens x inputs x outputs) and the minimal
// circuit.
const VERIFIER_NAMES = [
  '1x2x1',
  '1x2x2',
  '1x6x1',
  '1x6x2',
  '2x2x1',
  '2x2x2',
  '2x6x1',
  '2x6x2',
  '3x2x1',
  '3x6x1',
  '4x2x1',
  '4x6x1',
  '5x2x1',
  '5x6x1',
  'Min0',
].map((size) => `mainEVMCircuit${size}v4`)
const verifiers = VERIFIER_NAMES.map(
  (name) => discovery.getContract(name).address,
)

export const hinkal: BaseProject = {
  id: ProjectId('hinkal'),
  slug: 'hinkal',
  name: 'Hinkal',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-11-19')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(SINCE_TIMESTAMP),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A shielded ledger for private balances, payments and swaps in a wallet, whose privacy rests on the operator's enclave.",
    detailedDescription: readProjectMarkdown('hinkal', 'detailedDescription', {
      upgradeDelay,
      multisig,
    }),
    links: {
      websites: ['https://hinkal.io'],
      documentation: ['https://hinkal-team.gitbook.io/hinkal'],
      repositories: [
        'https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits',
        'https://github.com/Hinkal-Protocol/Hinkal-API-Enclave',
      ],
      socialMedia: ['https://x.com/hinkal_protocol'],
    },
    badges: [],
  },
  milestones: [
    {
      // Timelock 0xF043…B7D0 accepted ownership in this transaction
      // (2026-08-25 07:17 UTC). Its delay was 180 s until 2026-09-10
      // (0x406f2509…5681), 6 h since.
      title: 'Pool ownership moves to a timelock',
      url: 'https://etherscan.io/tx/0x3edad43af4d9d5e3d18e116ecacd5e43ae94e7a9403465d75bb11467b942fdaa',
      date: '2026-08-25T00:00:00Z',
      description:
        "An EOA hands the pool to a timelock behind Hinkal's 2/3 multisig.",
      type: 'general',
    },
    {
      // HinkalFactory deployed the pool in block 25543753, 2026-07-16 07:32
      // UTC, two weeks after the previous pool was drained.
      title: 'Current pool goes live on Ethereum',
      url: 'https://etherscan.io/tx/0x85f1ad3bc33e75b4ad2f487f3976012c288343bbba7ff19c504546cc2c433284',
      date: '2026-07-16T00:00:00Z',
      description:
        'Hinkal deploys a new immutable pool after the theft from its predecessor.',
      type: 'general',
    },
    {
      // Hinkal's own update: the attacker withdrew from 2 July 19:05 UTC.
      // Previous pool 0x25e5e82f…a826. BlockSec's analysis:
      // https://blocksec.com/blog/web3-security-hinkal-double-spend
      title: 'Previous pool drained of about $800K',
      url: 'https://x.com/hinkal_protocol/status/2073136163880149417',
      date: '2026-07-02T00:00:00Z',
      description:
        'An attacker withdraws funds they never deposited. Hinkal pauses and promises refunds.',
      type: 'incident',
    },
  ],
  escrows: [
    {
      address: poolAddress,
      chain: ChainSpecificAddress.longChain(pool.address),
      sinceTimestamp: SINCE_TIMESTAMP,
      tokens: ['ETH', 'USDT', 'USDC'],
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Hinkal',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Hinkal,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('hinkal'),
        sinceTimestamp: SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Hinkal v4 verifiers 19.11.2026',
        name: 'Hinkal verifiers, 15 circuits',
        description:
          'Verify deposits, transfers, withdrawals and external actions. Their keys equal the ones in the proving files Hinkal serves.',
        sourceLink:
          'https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits/tree/61b6839aa80fc0c33bfdcde0323753c83cb2ce67/contracts/verifiers',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: verifiers.map((address) => ({ address })),
        verificationStatus: 'notVerified',
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: {
      name: 'Hinkal Wallet',
      url: 'https://chromewebstore.google.com/detail/hinkal-wallet/khfjgapjfcdoffmklchibpepboholpbe',
      since: '2026-11-19',
      version: '0.0.64',
      delivery: { type: 'latestOnly', store: 'Chrome Web Store' },
      checked: '2026-11-19',
      checkedApps: [
        {
          name: 'Hinkal App',
          icon: 'hinkal',
          finding:
            "Sends the login signature, which derives the spending key too, to Hinkal's enclave at every login.",
          fix: 'Derive the keys in the browser and keep the signature there, as Hinkal Wallet keeps its phrase.',
          source: 'https://app.hinkal.io',
          checked: '2026-11-19',
        },
        {
          name: 'Hinkal MCP',
          icon: 'hinkal',
          finding:
            "Hinkal's server creates and holds the wallet's keys and builds every transaction, while the user's machine keeps only an access key.",
          fix: "Derive the keys on the user's machine and prove there, as Hinkal Wallet does with Remote Proving off.",
          source: 'https://www.npmjs.com/package/@hinkal/mcp/v/0.0.8',
          checked: '2026-11-19',
        },
      ],
    },
    trackedOn: ['ethereum'],
    // Chains where the pool has the same address and the wallet serves it
    // (its fee table and RPC list).
    runsOn: [
      ProjectId('arbitrum'),
      ProjectId('base'),
      ProjectId('polygon-pos'),
      ProjectId('robinhood'),
    ],
    tokens: privacyTokens,
    anonymitySet: { type: 'too-small' },
    exitWindow: {
      value: formatSeconds(timelockDelay),
      sentiment: 'bad',
      orderHint: timelockDelay,
      description: `Changes to the verifiers and the HinkalHelper wait ${formatSeconds(timelockDelay)} in a timelock, so users have that long to withdraw before a change they reject. An EOA upgrades the factory behind deposit addresses at once.`,
      walkawayTest: {
        passed: false,
        reason:
          "The wallet submits every private transaction through Hinkal's relayers and syncs from Hinkal's servers, with no setting for either.",
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contracts and circuits are public under BUSL-1.1, and the deployed verifier keys equal the published ones. The wallet, the enclave server it sends keys to and the current HinkalHelper are closed, and the proving keys come without a ceremony record.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: hinkalAdversaries(upgradeDelay),
    riskSummary: readProjectMarkdown('hinkal', 'riskSummary', {
      upgradeDelay,
    }),
    upgradesAndGovernance: {
      content: readProjectMarkdown('hinkal', 'upgradesAndGovernance', {
        upgradeDelay,
        multisig,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: verifiers,
  },
}
