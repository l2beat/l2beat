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
    detailedDescription: `Tornado Cash is a non-custodial mixer on Ethereum built around separate fixed-denomination pools, which prevents linking deposits and withdrawals via the amount. A deposit publishes a commitment into a Merkle tree producing a secret note, and a later withdrawal uses a zk-SNARK proof and the note to send the same denomination to a different address, breaking the deposit-withdrawal link. The note represents ownership of tokens in a Tornado cash pool, and losing it will effectively mean losing the tokens.

The core mixer contracts are immutable and have no admin, pause, or upgrade path, so funds can only move out with a valid proof. However Tornado cash features TORN token governance, which controls peripheral smart contracts: official pool registry, relayer registration requirement and TORN tokenomics.

### Privacy considerations

Tornado cash introduces a permissionless relayer network, which is essential for practical privacy. Relayers process withdrawals from Tornado cash pools on user's behalf for a fee, which enables withdrawals to fresh addresses without funding them before the withdrawal. Without an active relayer network, practical privacy of Tornado cash deteriorates significantly.

Practical privacy also depends on the timing of deposits and withdrawals, underlying network and browser used to interact with Tornado cash frontend (if used), RPC providers used to send transactions and query public blockchain state. Users are advised to research the best OPSEC practices.

### Compliance

Tornado cash does not have any protocol-level compliance features. However, it provides an optional [Compliance Tool](https://docs.tornado.cash/tornado-cash-classic/compliance-tool), which allows users to generate a proof linking a withdrawal to a specific deposit without revealing this information publicly onchain. This enables users to selectively disclose the origin of funds to third parties, such as exchanges or regulators.

Protocol pools were [sanctioned by OFAC in August 2022](https://home.treasury.gov/news/press-releases/jy0916), flagging funds moved through these smart contracts as illicit and forcing Tornado Cash transaction censorship. Sanctions were lifted on March 21, 2025.

### Anonymity set

User's anonymity set consists of all previous deposits into the same bucket (i.e. deposits of the same token and amount). Deposits could be mixed only with other deposits of the same token and denomination. To maximize the anonymity set, users are advised to deposit into the buckets with most usage.

### Secure frontend

For average users, the Tornado Cash frontend must be recognized as a critical part of the privacy protocol. If compromised, it can steal user assets and violate user privacy, which [was exploited in 2024](https://www.coindesk.com/business/2024/02/26/tornado-cash-reportedly-suffers-backend-exploit-user-deposits-at-risk).

The frontend's root of trust is the IPFS content hash registered for [tornadocash.eth](https://app.ens.domains/tornadocash.eth?tab=records) in the ENS smart contract on Ethereum. 
The latest hash can be fetched from a trusted ethereum node (e.g. your own node or a light node). 
There were incidents of malicious frontend hash updates passing onchain governance proposals before, so using a publicly audited or self-audited IPFS hash is advised. 
An example of audit process with useful links could be found [here](https://gist.github.com/pcaversaccio/ea7f62fd21b6e22f301980007f7c767e) or [here](https://notes.ethereum.org/@GW1ZUbNKR5iRjjKYx6_dJQ/Bk8zsJ9xj).
The frontend can then be accessed by running a local IPFS node that automatically fetches the verified frontend hash (e.g. in style of [dapp3.eth](https://github.com/apoorvlathey/dapp3)) and serves it in the browser locally.
`,
    links: {},
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
      PRIVACY_ATTRIBUTES.uncensorable,
      PRIVACY_ATTRIBUTES.fixedAmounts,
      PRIVACY_ATTRIBUTES.openSource,
    ],
    riskSummary: `## Funds can be stolen if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
<br>
## Funds can be lost if
1. a user loses the note secrets required to withdraw.  
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user (see [best practices page](/privacy/best-practices) for more info).`,
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
