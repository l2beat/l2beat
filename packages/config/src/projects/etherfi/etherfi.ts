import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('etherfi')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

// 18-decimals wei string -> whole ETH with thousands separators.
const wholeEth = (contract: string, key: string): string =>
  (
    BigInt(discovery.getContractValue<string>(contract, key)) /
    10n ** 18n
  ).toLocaleString('en-US')

// basis points (1e4) -> percent string
const bps = (contract: string, key: string): string =>
  `${Number(discovery.getContractValue<number>(contract, key)) / 100}%`

// weETH:ETH rate, 1e18 scaled
const weethRate = Number.parseFloat(
  (Number(BigInt(value('weETH', 'getRate'))) / 1e18).toFixed(6),
).toString()

const pooled = BigInt(value('LiquidityPool', 'getTotalPooledEther'))
const inLp = BigInt(value('LiquidityPool', 'totalValueInLp'))
const bufferPct = `${(Number((inLp * 10000n) / pooled) / 100).toFixed(2)}%`

// Two OZ TimelockControllers share the name "EtherFiTimelock"; read by address.
const UPGRADE_TIMELOCK = 'eth:0x9f26d4C958fD811A1F59B01B86Be7dFFc9d20761'
const OPERATING_TIMELOCK = 'eth:0xcD425f44758a08BaAB3C4908f3e3dE5776e45d7a'
const upgradeDelay = formatSeconds(
  discovery.getContractValue<number>(UPGRADE_TIMELOCK, 'getMinDelay'),
  { fullUnit: true },
)
const operatingDelay = formatSeconds(
  discovery.getContractValue<number>(OPERATING_TIMELOCK, 'getMinDelay'),
  { fullUnit: true },
)

const oracleQuorum = value('EtherFiOracle', 'quorumSize')
const oracleMembers = value('EtherFiOracle', 'numActiveCommitteeMembers')
const acceptableRebaseApr = bps('EtherFiAdmin', 'acceptableRebaseAprInBps')
const maxPositiveRebase = bps('LiquidityPool', 'MAX_POSITIVE_REBASE_BPS')
const maxExitFee = bps('EtherFiRedemptionManager', 'maxExitFeeInBps')
// Reports wait postReportWaitTimeInSlots slots (12s each) past consensus before
// EtherFiAdmin can execute; the operating multisig can unpublish them until then.
const reportWaitDelay = formatSeconds(
  discovery.getContractValue<number>(
    'EtherFiAdmin',
    'postReportWaitTimeInSlots',
  ) * 12,
  { fullUnit: true },
)

// --- Liquid staking risk comparison (DeFi summary tab) ---
const OPERATIONS_SAFE = 'eth:0x2aCA71020De61bb532008049e1Bd41E451aE8AdC'
const operationsSafe = discovery.getMultisigStats(OPERATIONS_SAFE)
const reportPeriod = formatSeconds(
  discovery.getContractValue<number>('EtherFiOracle', 'reportPeriodSlot') * 12,
  { fullUnit: true },
)
const maxNegativeRebaseBps = value(
  'EtherFiAdmin',
  'effectiveMaxNegativeRebaseBps',
)
const staleOracleWindow = formatSeconds(
  discovery.getContractValue<number>(
    'EtherFiAdmin',
    'staleOracleReportBlockWindow',
  ) * 12,
  { fullUnit: true },
)
const maxFinalizedPerDay = wholeEth(
  'EtherFiAdmin',
  'maxFinalizedWithdrawalAmountPerDay',
)
const stethSharePct = `${(
  Number(
    (BigInt(value('EtherFiRestaker', 'getTotalPooledEther')) * 10000n) / pooled,
  ) / 100
).toFixed(1)}%`
const whitelistEnabled = discovery.getContractValue<boolean>(
  'AuctionManager',
  'whitelistEnabled',
)
const minBidEth = Number(BigInt(value('AuctionManager', 'minBidAmount'))) / 1e18
const maxBidEth = Number(BigInt(value('AuctionManager', 'maxBidAmount'))) / 1e18
const upgradeDelayDays =
  discovery.getContractValue<number>(UPGRADE_TIMELOCK, 'getMinDelay') / 86400
const operatingDelayDays =
  discovery.getContractValue<number>(OPERATING_TIMELOCK, 'getMinDelay') / 86400
const eigenLayerDelayDays =
  (discovery.getContractValue<number>(
    'EtherFiNode',
    'EIGENLAYER_WITHDRAWAL_DELAY_BLOCKS',
  ) *
    12) /
  86400

export const etherfi: BaseProject = {
  id: ProjectId('etherfi'),
  slug: 'etherfi',
  name: 'ether.fi',
  shortName: 'weETH',
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
    description: `ether.fi is a liquid staking and restaking protocol. Deposit ETH for ${value('eETH', 'symbol')} (rebasing) or ${value('weETH', 'symbol')} (${weethRate} ETH each), and the pool stakes it both through ether.fi's own permissioned operators and through third-party liquid staking tokens it accepts, with restaking in EigenLayer. A ${oracleQuorum}-of-${oracleMembers} committee sets the exchange rate under hard caps of at most ${maxPositiveRebase} per report. To exit, holders burn ${value('eETH', 'symbol')} for a withdrawal NFT the oracle must finalize, or swap instantly through a buffer for a fee up to ${maxExitFee}, though only ${bufferPct} of the ${wholeEth('LiquidityPool', 'getTotalPooledEther')} ETH pooled is instantly liquid. Upgrades and roles sit behind a ${upgradeDelay} timelock, with multisigs for day-to-day pausing and parameters.`,
    detailedDescription: readProjectMarkdown('etherfi', 'detailedDescription', {
      eethSymbol: value('eETH', 'symbol'),
      weethSymbol: value('weETH', 'symbol'),
      weethRate,
      bufferPct,
      oracleQuorum,
      oracleMembers,
      maxPositiveRebase,
      acceptableRebaseApr,
      maxExitFee,
      reportWaitDelay,
      upgradeDelay,
      operatingDelay,
    }),
    links: {
      websites: ['https://ether.fi/'],
      documentation: ['https://etherfi.gitbook.io/etherfi'],
      repositories: ['https://github.com/etherfi-protocol/smart-contracts'],
      socialMedia: ['https://x.com/ether_fi'],
    },
    references: [
      {
        title: 'Deployed Contracts — ether.fi docs',
        url: 'https://etherfi.gitbook.io/etherfi/developers/contracts-and-integrations/deployed-contracts',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Liquid Staking',
    liquidStaking: {
      token: `${value('eETH', 'symbol')}, ${value('weETH', 'symbol')}`,
      minting: {
        value: 'Permissionless',
        secondLine: 'gated by ether.fi ops',
        sentiment: 'good',
        description: `Anyone can deposit ETH for ${value('eETH', 'symbol')} with no cap or fee; the Liquifier also mints against stETH. Staking needs ether.fi's operations roles: a spawner registered via the ${operatingDelayDays}-day timelock registers keys for a whitelisted operator and the oracle-operations role (an EOA and the ${operationsSafe} Safe) funds each validator, with credentials hard-coded to a protocol EigenPod. ${value('weETH', 'symbol')} wraps ${value('eETH', 'symbol')} shares.`,
      },
      operators: {
        value: 'Whitelisted',
        secondLine: 'no bond',
        sentiment: 'warning',
        description: `Operators are whitelisted by the ${operationsSafe} Safe (whitelist ${whitelistEnabled ? 'on' : 'off'}); bids (${minBidEth} to ${maxBidEth} ETH) go to the treasury, not a loss bond. Slashing is socialised via the rebase, capped at ${maxNegativeRebaseBps} bps per report; native stake is also restaked in EigenLayer, where AVS slashing can cut principal.`,
      },
      backing: {
        value: 'EigenPods, stETH',
        secondLine: 'creds: EigenPod',
        sentiment: 'warning',
        description: `0x02 credentials point at EigenPods owned by EtherFiNode contracts, so the ETH sits in EigenLayer (upgradeable by its governance, ${eigenLayerDelayDays}-day withdrawal delay). ${stethSharePct} of backing is stETH in EtherFiRestaker; ${bufferPct} is in the liquid buffer.`,
      },
      exchangeRate: {
        value: `${oracleQuorum} of ${oracleMembers}`,
        secondLine: `~4h · ≤${maxPositiveRebase}`,
        sentiment: 'warning',
        description: `All ${oracleMembers} members must submit an identical report every ${reportPeriod}; EtherFiAdmin applies it after ${reportWaitDelay} (cancellable by the operating multisig) within caps of +${maxPositiveRebase} per report, ${acceptableRebaseApr} APR and −${maxNegativeRebaseBps} bps. A permissionless fallback opens after ${staleOracleWindow} of silence.`,
      },
      exit: {
        value: 'Oracle-gated',
        secondLine: '~1 day · pausable',
        sentiment: 'warning',
        description: `Burn ${value('eETH', 'symbol')} for a WithdrawRequestNFT finalized from oracle reports (at most ${maxFinalizedPerDay} ETH a day), claimed at the lower of request and finalization rate; a committee finalizing nothing stalls the queue until ${staleOracleWindow} of silence. Instant redemption pays from the buffer for up to ${maxExitFee}; the ${operationsSafe} Safe can pause everything.`,
      },
      upgrades: {
        value: '6/10 Safe',
        secondLine: `${upgradeDelayDays}d · no veto`,
        sentiment: 'warning',
        description: `Upgrades go only through the ${upgradeDelayDays}-day Upgrade Timelock, proposed by a 6-of-10 Safe, which also owns the RoleRegistry (role grants take ${upgradeDelayDays} days). A ${operatingDelayDays}-day Operating Timelock (${operationsSafe} Safe) tunes parameters within immutable ceilings. Holders have no veto.`,
      },
    },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'EigenLayer',
      icon: 'eigenlayer',
      description:
        "Holds the native stake. Every validator's withdrawal credentials point at an EigenLayer EigenPod, so ether.fi's own ETH sits inside EigenLayer contracts. Its DelegationManager, EigenPodManager and StrategyManager are upgradeable by EigenLayer governance, and since the slashing release an AVS can slash delegated stake. Exits also wait out EigenLayer's roughly 14-day withdrawal delay.",
    },
    {
      type: 'tracked',
      projectId: ProjectId('lido'),
      description:
        'About a quarter of the backing is stETH taken through the Liquifier and held by EtherFiRestaker rather than native ETH. A stETH depeg or a Lido failure directly impairs that share of eETH.',
    },
    {
      type: 'not-tracked',
      name: 'LayerZero',
      icon: 'layerzero',
      description:
        "weETH crosses chains as a LayerZero OFT. The mainnet lock-box holds ~110k weETH, and an L1 sync pool anticipatorily mints weETH against a dummy placeholder when a LayerZero message reports an L2 deposit, before the bridged ETH arrives (live unbacked ~45 weETH). A compromise of the LayerZero endpoint or its verifiers could forge inbound messages to unlock real weETH from the lock-box or mint against shared backing, and a messaging halt would strand cross-chain holders. Cross-chain integrity depends on LayerZero, bounded by the lock-box balance and the dummy token's Liquifier cap.",
    },
  ],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
