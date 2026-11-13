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
const questionTimeout = duration(
  number('StakeWise DAO RealityModule', 'questionTimeout'),
)
const questionCooldown = duration(
  number('StakeWise DAO RealityModule', 'questionCooldown'),
)
// Only an arbitrator contract that calls the oracle's arbitration functions
// can rule. A Reality.eth instance never does, so with one as the arbitrator
// a dispute ends only when no one outbids the last bond.
const arbitrator = value(
  'StakeWise DAO RealityModule',
  'questionArbitrator',
).toLowerCase()
const arbitration = ['RealityETH', 'RealityETH_ERC20'].some(
  (name) => discovery.getContract(name).address.toLowerCase() === arbitrator,
)
  ? 'No arbitrator can rule, so disputes are settled only by outbidding the bond.'
  : 'An arbitrator contract can settle disputes.'

// osETH redemption fee, taken when a holder enters the queue.
const redeemFee = bps('OsTokenRedeemer', 'redemptionFeePercent')
const maxRedeemFee = bps('OsTokenRedeemer', 'maxRedemptionFeePercent')

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
    description: `StakeWise is a marketplace of staking vaults with one liquid token, ${osETH}, minted against vault shares. Vaults are permissionless and hold their own ETH, but an oracle committee reports every vault's balance and the ${osETH} reward rate, and a DAO multisig can change the collateral rules, the oracle set and the approved vault code, and register any contract as a vault, without delay.`,
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
        osFee,
        defaultLtv,
        defaultLiqThreshold,
        noLiqVaultCount,
        maxLtv,
        approvedImplCount,
        redeemInterval,
        redeemFee,
        maxRedeemFee,
        daoSafe,
        opsSafe,
        questionTimeout,
        questionCooldown,
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
    tokens: [
      discoveredDefiToken(
        discovery,
        'osETH',
        'Appreciating token minted against StakeWise vault shares. An oracle committee sets the rate.',
      ),
    ],
  },
  liquidStaking: {
    contracts: {
      type: 'stakewise',
      osETH: discovery.getContract('osETH').address,
      vaultController: discovery.getContract('OsTokenVaultController').address,
      redeemer: discovery.getContract('OsTokenRedeemer').address,
      previousRedeemer: discovery.getContract('RetiredOsTokenRedeemer').address,
    },
    // The ETH market since 2025-12. Before it, osETH traded against ETH on a
    // Balancer V2 pool that was drained on 2025-11-03 and now quotes zero.
    marketQuotes: [
      {
        type: 'fluid',
        pool: ChainSpecificAddress(
          'eth:0xC0652bdDcfF7739dadf0C9567584B35Ca63eB8E1',
        ),
        swap0to1: false,
      },
    ],
    risks: {
      minting: {
        value: 'Permissionless',
        secondLine:
          noLiqVaultCount > 0
            ? `${defaultLtv} LTV · ${maxLtv}`
            : `${defaultLtv} LTV`,
        sentiment: 'good',
        description: `Anyone can deposit ETH into a vault and mint ${osETH} against the shares, up to ${defaultLtv} of their value by default and ${maxLtv} in the ${noLiqVaultCount} vaults the DAO exempts from liquidation. The ETH stays in the vault until ${validatorThreshold} of ${oracleCount} oracles approve its staking keys.`,
      },
      operators: {
        value: 'Permissionless',
        secondLine: 'no bond',
        sentiment: 'warning',
        description: `Anyone can open a vault and choose who stakes for it, with no bond. A vault's losses fall on its own stakers. ${osETH} is exposed through the collateral rules: ${noLiqVaultCount} vaults mint up to ${maxLtv} with no liquidation.`,
      },
      backing: {
        value: 'Vault contracts',
        secondLine: 'creds: vault',
        sentiment: 'good',
        description: `Validators a vault registers withdraw to the vault. Consolidating stake into a validator the vault does not track needs the vault's manager and ${validatorThreshold} of ${oracleCount} oracles, and the contracts do not check where that validator withdraws.`,
      },
      oracle: {
        value: oracleThreshold,
        secondLine: `${formatSeconds(rewardsDelaySeconds)} · ≤${rateCapYear}/yr`,
        sentiment: 'warning',
        description: `${oracleThreshold} oracles report at most once every ${rewardsInterval}. The ${osETH} rate never falls and is capped at ${rateCapYear} a year unless the DAO multisig replaces the Keeper, but each vault's reported balance has no cap. If the oracles stop, vault exit queues stop while the rate keeps growing.`,
      },
      exit: {
        value: 'Redemption queue',
        secondLine: `${formatSeconds(number('OsTokenRedeemer', 'exitQueueUpdateDelay'))} batches · no pause`,
        sentiment: 'warning',
        description: `${osETH} holders queue in the redeemer, paid in batches at least ${redeemInterval} apart by redeeming staker positions that a ${opsSafe} multisig selects. The queue moves only when positions are redeemed or someone buys queued ${osETH}. The DAO multisig can set a fee of up to ${maxRedeemFee} and replace the redeemer.`,
      },
      upgrades: {
        value: `${daoSafe} multisig`,
        secondLine: 'no delay · no veto',
        sentiment: 'bad',
        description: `Core contracts cannot be upgraded, but the ${daoSafe} DAO multisig changes oracles, collateral rules and approved vault code, and can register any contract as a vault, with no delay. SWISE votes can also execute through SafeSnap after ${voteDelay}. Holders have no veto.`,
      },
    },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'Reality.eth',
      icon: 'reality',
      description: `The DAO's SafeSnap module executes proposals through Reality.eth's bonded answer oracle: an answer backed by at least ${bond} that no one outbids for ${questionTimeout} can push any transaction through the DAO multisig ${questionCooldown} later, unless the DAO multisig invalidates it first. ${arbitration}`,
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `the oracle quorum reports false vault balances, or the DAO multisig changes the oracle set, replaces the Keeper or registers its own contract as a vault, which can mint unbacked ${osETH} and burn anyone's.`,
        isCritical: true,
      },
      {
        category: 'Funds can lose value if',
        text: `the oracles set the ${osETH} reward rate above the real yield, or a vault that mints up to ${maxLtv} without liquidation takes a loss.`,
      },
      {
        category: 'Funds can be frozen if',
        text: `the oracles stop signing, since vault exit queues only advance with their updates, or the ${opsSafe} multisig publishes no positions to redeem and nobody buys queued ${osETH}.`,
      },
    ],
  },
}
