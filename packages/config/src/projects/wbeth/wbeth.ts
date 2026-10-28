import { assert, formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { discoveredDefiToken } from '../../templates/defiTokens'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('wbeth')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

// Durations are read raw so the page can spell the unit out; the template
// keeps its own short-form copy.
const duration = (contract: string, key: string): string =>
  formatSeconds(discovery.getContractValue<number>(contract, key), {
    fullUnit: true,
  })

// The oracle contract's rate limit: each whitelisted caller may move the
// exchange rate by at most `amount` (1e18 scale, cumulative absolute change)
// per `interval`, refilling linearly. Rendered as a percentage of one ETH.
const callerLimits = discovery.getContractValue<
  { caller: string; amount: string; interval: number }[]
>('ExchangeRateUpdater', 'callerLimits')
const rateCap = callerLimits[0]
// The oracle risk says a single Binance key writes the rate.
assert(
  rateCap !== undefined && callerLimits.length === 1,
  'wbeth: ExchangeRateUpdater has more than one caller, update the oracle risk',
)
const rateCapPercent = `${Number.parseFloat(
  (Number(BigInt(rateCap.amount)) / 1e16).toFixed(4),
)}%`
const rateCapInterval = formatSeconds(rateCap.interval, { fullUnit: true })
const symbol = value('wBETH', 'symbol')
const lockTimeDays =
  discovery.getContractValue<number>('UnwrapTokenV1ETH', 'lockTimeSeconds') /
  86400

export const wbeth: BaseProject = {
  id: ProjectId('wbeth'),
  slug: 'wbeth',
  name: 'Binance Wrapped Beacon ETH',
  shortName: 'wBETH',
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
    description: `Binance Wrapped Beacon ETH (${value('wBETH', 'symbol')}) is a liquid staking token for ETH issued by Binance. Users can mint by depositing ETH onchain, while Binance also mints it against BETH balances held on its exchange. Binance controls the exchange rate and custody, must fund queued redemptions (currently delayed by ${duration('UnwrapTokenV1ETH', 'lockTimeSeconds')}), and can mint, pause, blacklist or upgrade without delay.`,
    detailedDescription: readProjectMarkdown('wbeth', 'detailedDescription', {
      symbol: value('wBETH', 'symbol'),
      rateCapPercent,
      rateCapInterval,
      lockTime: duration('UnwrapTokenV1ETH', 'lockTimeSeconds'),
      minLockTime: duration('UnwrapTokenV1ETH', 'MIN_LOCK_TIME'),
    }),
    links: {
      websites: ['https://www.binance.com/en/wbeth'],
      documentation: [
        'https://www.binance.com/en/support/faq/what-is-wbeth-e252366155174ba6887f6b32e3798273',
      ],
      repositories: [],
      socialMedia: ['https://x.com/binance'],
    },
    references: [
      {
        title: 'PeckShield audit of wBETH v1 (March 2023)',
        url: 'https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-wBETH-v1.0.pdf',
      },
      {
        title:
          'PeckShield audit of wBETH v2 and the unwrap contract (September 2023)',
        url: 'https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-wBETHV2-v1.0.pdf',
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
        'wBETH',
        "Appreciating wrapper of BETH, Binance's exchange balance for staked ETH; the rate is set by a Binance key.",
      ),
    ],
  },
  liquidStakingRisks: {
    minting: {
      value: 'Permissionless',
      secondLine: 'swept by Binance',
      sentiment: 'bad',
      warning: {
        value: `About 99% of ${symbol} was minted by Binance against exchange balances, with no ETH deposited onchain.`,
        sentiment: 'bad',
      },
      description: `Anyone can deposit ETH for ${symbol}, but about 99% of supply was minted by Binance against exchange balances, with no ETH deposited onchain. A Binance key can move deposited ETH to Binance at will.`,
    },
    operators: {
      value: 'Binance',
      secondLine: 'no bond',
      sentiment: 'bad',
      description: `No contract tracks validators, balances or slashing. Binance says its validators back ${symbol}; whether losses pass to holders is Binance's policy, not code.`,
    },
    backing: {
      value: 'Offchain custody',
      secondLine: 'creds: Binance',
      sentiment: 'bad',
      description:
        'Deposited ETH moves to a Binance wallet. The token contract holds about 0.04% of the ETH its supply represents; the rest is an exchange balance that cannot be checked onchain.',
    },
    oracle: {
      value: '1 of 1',
      secondLine: `daily · ≤${rateCapPercent}/${rateCap.interval === 365 * 86400 ? 'yr' : rateCapInterval}`,
      sentiment: 'bad',
      description: `One Binance key writes the rate, with no cap per update and at most ${rateCapPercent} over ${rateCapInterval}. The owner can switch the oracle and set any rate at once.`,
    },
    exit: {
      value: 'Binance-funded',
      secondLine: `${lockTimeDays} days · pausable`,
      sentiment: 'bad',
      description: `Burned ${symbol} is paid after a ${lockTimeDays}-day lock, only once Binance funds the queue. Binance keys can pause withdrawals or blacklist holders.`,
    },
    upgrades: {
      value: 'Single EOA',
      secondLine: 'no delay · no veto',
      sentiment: 'bad',
      description:
        'A single key can replace the code of both contracts instantly. There is no multisig, timelock or governance.',
    },
  },
  // The contracts call no bridge, price feed or other protocol; they only call
  // each other. Binance's off-chain custody and validator operation are trust
  // assumptions covered in the permissions and description above.
  externalDependencies: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
