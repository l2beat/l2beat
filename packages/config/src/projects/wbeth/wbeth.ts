import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('wbeth')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

// 18-decimals wei string -> whole tokens with thousands separators.
const whole = (contract: string, key: string): string =>
  (
    BigInt(discovery.getContractValue<string>(contract, key)) /
    10n ** 18n
  ).toLocaleString('en-US')

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
if (rateCap === undefined) {
  throw new Error('wbeth: ExchangeRateUpdater has no configured caller')
}
const rateCapPercent = `${Number.parseFloat(
  (Number(BigInt(rateCap.amount)) / 1e16).toFixed(4),
)}%`
const rateCapInterval = formatSeconds(rateCap.interval, { fullUnit: true })
const oracleCallerCount = discovery.getContractValue<string[]>(
  'ExchangeRateUpdater',
  'callers',
).length

const minterCount = discovery.getContractValue<string[]>(
  'wBETH',
  'minters',
).length
const hotWalletCount = discovery.getContractValue<string[]>(
  'OperatorWallet',
  'hotWallets',
).length

// Every token-level role is checked against the owner so the text can say
// "one key" only when the chain agrees.
const ownerKey = value('wBETH', 'owner')
const tokenRolesOnOwner = ['masterMinter', 'pauser', 'blacklister'].every(
  (role) => value('wBETH', role) === ownerKey,
)
const queueRolesOnOwner = ['owner', 'pauser', 'blacklister'].every(
  (role) => value('UnwrapTokenV1ETH', role) === ownerKey,
)
const oracleOwnedByOwner = value('ExchangeRateUpdater', 'owner') === ownerKey
const oneAdminKey = tokenRolesOnOwner && queueRolesOnOwner && oracleOwnedByOwner
const adminKeyPhrase = oneAdminKey
  ? 'a single externally owned account is owner, master minter, pauser and blacklister of the token, owner, pauser and blacklister of the redemption queue, and owner of the oracle'
  : 'a small set of externally owned accounts hold the owner, master minter, pauser and blacklister roles across the token, the redemption queue and the oracle'

const upgradeKeysAreOne =
  value('wBETH', '$admin') === value('UnwrapTokenV1ETH', '$admin')
const upgradePhrase = upgradeKeysAreOne
  ? 'a second key can upgrade both the token and the redemption queue'
  : 'separate keys can upgrade the token and the redemption queue'

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
    description: `${value('wBETH', 'symbol')} is Binance's liquid staking token for ETH staked through the exchange. On-chain, anyone can mint it by depositing ETH at the current exchange rate and redeem it into a queue that pays out after ${duration('UnwrapTokenV1ETH', 'lockTimeSeconds')}, but the ETH does not stay in the contracts: an operator key moves it to a Binance-controlled address and the validators are run and accounted for off-chain. The exchange rate is a single number written by a Binance bot through a rate limiter that allows a cumulative move of ${rateCapPercent} per ${rateCapInterval}; nothing on-chain ties it to validator balances. Most of the supply (${whole('wBETH', 'totalSupply')} ${value('wBETH', 'symbol')} today) was minted by a Binance wallet with an unlimited allowance against ETH held on the exchange rather than deposited on-chain. Every role is held by Binance keys: ${adminKeyPhrase}, with no delay, and ${upgradePhrase} instantly.`,
    detailedDescription: readProjectMarkdown('wbeth', 'detailedDescription', {
      symbol: value('wBETH', 'symbol'),
      exchangeRate: value('wBETH', 'exchangeRate'),
      totalSupply: whole('wBETH', 'totalSupply'),
      rateCapPercent,
      rateCapInterval,
      oracleCallerCount,
      minterCount,
      hotWalletCount,
      lockTime: duration('UnwrapTokenV1ETH', 'lockTimeSeconds'),
      minLockTime: duration('UnwrapTokenV1ETH', 'MIN_LOCK_TIME'),
      claimsRecorded: value('UnwrapTokenV1ETH', 'nextIndex'),
      upgradePhrase,
      adminKeyPhrase,
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
