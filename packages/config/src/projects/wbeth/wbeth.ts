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
