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
  privacyInfo: {
    trustedSetup: TRUSTED_SETUPS.TornadoCash,
    tokens: getPrivacyTokens(),
    attributes: [
      PRIVACY_ATTRIBUTES.immutable,
      PRIVACY_ATTRIBUTES.unconditionalPrivacy,
      PRIVACY_ATTRIBUTES.fixedAmounts,
      PRIVACY_ATTRIBUTES.sourceAvailable,
    ],
    riskSummary: readProjectMarkdown('tornado-cash', 'riskSummary'),
    upgradesAndGovernance: `
Tornado cash has a TORN DAO, which does not have the authority to upgrade or modify existing pools in any way. However it controls a significant portion of the Tornado cash protocol and periphery, including:

1. **Default router for deposits and withdrawals and the official registry of supported pools**. Malicious upgrades of these components could lead to users losing deposited tokens.  
2. **Standard UI IPFS hash registered on ENS** ([link](https://app.ens.domains/tornadocash.eth)). Malicious upgrades of these components could lead to users losing deposited tokens.  
3. **TORN token itself**. Malicious upgrades of the token could lead to token transfers being frozen.  
4. **Registered relayers**. Malicious upgrades of these components could remove all registered relayers, disrupting user-relayer coordination and complicating private withdrawals.

### **Governance flow**

1. Users lock TORN token in the Governance contract ([0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce](https://etherscan.io/address/0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce)). After voting or proposing, staked tokens are locked for ${formatSeconds(voteExtendTime + executionExpiration + executionDelay)} after proposal ends, preventing governance hopping. The stake can be delegated to another address.  
2. Anyone with at least ${formatLargeNumber(Number(proposalThreshold / 10n ** 18n))} TORN can create a proposal. The proposal spends ${formatSeconds(votingDelay)} in the Pending state, where voting is still disabled, followed by ${formatSeconds(votingPeriod)} of Active state, when votes are cast. If the vote outcome changes in the last ${formatSeconds(closingPeriod)}, the voting period is extended by another ${formatSeconds(voteExtendTime)}.  
3. Proposal is accepted by the simple majority with a required quorum of ${formatLargeNumber(Number(quorumVotes / 10n ** 18n))} TORN. Once accepted, ${formatSeconds(executionDelay)} of Timelocked state allow exiting the protocol to everyone who disagrees with the proposal. Afterwards, the proposal can be permissionlessly executed within ${formatSeconds(executionExpiration)}.     
    `,
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
