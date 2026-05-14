import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
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

function formatDenomination(amount: bigint, decimals: number): string {
  return utils.formatUnits(amount, decimals).replace(/\.?0+$/, '')
}

interface TornadoBucket {
  id: string
  address: ChainSpecificAddress
  tokenAddress: EthereumAddress
  tokenInfo: { symbol: string; decimals: number; priceId: string }
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
    links: {
      websites: ['https://tornadocash.network'],
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
    riskSummary: `## Funds can be lost if
1. the zk proof system is broken, allowing invalid withdrawals.
2. the [trusted setup](#trusted-setups) is compromised or all ceremony participants collude, allowing invalid withdrawals.
3. a user loses the note secrets required to withdraw.  
<br>
## Privacy can be lost if
1. no relayer is available and the withdrawal must be submitted from an address that can be linked to the user.`,
    upgradesAndGovernance:
      'Tornado cash has a TORN DAO, however it does not have the authority to upgrade or modify existing pools in any way. It can only add new pools to the onchain setup and the official UI, manage relayer-relevant parameters and govern the TORN token.',
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
      },
      denomination,
      denominationAmount: denominationAmount.toString(),
      sinceTimestamp: pool.sinceTimestamp ?? 0,
      depositEvent: TORNADO_DEPOSIT_EVENT,
      withdrawalEvent: TORNADO_WITHDRAWAL_EVENT,
    }
  })
}
