import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
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
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A classic Ethereum mixer design based on fixed-denomination pools and zk withdrawals.',
    detailedDescription: readProjectMarkdown(
      'tornado-cash',
      'detailedDescription',
    ),
    links: {
      websites: ['https://app.ens.domains/tornadocash.eth?tab=records'],
    },
    badges: [],
  },
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
    tokens: getPrivacyTokens(),
    relayers: {
      active30d: 26,
      tooltip:
        'Senders of withdrawal Tornado Cash transaction where the trx sender is distinct from the receiver of withdrawn tokens. Relayers defined in this way do not have to necessarily be registered onchain in RelayerRegistry.',
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
        'There is at least one practical way to participate in Tornado Cash using published source code that can be audited and run locally.',
    },
    privacy: {
      value: 'Unconditional',
      sentiment: 'good',
      description:
        'There is no protocol-level compliance mechanism or way to compromise user privacy.',
    },
    attributes: [PRIVACY_ATTRIBUTES.zk, PRIVACY_ATTRIBUTES.fixedAmounts],
    riskSummary: readProjectMarkdown('tornado-cash', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'tornado-cash',
      'upgradesAndGovernance',
      {
        stakeLockPeriod: formatSeconds(
          voteExtendTime + executionExpiration + executionDelay,
        ),
        proposalThreshold: formatLargeNumber(
          Number(proposalThreshold / 10n ** 18n),
        ),
        votingDelay: formatSeconds(votingDelay),
        votingPeriod: formatSeconds(votingPeriod),
        closingPeriod: formatSeconds(closingPeriod),
        voteExtendTime: formatSeconds(voteExtendTime),
        quorumVotes: formatLargeNumber(Number(quorumVotes / 10n ** 18n)),
        executionDelay: formatSeconds(executionDelay),
        executionExpiration: formatSeconds(executionExpiration),
      },
    ),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
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
