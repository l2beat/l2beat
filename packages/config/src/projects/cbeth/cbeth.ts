import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
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
    description: `Coinbase Wrapped Staked ETH (${value('cbETH', 'symbol')}) is a liquid staking token for ETH issued by Coinbase. It is minted and redeemed only through Coinbase's exchange against staked ETH in Coinbase custody: the contracts hold no ETH and have no deposit or redemption function. Coinbase sets the exchange rate, controls supply and custody, and can mint, pause, blacklist or upgrade without delay.`,
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
        text: 'the proxy admin key upgrades the token to malicious code, or a minting key mints unbacked supply; each is a single key acting with no delay.',
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'the rate key or the oracle owner misreports the exchange rate; the relay cap does not bind at current values and the token only checks that the rate is non-zero.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the pauser halts transfers or the blacklister freezes an address, both with no delay, or if Coinbase declines or delays custodial redemption, the only exit for the token.',
      },
    ],
  },
}
