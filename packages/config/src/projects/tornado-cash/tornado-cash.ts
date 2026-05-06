import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject, ProjectPrivacyToken } from '../../types'

const discovery = new ProjectDiscovery('tornado-cash')

const TORNADO_DEPOSIT_EVENT =
  '0xa945e51eec50ab98c161376f0db4cf2aeba3ec92755fe2fcd388bdbbb80ff196'
const TORNADO_WITHDRAWAL_EVENT =
  '0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931'
const MIN_RELEVANT_DEPOSITS_TORNADO = 100

function formatDenomination(amount: bigint, decimals: number): string {
  return utils.formatUnits(amount, decimals).replace(/\.?0+$/, '')
}

interface TornadoBucket {
  id: string
  address: ChainSpecificAddress
  symbol: string
  denomination: string
  denominationAmount: string
  decimals: number
  sinceBlock: number
  sinceTimestamp: UnixTime
  depositEvent: string
  withdrawalEvent: string
}

const PRICE_IDS: Record<string, string> = {
  ETH: 'ethereum',
  DAI: 'dai',
  USDC: 'usd-coin',
  USDT: 'tether',
  WBTC: 'wrapped-bitcoin',
  cDAI: 'compound-dai',
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
    chain: 'ethereum',
    sinceTimestamp: bucket.sinceTimestamp,
    tokens: [bucket.symbol],
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
    let asset = grouped.get(bucket.symbol)
    if (!asset) {
      asset = {
        token: {
          symbol: bucket.symbol,
          decimals: bucket.decimals,
          priceId: PRICE_IDS[bucket.symbol],
          sinceTimestamp: bucket.sinceTimestamp,
        },
        buckets: [],
      }
      grouped.set(bucket.symbol, asset)
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
      label: `${bucket.symbol} ${bucket.denomination}`,
      address: bucket.address,
      denomination: bucket.denomination,
      flows: {
        sinceBlock: bucket.sinceBlock,
        deposit: {
          chain: 'ethereum',
          event: bucket.depositEvent,
          address: bucket.address,
          extractor: 'fixedAmount',
          params: {
            amount: bucket.denominationAmount,
          },
        },
        withdrawal: {
          chain: 'ethereum',
          event: bucket.withdrawalEvent,
          address: bucket.address,
          extractor: 'fixedAmount',
          params: {
            amount: bucket.denominationAmount,
          },
        },
      },
    })
  }

  return Array.from(grouped.values()).sort((a, b) =>
    (a.token.symbol ?? '').localeCompare(b.token.symbol ?? '', undefined, {
      numeric: true,
    }),
  )
}

function getTornadoBuckets(): TornadoBucket[] {
  const poolAddresses = discovery.getContractValue<string[]>(
    'InstanceRegistry',
    'getAllInstanceAddresses',
  )

  const pools = poolAddresses
    .map((address) => discovery.getContract(address))
    .filter(
      (pool) =>
        Number(pool.values?.nextIndex ?? 0) >= MIN_RELEVANT_DEPOSITS_TORNADO,
    )

  return pools.map((pool) => {
    const token = pool.values?.token?.toString()
    const isNativeEth = token === undefined

    const symbol = isNativeEth ? 'ETH' : getSymbolFromToken(token)
    const decimals = isNativeEth ? 18 : getDecimalsFromToken(token)
    if (!symbol || !decimals) {
      throw new Error(`Unknown token ${token}`)
    }

    const denominationAmount = BigInt(
      pool.values?.denomination?.toString() ?? 0,
    )
    const denomination = formatDenomination(denominationAmount, decimals)

    return {
      id: `tornado-${symbol}-${denomination}`,
      address: pool.address,
      symbol,
      denomination,
      denominationAmount: denominationAmount.toString(),
      decimals,
      sinceBlock: pool.sinceBlock ?? 0,
      sinceTimestamp: pool.sinceTimestamp ?? 0,
      depositEvent: TORNADO_DEPOSIT_EVENT,
      withdrawalEvent: TORNADO_WITHDRAWAL_EVENT,
    }
  })
}

function getSymbolFromToken(token: string): string | undefined {
  const address = ChainSpecificAddress.address(token as ChainSpecificAddress)
  const symbolMap: Record<string, string> = {
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 'DAI',
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 'USDC',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'USDT',
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 'WBTC',
    '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643': 'cDAI',
  }

  return symbolMap[address]
}

function getDecimalsFromToken(token: string): number | undefined {
  const address = ChainSpecificAddress.address(token as ChainSpecificAddress)
  const decimalsMap: Record<string, number> = {
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 18,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 6,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 6,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 8,
    '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643': 8,
  }

  return decimalsMap[address]
}
