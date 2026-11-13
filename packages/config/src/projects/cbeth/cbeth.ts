import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { discoveredDefiToken } from '../../templates/defiTokens'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('cbeth')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

const duration = (seconds: number): string =>
  formatSeconds(seconds, { fullUnit: true })

// Both relays share the same rate-limit code: every whitelisted caller has an
// allowance (1e18 scale) that refills linearly over its interval. Two numbers
// describe such a set of callers: the largest single allowance (the biggest
// burst one key can push before waiting) and the fastest refill (the highest
// sustained rate), which can belong to different callers.
type CallerLimit = {
  caller: string
  amount: string | number
  interval: number
}

const units = (raw: string | number): number => Number(BigInt(raw)) / 1e18

const callerLimits = (contract: string): CallerLimit[] => {
  const limits = discovery.getContractValue<CallerLimit[]>(
    contract,
    'callerLimits',
  )
  if (limits.length === 0) {
    throw new Error('cbeth: a rate-limited relay has no configured caller')
  }
  return limits
}

const largestBurst = (limits: CallerLimit[]): CallerLimit =>
  limits.reduce((best, l) =>
    BigInt(l.amount) > BigInt(best.amount) ? l : best,
  )

const fastestRefillPerDay = (limits: CallerLimit[]): number =>
  Math.max(...limits.map((l) => (units(l.amount) * 86400) / l.interval))

// Exchange-rate relay: the cap is a cumulative absolute change in the
// ETH-per-token rate. It is rendered in ETH per token and as a multiple of
// the current rate, so the page says how binding it is.
const rateCap = largestBurst(callerLimits('ExchangeRateUpdater'))
const rateCapEth = `${Number.parseFloat(units(rateCap.amount).toFixed(4))}`
const rateCapInterval = duration(rateCap.interval)
const exchangeRate = Number(value('cbETH', 'exchangeRate'))
const rateCapMultiple = `${Number.parseFloat((units(rateCap.amount) / exchangeRate).toFixed(1))}×`

// Mint relay: the cap is an amount of tokens per interval.
const mintLimits = callerLimits('MintForwarder')
const mintCap = largestBurst(mintLimits)
const maxMintAllowance = Math.round(units(mintCap.amount)).toLocaleString(
  'en-US',
)
const maxMintInterval = duration(mintCap.interval)
const maxMintPerDay = Math.round(
  fastestRefillPerDay(mintLimits),
).toLocaleString('en-US')
const mintCallerCount = discovery.getContractValue<string[]>(
  'MintForwarder',
  'callers',
).length
// --- Liquid staking risk comparison ---
const symbol = value('cbETH', 'symbol')
const rateCallerCount = callerLimits('ExchangeRateUpdater').length
const rateCapPercent = `${Number.parseFloat((units(rateCap.amount) * 100).toFixed(2))}%`
const rateCapIntervalShort =
  rateCap.interval === 365 * 86400 ? 'yr' : rateCapInterval

const minterCount = discovery.getContractValue<string[]>(
  'cbETH',
  'minters',
).length

export const cbeth: BaseProject = {
  id: ProjectId('cbeth'),
  slug: 'cbeth',
  name: 'Coinbase Wrapped Staked ETH',
  shortName: 'cbETH',
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `Coinbase Wrapped Staked ETH (${value('cbETH', 'symbol')}) is Coinbase's liquid staking token. It is minted and redeemed only through Coinbase, and no contract holds the ETH behind it. Coinbase sets the exchange rate and can mint, pause, blacklist or upgrade without delay.`,
    detailedDescription: readProjectMarkdown('cbeth', 'detailedDescription', {
      symbol: value('cbETH', 'symbol'),
      rateCapEth,
      rateCapInterval,
      rateCapMultiple,
      minterCount,
      mintCallerCount,
      maxMintAllowance,
      maxMintInterval,
      maxMintPerDay,
    }),
    links: {
      websites: ['https://www.coinbase.com/cbeth'],
      documentation: ['https://www.coinbase.com/cbeth/whitepaper'],
      repositories: ['https://github.com/coinbase/wrapped-tokens-os'],
      socialMedia: ['https://x.com/CoinbaseAssets'],
    },
    references: [
      {
        title:
          'OpenZeppelin audit of the Coinbase liquid staking token (August 2022)',
        url: 'https://blog.openzeppelin.com/coinbase-liquid-staking-token-audit',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    tvl: { source: 'l2beat' },
    tokens: [
      discoveredDefiToken(
        discovery,
        'cbETH',
        'Appreciating token for ETH staked through Coinbase. A Coinbase key sets the rate.',
      ),
    ],
  },
  liquidStaking: {
    contracts: {
      type: 'cbeth',
      cbETH: discovery.getContract('cbETH').address,
    },
    // Liquidity moved between these over the period. Coinbase redeems
    // off-chain, so the market is the only onchain exit.
    marketQuotes: [
      { type: 'uniswapV3', fee: 500 },
      {
        type: 'curve',
        pool: ChainSpecificAddress(
          'eth:0x5FAE7E604FC3e24fd43A72867ceBaC94c65b404A',
        ),
        i: 1,
        j: 0,
      },
    ],
    risks: {
      minting: {
        value: 'Coinbase only',
        secondLine: 'no onchain deposit',
        sentiment: 'bad',
        description: `There is no deposit function. Coinbase keys mint ${symbol} through a rate-limited relay, with no ETH attached, against balances on its exchange.`,
      },
      operators: {
        value: 'Coinbase',
        secondLine: 'no bond',
        sentiment: 'bad',
        description: `No contract tracks validators, balances or slashing. Whether losses pass to ${symbol} holders is Coinbase's policy, not code.`,
      },
      backing: {
        value: 'Coinbase-held',
        secondLine: 'creds: Coinbase',
        sentiment: 'bad',
        description:
          'No contract holds ETH. The backing is a Coinbase balance that cannot be checked onchain.',
      },
      oracle: {
        value: `${rateCallerCount} of ${rateCallerCount}`,
        secondLine: `daily · ≤${rateCapPercent}/${rateCapIntervalShort}`,
        sentiment: 'bad',
        warning: {
          value: `The cap is about ${rateCapMultiple} the current rate, so it does not bind.`,
          sentiment: 'bad',
        },
        description: `One Coinbase key writes the rate, capped at ${rateCapPercent} of one ETH over ${rateCapInterval}. The owner can replace the oracle at once. No contract uses the rate.`,
      },
      exit: {
        value: 'Coinbase only',
        secondLine: 'no onchain redemption',
        sentiment: 'bad',
        description: `${symbol} cannot be redeemed onchain. Holders redeem through Coinbase on its terms, or sell. Coinbase keys can pause transfers or blacklist holders.`,
      },
      upgrades: {
        value: 'Single EOA',
        secondLine: 'no delay · no veto',
        sentiment: 'bad',
        description:
          'A single key can replace the token code instantly. There is no multisig, timelock or governance.',
      },
    },
  },
  // The contracts call no bridge, price feed or other protocol; the two relays
  // only call the token. Coinbase's off-chain custody and validator operation
  // are trust assumptions covered in the permissions and description above.
  externalDependencies: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the proxy admin upgrades the token to malicious code, or a minting key mints unbacked supply.',
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'the rate key or the oracle owner misreports the exchange rate. The relay cap does not bind at current values.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the pauser halts transfers, the blacklister freezes an address, or Coinbase stops redeeming.',
      },
    ],
  },
}
