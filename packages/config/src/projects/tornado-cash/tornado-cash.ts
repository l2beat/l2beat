import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { CROP_NOTES } from '../../common/crops'
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
import { tornadoCashAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('tornado-cash')

const TORNADO_DEPOSIT_EVENT =
  '0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196'
const TORNADO_WITHDRAWAL_EVENT =
  '0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931'

const proposalThreshold = discovery.getContractValueBigInt(
  'GovernanceProposalStateUpgrade',
  'PROPOSAL_THRESHOLD',
)
const quorumVotes = discovery.getContractValueBigInt(
  'GovernanceProposalStateUpgrade',
  'QUORUM_VOTES',
)
const closingPeriod = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'CLOSING_PERIOD',
)
const executionDelay = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'EXECUTION_DELAY',
)
const executionExpiration = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'EXECUTION_EXPIRATION',
)
const voteExtendTime = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTE_EXTEND_TIME',
)
const votingDelay = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTING_DELAY',
)
const votingPeriod = discovery.getContractValue<number>(
  'GovernanceProposalStateUpgrade',
  'VOTING_PERIOD',
)
const tornTotalSupply = discovery.getContractValueBigInt('TORN', 'totalSupply')
const tornTreasury = discovery.getContractValueBigInt(
  'GovernanceProposalStateUpgrade',
  'TORNTreasury',
)
const tornStaked = discovery.getContractValueBigInt(
  'TornadoVault',
  'TORNStaked',
)

const stakeLockPeriod = formatSeconds(
  voteExtendTime + executionExpiration + executionDelay,
)

// The IPFS app pinned on tornadocash.eth. L2BEAT rebuilt this CID from
// tornado-dao/classic-ui 17c54dae with the DAO's Docker recipe
// (tornado-dao/tornado-ipfs-ui d2aa401) on 2026-10-10. Two download fixes, not
// build inputs: apt from archive.debian.org (Debian 11 is end of life) and kubo
// v0.29.0 from GitHub with its sha512. A new pin fails this assert until the
// new release is rebuilt and the reproducibility text is checked.
const REBUILT_APP_CID =
  'bafybeigduniojgqrz7e4vntsgmovdli3oi7a2pnzzvz2gfxlvj3yqwk75a'
const appCid = contenthashToCid(
  discovery.getContractValue<string>(
    'GovernanceProposalStateUpgrade',
    'appContenthash',
  ),
)
assert(
  appCid === REBUILT_APP_CID,
  `tornadocash.eth pins ${appCid}, rebuild it and update REBUILT_APP_CID`,
)

/** ENS contenthash (ipfs-ns, 0xe301) to a base32 CIDv1. */
function contenthashToCid(contenthash: string): string {
  const bytes = Buffer.from(contenthash.replace(/^0x/, ''), 'hex')
  assert(bytes[0] === 0xe3 && bytes[1] === 0x01, 'not an IPFS contenthash')
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567'
  let bits = 0
  let value = 0
  let out = 'b'
  for (const byte of bytes.subarray(2)) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += alphabet[(value << (5 - bits)) & 31]
  return out
}

function formatDenomination(amount: bigint, decimals: number): string {
  return utils.formatUnits(amount, decimals).replace(/\.?0+$/, '')
}

interface TornadoBucket {
  id: string
  address: ChainSpecificAddress
  tokenAddress: EthereumAddress
  tokenInfo: {
    symbol: string
    decimals: number
    priceId: string
    iconUrl: string | undefined
  }
  denomination: string
  denominationAmount: string
  sinceTimestamp: UnixTime
  depositEvent: string
  withdrawalEvent: string
}

const BUCKETS = getTornadoBuckets()
const TORNADO_CASH_SINCE_TIMESTAMP = UnixTime(
  Math.min(...BUCKETS.map((bucket) => bucket.sinceTimestamp)),
)

export const tornadoCash: BaseProject = {
  id: ProjectId('tornado-cash'),
  slug: 'tornado-cash',
  name: 'Tornado Cash',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-04-15')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'An unconditional privacy pool of fixed amounts with immutable contracts, and an app pinned on ENS by token governance.',
    detailedDescription: readProjectMarkdown(
      'tornado-cash',
      'detailedDescription',
      { appCid },
    ),
    links: {
      websites: ['https://app.ens.domains/tornadocash.eth?tab=records'],
      repositories: [
        'https://github.com/tornadocash/tornado-core',
        'https://github.com/tornado-dao/classic-ui',
      ],
      socialMedia: ['https://t.me/TornadoCashOfficialDAO'],
    },
    badges: [],
  },
  milestones: [
    {
      // operator() on every pool reads zero from here on (1 ETH pool: block
      // 10,091,702), after the trusted setup ceremony ended on 2020-05-10.
      title: 'Pools become immutable',
      url: 'https://www.coindesk.com/tech/2020/05/18/developers-of-ethereum-privacy-tool-tornado-cash-smash-their-keys',
      date: '2020-05-18T00:00:00Z',
      description:
        'The developers set the operator of every pool to zero, so no one can change the pools.',
      type: 'general',
    },
    {
      title: 'Added to the OFAC sanctions list',
      url: 'https://home.treasury.gov/news/press-releases/jy0916',
      date: '2022-08-08T00:00:00Z',
      description:
        "OFAC adds Tornado Cash and the pools' addresses to its sanctions list.",
      type: 'incident',
    },
    {
      // Proposal 20, executed 2023-05-20 (tx 0x3274b609…), gave the attacker
      // 1.2M fake votes. Proposal 21, executed 2023-05-28 (tx 0xaac00510…),
      // reverted it. The pools were not affected.
      title: 'Governance taken over by a malicious proposal',
      url: 'https://www.theblock.co/post/231637/attacker-uses-malicious-proposal-to-take-over-tornado-cash-governance',
      date: '2023-05-20T00:00:00Z',
      description:
        'Proposal 20 hands the attacker control of governance until proposal 21 reverts it.',
      type: 'incident',
    },
    {
      // tornadocash.eth contenthash set by proposal 44 (tx 0xd0702bce…,
      // 2024-01-02) and replaced by proposal 52 (tx 0x4fb9cbe3…, 2024-03-14).
      // Reports date the leaking code to January 1 and its discovery to
      // 2024-02-26 (Gas404). Press calls the proposal 47.
      title: 'Pinned app leaks deposit notes',
      url: 'https://forklog.com/en/backdoor-discovered-in-ipfs-version-of-tornado-cash/',
      date: '2024-01-02T00:00:00Z',
      description:
        'The app pinned by proposal 44 sends deposit notes to an outside server until proposal 52.',
      type: 'incident',
    },
    {
      title: 'Removed from the OFAC sanctions list',
      url: 'https://home.treasury.gov/news/press-releases/sb0057',
      date: '2025-03-21T00:00:00Z',
      description:
        "OFAC removes Tornado Cash and the pools' addresses from its sanctions list.",
      type: 'general',
    },
  ],
  escrows: BUCKETS.map((bucket) => ({
    address: ChainSpecificAddress.address(bucket.address),
    chain: ChainSpecificAddress.longChain(bucket.address),
    sinceTimestamp: bucket.sinceTimestamp,
    tokens: [bucket.tokenInfo.symbol],
  })),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Tornado Cash',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.websnark],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.websnark,
        ...TRUSTED_SETUPS.TornadoCash,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('tornado-cash'),
        sinceTimestamp: TORNADO_CASH_SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Tornado Cash verifier 03.07.2026',
        name: 'Tornado Cash verifier v2.1',
        sourceLink:
          'https://github.com/tornadocash/tornado-core/tree/v2.1/circuits',
        proofSystem: ZK_CATALOG_TAGS.Groth16.websnark,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xce172ce1F20EC0B3728c9965470eaf994A03557A',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'tornado-cash',
          'verificationSteps-03.07.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.pool,
    trackedOn: ['ethereum'],
    tokens: getPrivacyTokens(),
    relayerTracking: {
      type: 'onchainEvents',
      sources: BUCKETS.map((bucket) => ({
        address: bucket.address,
        sinceTimestamp: bucket.sinceTimestamp,
        extractor: 'tornadoCashWithdrawal',
      })),
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The core Tornado Cash contracts are immutable and have no admin upgrade path, so users can always withdraw with a valid note and proof.',
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The circuits, contracts, app and relayer are open source. Each app release names its commit and a build recipe for its IPFS hash, and rebuilding the current release reproduces it.',
    },
    attributes: [PRIVACY_ATTRIBUTES.zk, PRIVACY_ATTRIBUTES.fixedAmounts],
    adversaries: tornadoCashAdversaries(
      formatSeconds(votingDelay + votingPeriod + executionDelay, {
        fullUnit: true,
      }),
    ),
    riskSummary: readProjectMarkdown('tornado-cash', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('tornado-cash', 'upgradesAndGovernance'),
      governanceInfo: {
        upgrades: {
          'Normal upgrade path': `Lock and optionally delegate TORN in the [Governance contract](https://etherscan.io/address/0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce) → submit a proposal with at least **${formatNumber(Number(proposalThreshold / 10n ** 18n))} TORN** → wait ${formatSeconds(votingDelay)} → vote for ${formatSeconds(votingPeriod)} (extended by ${formatSeconds(voteExtendTime)} if the outcome changes during the last ${formatSeconds(closingPeriod)}) → pass with a simple majority and **${formatNumber(Number(quorumVotes / 10n ** 18n))} TORN** quorum → wait ${formatSeconds(executionDelay)} → permissionless execution within ${formatSeconds(executionExpiration)}. The DAO controls protocol and periphery components, but cannot upgrade or modify existing pools.`,
          'Exit window': `**${formatSeconds(executionDelay)}** for DAO-controlled changes — an accepted proposal remains timelocked for this period before it can be executed. Existing Tornado Cash pools are immutable and cannot be upgraded by the DAO.`,
        },
        tokenGovernance: {
          'Governance token': `\`TORN\`, 1 token = 1 vote, delegated. Total supply: **${formatNumber(Number(tornTotalSupply / 10n ** 18n))} TORN**, DAO-owned TORN (unavailable for voting): **${formatNumber(Number(tornTreasury / 10n ** 18n))} TORN**, staked for voting: **${formatNumber(Number(tornStaked / 10n ** 18n))} TORN**, the rest is circulating supply.`,
          'Stake lock': `After voting or proposing, staked tokens are locked for **${stakeLockPeriod}** after proposal ends, preventing governance hopping.`,
          'Voting venue':
            '[Governance contract](https://etherscan.io/address/0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce) on Ethereum. Proposals are viewable on the governance page of the app, see the App section above.',
          'Proposal threshold': `**${formatNumber(Number(proposalThreshold / 10n ** 18n))} TORN** locked in governance.`,
          Quorum: `**${formatNumber(Number(quorumVotes / 10n ** 18n))} TORN**, with a simple majority required for acceptance.`,
          'Execution model': `**Permissionless execution after an onchain vote and timelock.** An accepted proposal waits ${formatSeconds(executionDelay)} and can then be executed by anyone within ${formatSeconds(executionExpiration)}. Proposal executable payload is committed in the \`propose()\` transaction.`,
        },
      },
    },
  },
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        'CR based on Ethereum L1 inclusion.',
        CROP_NOTES.passesWalkawayTest(),
        'Multiple active relayers; users can self-relay withdrawals.',
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'GPL-3.0',
      points: [
        'Reproducible from source: anyone can audit it and run it locally to participate.',
      ],
    },
    privacy: {
      sentiment: 'good',
      points: [
        'Unconditional privacy.',
        'Clearly defined anonymity set per fixed-denomination pool.',
      ],
    },
    security: {
      sentiment: 'good',
      points: ['Simple design.'],
      missing: [
        'Brittle onchain governance (token voting) controls the official frontend (ENS+IPFS).',
      ],
      notReviewed: ['Formal verification.'],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [
      discovery.getContract('Verifier').address,
      discovery.getContract('BatchTreeUpdateVerifier').address,
      discovery.getContract('TreeUpdateVerifier').address,
      discovery.getContract('RewardVerifier').address,
      discovery.getContract('WithdrawVerifier').address,
    ],
  },
}

function getPrivacyTokens(): ProjectPrivacyToken[] {
  const grouped = new Map<string, ProjectPrivacyToken>()

  for (const bucket of BUCKETS) {
    let asset = grouped.get(bucket.tokenInfo.symbol)
    if (!asset) {
      asset = {
        token: {
          address: bucket.tokenAddress,
          iconUrl: bucket.tokenInfo.iconUrl,
          symbol: bucket.tokenInfo.symbol,
          decimals: bucket.tokenInfo.decimals,
          priceId: bucket.tokenInfo.priceId,
          sinceTimestamp: bucket.sinceTimestamp,
        },
        buckets: [],
      }
      grouped.set(bucket.tokenInfo.symbol, asset)
    }

    asset.token.sinceTimestamp = UnixTime(
      Math.min(
        asset.token.sinceTimestamp ?? Number.MAX_SAFE_INTEGER,
        bucket.sinceTimestamp,
      ),
    )

    asset.buckets.push({
      id: bucket.id,
      type: 'denomination',
      label: `${bucket.tokenInfo.symbol} ${bucket.denomination}`,
      address: bucket.address,
      sinceTimestamp: bucket.sinceTimestamp,
      denomination: bucket.denomination,
      anonymitySet: {
        minimumAmounts: [bucket.denominationAmount],
      },
      deposit: {
        event: bucket.depositEvent,
        extractor: 'fixedAmount',
        params: {
          amount: bucket.denominationAmount,
        },
      },
      withdrawal: {
        event: bucket.withdrawalEvent,
        extractor: 'fixedAmount',
        params: {
          amount: bucket.denominationAmount,
        },
      },
    })
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.token.symbol.localeCompare(b.token.symbol, undefined, {
      numeric: true,
    }),
  )
}

function getTornadoBuckets(): TornadoBucket[] {
  const poolAddresses = discovery.getContractValue<string[]>(
    'InstanceRegistry',
    'getAllInstanceAddresses',
  )

  const pools = poolAddresses.map((address) => discovery.getContract(address))

  return pools.map((pool) => {
    const token = pool.values?.token?.toString()
    const isNativeEth = token === undefined
    const tokenAddress = isNativeEth
      ? EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
      : EthereumAddress(
          ChainSpecificAddress.address(token as ChainSpecificAddress),
        )
    const resolved = getTokenByAddress(tokenAddress.toString())
    assert(resolved, `Unknown token ${token}`)

    const denominationAmount = BigInt(
      pool.values?.denomination?.toString() ?? 0,
    )
    const denomination = formatDenomination(
      denominationAmount,
      resolved.decimals,
    )

    return {
      id: `tornado-${resolved.symbol}-${denomination}`,
      address: pool.address,
      tokenAddress,
      tokenInfo: {
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        priceId: resolved.coingeckoId,
        iconUrl: resolved.iconUrl,
      },
      denomination,
      denominationAmount: denominationAmount.toString(),
      sinceTimestamp: pool.sinceTimestamp ?? 0,
      depositEvent: TORNADO_DEPOSIT_EVENT,
      withdrawalEvent: TORNADO_WITHDRAWAL_EVENT,
    }
  })
}
