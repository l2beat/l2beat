import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('sweth')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

const number = (contract: string, key: string): number =>
  Number(discovery.getContractValue<string | number>(contract, key))

// Fractions are stored on-chain in 1e18 = 100%.
const percent = (contract: string, key: string): string =>
  `${Number.parseFloat(((number(contract, key) / 1e18) * 100).toFixed(2))}%`

const duration = (seconds: number): string =>
  formatSeconds(seconds, { fullUnit: true })

const safe = (name: string): string => `${discovery.getMultisigStats(name)}`

const paused = (key: string): boolean =>
  discovery.getContractValue<boolean>('AccessControlManager', key)

const swETH = value('swETH', 'symbol')

// Exit requests are processed only inside a rate report, so pausing the bot
// stops exits as well.
const exitWarnings = [
  paused('withdrawalsPaused') &&
    'Withdrawals are paused: no new exit requests can be made and processed requests cannot be claimed.',
  paused('botMethodsPaused') &&
    'Rate reports are paused: the rate is frozen and queued exit requests are not processed.',
].filter((warning) => warning !== false)

const repriceCap = percent('swETH', 'maximumRepriceDifferencePercentage')
const repriceInterval = duration(number('swETH', 'minimumRepriceTime'))
// Compounded largest move in a day, for the reader: the cap applies per report.
const dailyMax = `${Math.round(
  ((1 + number('swETH', 'maximumRepriceDifferencePercentage') / 1e18) **
    (86400 / number('swETH', 'minimumRepriceTime')) -
    1) *
    100,
)}%`
const operatorFee = percent('swETH', 'nodeOperatorRewardPercentage')
const treasuryFee = percent('swETH', 'swellTreasuryRewardPercentage')
const timelockDelay = duration(number('Timelock', 'delay'))
const adminSafe = safe('Swell Multisig')
const pauserSafe = safe('Swell Pauser Multisig')
const swOperators = value('NodeOperatorRegistry', 'numOperators')

// The bot role reports balances, stakes deposits and processes exits. The
// oracle also holds it, to call the token.
const botHolders = new Set(
  discovery.getContractValue<string[]>('AccessControlManager', 'botAC'),
)
botHolders.delete(discovery.getContract('RepricingOracle').address)
const botIsMultisig =
  botHolders.size === 1 &&
  botHolders.has(discovery.getContract('Swell Multisig').address)
const bot = botIsMultisig ? `Swell's ${adminSafe} multisig` : 'a Swell bot'
const whitelisted = discovery.getContractValue<boolean>(
  'swETH',
  'whitelistEnabled',
)

export const sweth: BaseProject = {
  id: ProjectId('sweth'),
  slug: 'sweth',
  name: 'Swell swETH',
  shortName: 'swETH',
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: paused('coreMethodsPaused')
      ? 'Deposits are paused.'
      : undefined,
    redWarning: undefined,
    emergencyWarning:
      exitWarnings.length > 0 ? exitWarnings.join(' ') : undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `${swETH} is Swell's liquid staking token, backed by Ethereum validators. Its rate comes from Swell's reports, and Swell's multisigs and timelock control its contracts.`,
    detailedDescription: readProjectMarkdown('sweth', 'detailedDescription', {
      swETH,
      repriceCap,
      repriceInterval,
      operatorFee,
      treasuryFee,
      timelockDelay,
      dailyMax,
      bot,
      adminSafe,
      pauserSafe,
      swOperators,
    }),
    links: {
      websites: ['https://app.swellnetwork.io/'],
      documentation: ['https://docs.swellnetwork.io/'],
      repositories: ['https://github.com/SwellNetwork/v3-core-public'],
      socialMedia: ['https://x.com/swellnetworkio'],
    },
    references: [
      {
        title: 'Sigma Prime: Swell Network security assessment (swETH)',
        url: 'https://github.com/SwellNetwork/v3-core-public/tree/master/Audit%20Reports/Seawolf',
      },
      {
        title: 'Cyfrin and Sigma Prime: swETH v2 (Barracuda) audits, 2024',
        url: 'https://github.com/SwellNetwork/v3-core-public/tree/master/Audit%20Reports/Barracuda',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    tvl: { source: 'l2beat' },
  },
  liquidStaking: {
    contracts: {
      type: 'sweth',
      swETH: discovery.getContract('swETH').address,
      exitQueue: discovery.getContract('swEXIT').address,
    },
    // swETH's WETH pools; Uniswap's is the deeper one.
    marketQuotes: [
      { type: 'uniswapV3', fee: 500 },
      { type: 'pancakeV3', fee: 500 },
    ],
    risks: {
      minting: {
        value: whitelisted ? 'Whitelisted' : 'Permissionless',
        secondLine: 'staked by Swell',
        sentiment: whitelisted ? 'bad' : 'good',
        description: `Anyone can deposit ETH for ${swETH} unless deposits are paused or the whitelist is on. The ETH reaches the deposit manager in the same call, and ${bot} decides when it is staked and with which providers.`,
      },
      operators: {
        value: 'Whitelisted',
        secondLine: 'no bond',
        sentiment: 'warning',
        description: `${swOperators} registered staking providers, chosen by Swell and added only through the timelock, which waits ${timelockDelay}. They post no bond, so slashing losses fall on all holders.`,
      },
      backing: {
        value: 'Protocol contract',
        secondLine: 'creds: protocol',
        sentiment: 'good',
        description: `Every ${swETH} validator withdraws to the deposit manager, which pays the exit queue.`,
      },
      oracle: {
        value: botIsMultisig ? adminSafe.replace('/', ' of ') : 'Swell bot',
        secondLine: `≥${formatSeconds(number('swETH', 'minimumRepriceTime'))} · ≤${repriceCap}`,
        sentiment: botIsMultisig ? 'warning' : 'bad',
        description: `Reports come from ${bot}, and nothing onchain checks the beacon-chain balances they state. Each report moves the rate by at most ${repriceCap}, at least ${repriceInterval} apart, about ${dailyMax} a day. If reports stop, the rate and the exit queue stop.`,
      },
      exit: {
        value: 'Oracle-gated',
        secondLine: 'in reports · pausable',
        sentiment: 'warning',
        description: `Holders queue in swEXIT and are paid in order when a rate report processes the queue, at the lower of the rate at request and at processing. Nothing sets a deadline. Any single signer of the ${pauserSafe} pauser multisig can pause requests and claims, and only the ${adminSafe} multisig can lift the pause.`,
      },
      upgrades: {
        value: `${adminSafe} Safe`,
        secondLine: `${formatSeconds(number('Timelock', 'delay'))} · no veto`,
        sentiment: 'warning',
        description: `Every upgradeable contract upgrades through a timelock that waits ${timelockDelay}. The ${adminSafe} multisig controls it, and through it can also repoint the addresses the contracts resolve and change fees and reprice bounds. Holders have no veto.`,
      },
    },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'LayerZero',
      icon: 'layerzero',
      description: `${swETH} on other chains is a LayerZero OFT backed by ${swETH} locked in the Ethereum OFT contract. A compromise of LayerZero or of the OFT owner, Swell's multisig, could release the locked tokens.`,
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `the timelock admin upgrades a contract or repoints the registry addresses, after ${timelockDelay}.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'the bot role reports false validator balances; each report can move the rate within the reprice bound and nothing on-chain checks the balances.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'any single signer of the pauser multisig pauses withdrawals, which also blocks claims, or the bot role stops processing the exit queue.',
      },
    ],
  },
}
