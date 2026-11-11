import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('stakewise')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

const number = (contract: string, key: string): number =>
  Number(discovery.getContractValue<string | number>(contract, key))

const duration = (seconds: number): string =>
  formatSeconds(seconds, { fullUnit: true })

const safe = (name: string): string => `${discovery.getMultisigStats(name)}`

// Percent strings from the two on-chain scales: basis points (10000 = 100%)
// and wad (1e18 = 100%).
const percent = (fraction: number, digits = 2): string =>
  `${Number.parseFloat((fraction * 100).toFixed(digits))}%`
const bps = (contract: string, key: string): string =>
  percent(number(contract, key) / 10_000)
const wad = (raw: string | number): number => Number(BigInt(raw)) / 1e18

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60

const osETH = value('osETH', 'symbol')

// Oracle committee: the Keeper's thresholds and the registered oracle set
// must agree, otherwise the page would describe a quorum that cannot form.
const oracleCount = discovery.getContractValue<string[]>(
  'Keeper',
  'oracles',
).length
if (oracleCount !== number('Keeper', 'totalOracles')) {
  throw new Error('stakewise: oracle set and totalOracles disagree')
}
const rewardsMinOracles = number('Keeper', 'rewardsMinOracles')
const validatorThreshold = number('Keeper', 'validatorsMinOracles')
const oracleThreshold = `${rewardsMinOracles} of ${oracleCount}`

// Reward-rate ceiling: an immutable of the Keeper, read from its constructor.
// avgRewardPerSecond is a fraction of total assets per second (1e18 = 100%).
const rewardsDelaySeconds = number('Keeper', 'rewardsDelay')
const rewardsInterval = duration(rewardsDelaySeconds)
const keeperArgs = discovery.getContractValue<{
  maxAvgRewardPerSecond: string | number
}>('Keeper', 'constructorArgs')
const maxRatePerYear = wad(keeperArgs.maxAvgRewardPerSecond) * SECONDS_PER_YEAR
const rateCapYear = percent(maxRatePerYear)
const rateCapInterval = percent(
  (maxRatePerYear * rewardsDelaySeconds) / SECONDS_PER_YEAR,
  3,
)

const osFee = bps('OsTokenVaultController', 'feePercent')

// Collateral rules: the default and the per-vault overrides the DAO has set.
type OsTokenConfig = {
  vault?: string
  ltvPercent: string | number
  liqThresholdPercent: string | number
  liqBonusPercent: string | number
}
const defaultConfig = discovery.getContractValue<OsTokenConfig>(
  'OsTokenConfig',
  'defaultConfig',
)
const defaultLtv = percent(wad(defaultConfig.ltvPercent))
const defaultLiqThreshold = percent(wad(defaultConfig.liqThresholdPercent))
const LIQUIDATIONS_DISABLED = 2n ** 64n - 1n
const noLiqVaults = discovery
  .getContractValue<OsTokenConfig[]>('OsTokenConfig', 'vaultConfigs')
  .filter(
    (c) =>
      c.vault !== '0x0000000000000000000000000000000000000000' &&
      BigInt(c.liqThresholdPercent) === LIQUIDATIONS_DISABLED,
  )
const noLiqVaultCount = noLiqVaults.length
const maxLtv = percent(
  Math.max(
    wad(defaultConfig.ltvPercent),
    ...noLiqVaults.map((c) => wad(c.ltvPercent)),
  ),
)

const approvedImplCount = discovery.getContractValue<string[]>(
  'VaultsRegistry',
  'vaultImpls',
).length

// A redeemer the DAO replaced keeps the osETH queued in it, but vaults only
// honour the current redeemer, so that queue is paid only through swaps.
const retiredQueued = BigInt(value('RetiredOsTokenRedeemer', 'queuedShares'))
const retiredRedeemerNote =
  retiredQueued > 0n
    ? ` A redeemer the DAO has since replaced still holds ${osETH} queued before the switch; it can no longer redeem positions, so that queue is paid out only when someone buys the queued ${osETH} with ETH.`
    : ''

const redeemInterval = duration(
  number('OsTokenRedeemer', 'exitQueueUpdateDelay'),
)

// DAO: a Safe, plus a SafeSnap (Reality) module through which token votes
// execute after the question timeout and the cooldown.
const daoSafe = safe('StakeWise DAO Multisig')
const opsSafe = safe('StakeWise Operations Multisig')
const voteDelay = duration(
  number('StakeWise DAO RealityModule', 'questionTimeout') +
    number('StakeWise DAO RealityModule', 'questionCooldown'),
)
const bond = `${Math.round(
  wad(value('StakeWise DAO RealityModule', 'minimumBond')),
).toLocaleString('en-US')} SWISE`

export const stakewise: BaseProject = {
  id: ProjectId('stakewise'),
  slug: 'stakewise',
  name: 'StakeWise',
  shortName: undefined,
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
    description: `StakeWise is a marketplace of staking vaults with one liquid token, ${osETH}, minted against shares of any vault. Vaults are permissionless and hold their own ETH, but an oracle committee reports every vault's balance and the ${osETH} reward rate, and a DAO multisig can change the collateral rules, the oracle set and the approved vault code without delay.`,
    detailedDescription: readProjectMarkdown(
      'stakewise',
      'detailedDescription',
      {
        osETH,
        oracleCount,
        oracleThreshold,
        validatorThreshold,
        rewardsInterval,
        rateCapYear,
        rateCapInterval,
        retiredRedeemerNote,
        osFee,
        defaultLtv,
        defaultLiqThreshold,
        noLiqVaultCount,
        maxLtv,
        approvedImplCount,
        redeemInterval,
        daoSafe,
        opsSafe,
        voteDelay,
        bond,
      },
    ),
    links: {
      websites: ['https://app.stakewise.io/'],
      documentation: ['https://docs.stakewise.io/'],
      repositories: ['https://github.com/stakewise/v3-core'],
      socialMedia: ['https://x.com/stakewise_io'],
    },
    references: [
      {
        title:
          'StakeWise V3 audits (Halborn, Sigma Prime, Consensys Diligence, ABDK, Statemind)',
        url: 'https://docs.stakewise.io/contracts/audits',
      },
      {
        title: 'Statemind audit of v5 (April 2026)',
        url: 'https://github.com/stakewise/v3-core/blob/main/audits/2026-04-Statemind.pdf',
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
      name: 'Reality.eth',
      icon: 'reality',
      description: `The DAO's SafeSnap module executes Snapshot votes through Reality.eth's bonded answer oracle: an answer that goes unchallenged for ${voteDelay} can push any transaction through the DAO multisig, and the Reality.eth arbitrator settles disputes.`,
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `the DAO multisig raises a vault's loan-to-value or replaces the Keeper and lets a vault it controls mint unbacked ${osETH}, or ${oracleThreshold} oracles report balances a vault does not have; none of this needs a delay.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: `the oracle quorum sets the ${osETH} reward rate above the real yield or misreports a vault's rewards; the rate is capped at ${rateCapYear} a year (about ${rateCapInterval} every ${rewardsInterval}) and never falls, but the per-vault rewards are not bounded and ${noLiqVaultCount} vaults mint ${osETH} up to ${maxLtv} with liquidations disabled.`,
      },
      {
        category: 'Funds can be frozen if',
        text: 'the oracles stop signing: vault balances and both exit queues only advance with their updates, so ETH that key managers withdraw from validators stays in the vault and nobody else can release it, while the ${osETH} rate keeps rising at the last reported rate.',
      },
    ],
  },
}
