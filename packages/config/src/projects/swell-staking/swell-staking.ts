import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('swell-staking')

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

const anyPaused = (key: string): boolean =>
  ['swETHAccessControlManager', 'rswETHAccessControlManager'].some((acm) =>
    discovery.getContractValue<boolean>(acm, key),
  )

const swETH = value('swETH', 'symbol')
const rswETH = value('rswETH', 'symbol')

// Both tokens share the reprice bounds; the page states the swETH values and
// checks that rswETH matches, so a divergence fails the build.
const repriceCap = percent('swETH', 'maximumRepriceDifferencePercentage')
const repriceInterval = duration(number('swETH', 'minimumRepriceTime'))
if (
  repriceCap !== percent('rswETH', 'maximumRepriceDifferencePercentage') ||
  repriceInterval !== duration(number('rswETH', 'minimumRepriceTime'))
) {
  throw new Error('swell-staking: swETH and rswETH reprice bounds differ')
}
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

export const swellStaking: BaseProject = {
  id: ProjectId('swell-staking'),
  slug: 'swell-staking',
  name: 'Swell',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: anyPaused('withdrawalsPaused')
      ? `Withdrawals are paused: no new ${swETH} or ${rswETH} exit requests can be made and processed requests cannot be claimed.`
      : undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `Swell runs two liquid staking tokens: ${swETH}, backed by Ethereum validators, and ${rswETH}, backed by validators whose withdrawals go through EigenLayer. Each has its own contracts and ETH, but both are priced by Swell's reports and governed by the same multisigs and timelock.`,
    detailedDescription: readProjectMarkdown(
      'swell-staking',
      'detailedDescription',
      {
        swETH,
        rswETH,
        repriceCap,
        repriceInterval,
        operatorFee,
        treasuryFee,
        timelockDelay,
        dailyMax,
        adminSafe: safe('Swell Multisig'),
        pauserSafe: safe('Swell Pauser Multisig'),
        swOperators: value('swETHNodeOperatorRegistry', 'numOperators'),
        rswOperators: value('rswETHNodeOperatorRegistry', 'numOperators'),
      },
    ),
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
      {
        title: 'Sigma Prime and Nethermind: rswETH restaking audits',
        url: 'https://github.com/SwellNetwork/v3-core-public/tree/master/Audit%20Reports/Barracude%20(LRT)',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    tvl: { source: 'l2beat' },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'EigenLayer',
      icon: 'eigenlayer',
      description: `Every ${rswETH} validator withdraws to a Swell-controlled EigenPod, so its ETH returns through EigenLayer's withdrawal queue (about 14 days) and EigenLayer governance can upgrade the pods. No Swell restaking account is exposed to slashing while its EigenLayer operator allocates no stake, but Swell's multisig chooses the operators without delay.`,
    },
    {
      type: 'not-tracked',
      name: 'LayerZero',
      icon: 'layerzero',
      description: `${swETH} and ${rswETH} on other chains are LayerZero OFTs backed by tokens locked in the two Ethereum OFT contracts. A compromise of LayerZero or of the OFT owner, Swell's multisig, could release the locked tokens.`,
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `the timelock admin upgrades a contract or repoints the registry addresses after the ${timelockDelay} delay, or the multisig forces ${rswETH} oracle reports that mint fee shares to addresses it controls, which needs no delay.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: 'the bot reports false validator balances; each report can move the rate within the reprice bound and nothing on-chain checks the balances.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'any single signer of the pauser multisig pauses withdrawals, which also blocks claims, or the bot stops processing the exit queue.',
      },
    ],
  },
}
