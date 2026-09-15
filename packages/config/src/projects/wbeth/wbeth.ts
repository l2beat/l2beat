import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
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
if (rateCap === undefined) {
  throw new Error('wbeth: ExchangeRateUpdater has no configured caller')
}
const rateCapPercent = `${Number.parseFloat(
  (Number(BigInt(rateCap.amount)) / 1e16).toFixed(4),
)}%`
const rateCapInterval = formatSeconds(rateCap.interval, { fullUnit: true })
const rateCapIntervalShort =
  rateCap.interval === 365 * 86400 ? 'yr' : rateCapInterval
// --- Liquid staking risk comparison (DeFi summary tab) ---
const symbol = value('wBETH', 'symbol')
const minLockTime = duration('UnwrapTokenV1ETH', 'MIN_LOCK_TIME')
const lockTimeDays =
  discovery.getContractValue<number>('UnwrapTokenV1ETH', 'lockTimeSeconds') /
  86400
const supply = (
  BigInt(value('wBETH', 'totalSupply')) /
  10n ** 18n
).toLocaleString('en-US')

export const wbeth: BaseProject = {
  id: ProjectId('wbeth'),
  slug: 'wbeth',
  name: 'Binance',
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
    description: `${value('wBETH', 'symbol')} is Binance's liquid staking token for ETH. Users can mint by depositing ETH onchain, while Binance also mints it against BETH balances held on its exchange. Binance controls the exchange rate and custody, must fund queued redemptions (currently delayed by ${duration('UnwrapTokenV1ETH', 'lockTimeSeconds')}), and can mint, pause, blacklist or upgrade without delay.`,
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
    liquidStaking: {
      token: symbol,
      minting: {
        value: 'Permissionless',
        secondLine: 'swept by Binance',
        sentiment: 'bad',
        warning: {
          value: `About 99% of ${symbol} was minted by Binance against exchange balances, with no ETH deposited on-chain.`,
          sentiment: 'bad',
        },
        description: `Anyone can deposit ETH for ${symbol} at Binance's rate, no cap or fee. Binance's OperatorWallet, the only minter, issues ${symbol} against exchange balances with no ETH: about 99% of supply. An operator key sweeps deposited ETH to Binance at will.`,
      },
      operators: {
        value: 'Binance',
        secondLine: 'no bond',
        sentiment: 'bad',
        description: `No contract tracks validators, balances or slashing. Binance says ${symbol} is backed by BETH and its validators; the only on-chain trace is a withdrawal-credential account sweeping to a Binance wallet. Passing losses to holders is Binance's policy, not code.`,
      },
      backing: {
        value: 'Off-chain custody',
        secondLine: 'creds: Binance',
        sentiment: 'bad',
        description:
          'The operator key moves deposited ETH to an externally owned account that forwards to a Binance wallet. The token contract holds about 0.04% of the ETH the supply represents; the rest is an unverifiable exchange balance.',
      },
      exchangeRate: {
        value: `${callerLimits.length} of ${callerLimits.length}`,
        secondLine: `daily · ≤${rateCapPercent}/${rateCapIntervalShort}`,
        sentiment: 'bad',
        description: `One Binance key writes the rate through a relay capped at ${rateCapPercent} over ${rateCapInterval} with no per-update cap; the token only checks it is at least 1. The owner can repoint the oracle and set any rate at once. Nothing on-chain ties the rate to validators.`,
      },
      exit: {
        value: 'Binance-funded',
        secondLine: `${lockTimeDays} days · pausable`,
        sentiment: 'bad',
        description: `Burning ${symbol} records a claim paid after a ${lockTimeDays}-day lock (operator-set, minimum ${minLockTime}) and only once Binance funds the queue, at its discretion. Binance keys can pause or blacklist. About 11,500 ETH paid since 2023 against ${supply} ${symbol}.`,
      },
      upgrades: {
        value: 'Single EOA',
        secondLine: 'no delay · no veto',
        sentiment: 'bad',
        description:
          'One externally owned key is proxy admin of both contracts and can replace their code instantly; a second holds owner, master-minter, pauser and blacklister and owns the rate relay. No multisig, timelock or governance contract exists.',
      },
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
