import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('etherfi')

const value = (contract: string, key: string): string =>
  String(discovery.getContractValue<string | number>(contract, key))

// basis points (1e4) -> percent string
const bps = (contract: string, key: string): string =>
  `${Number(discovery.getContractValue<number>(contract, key)) / 100}%`

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
// Total ETH (1 ETH initial deposit + top-up) each new validator is funded with.
const validatorSize = `${Number(
  discovery.getContractValueBigInt('LiquidityPool', 'validatorSizeWei') /
    10n ** 18n,
)} ETH`
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
// 18-decimals wei string -> whole ETH with thousands separators.
const wholeEth = (contract: string, key: string): string =>
  (
    BigInt(discovery.getContractValue<string>(contract, key)) /
    10n ** 18n
  ).toLocaleString('en-US')
const pooled = BigInt(value('LiquidityPool', 'getTotalPooledEther'))
const inLp = BigInt(value('LiquidityPool', 'totalValueInLp'))
const bufferPct = `${(Number((inLp * 10000n) / pooled) / 100).toFixed(2)}%`
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
const upgradeDelayDays =
  discovery.getContractValue<number>(UPGRADE_TIMELOCK, 'getMinDelay') / 86400
const operatingDelayDays =
  discovery.getContractValue<number>(OPERATING_TIMELOCK, 'getMinDelay') / 86400

export const etherfi: BaseProject = {
  id: ProjectId('etherfi'),
  slug: 'etherfi',
  name: 'ether.fi',
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
    description: `ether.fi is a liquid staking and restaking protocol. Users deposit ETH for ${value('eETH', 'symbol')} (rebasing) or its wrapper ${value('weETH', 'symbol')}, staked through whitelisted operators and restaked in EigenLayer, with an oracle committee setting the exchange rate.`,
    detailedDescription: readProjectMarkdown('etherfi', 'detailedDescription', {
      eethSymbol: value('eETH', 'symbol'),
      weethSymbol: value('weETH', 'symbol'),
      oracleQuorum,
      oracleMembers,
      maxPositiveRebase,
      acceptableRebaseApr,
      maxExitFee,
      validatorSize,
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
    tvl: { source: 'l2beat' },
    tokens: [
      {
        symbol: value('eETH', 'symbol'),
        name: 'ether.fi ETH',
        description:
          'Rebasing receipt for pooled and restaked ETH: balances follow the oracle report.',
      },
      {
        symbol: value('weETH', 'symbol'),
        name: 'Wrapped eETH',
        description:
          'Non-rebasing wrapper of eETH: a fixed amount whose ETH value rises with rewards.',
      },
    ],
    liquidStaking: {
      minting: {
        value: 'Permissionless',
        secondLine: 'gated by ether.fi ops',
        sentiment: 'good',
        description: `Anyone can deposit ETH for ${value('eETH', 'symbol')} with no cap or fee; ${value('weETH', 'symbol')} wraps it. Only ether.fi's operations team can send that ETH to validators, which withdraw to protocol EigenPods.`,
      },
      operators: {
        value: 'Whitelisted',
        secondLine: 'no bond',
        sentiment: 'warning',
        description: `Operators are whitelisted by the ${operationsSafe} Safe and post no bond. Holders share slashing losses, up to ${maxNegativeRebaseBps} bps per report. Stake is also restaked in EigenLayer, where extra slashing can cut principal.`,
      },
      backing: {
        value: 'EigenPods, stETH',
        secondLine: 'creds: EigenPod',
        sentiment: 'warning',
        description: `Validators withdraw to EigenPods, so most ETH sits in EigenLayer, which its own governance can upgrade. ${stethSharePct} of backing is stETH and ${bufferPct} is a liquid buffer.`,
      },
      exchangeRate: {
        value: `${oracleQuorum} of ${oracleMembers}`,
        secondLine: `~4h · ≤${maxPositiveRebase}`,
        sentiment: 'warning',
        description: `All ${oracleMembers} oracle members must agree on each report, every ${reportPeriod}. A report can raise the rate by at most ${maxPositiveRebase}. After ${staleOracleWindow} of silence, anyone can submit a report.`,
      },
      exit: {
        value: 'Oracle-gated',
        secondLine: '~1 day · pausable',
        sentiment: 'warning',
        description: `Withdrawal requests are finalized from oracle reports, at most ${maxFinalizedPerDay} ETH a day. Instant redemption from the buffer costs up to ${maxExitFee}. The ${operationsSafe} Safe can pause all exits.`,
      },
      upgrades: {
        value: '6/10 Safe',
        secondLine: `${upgradeDelayDays}d · no veto`,
        sentiment: 'warning',
        description: `A 6-of-10 Safe can change the code after a ${upgradeDelayDays}-day timelock. A separate ${operatingDelayDays}-day timelock tunes parameters within fixed limits. Holders have no veto.`,
      },
    },
  },
  externalDependencies: [
    {
      type: 'not-tracked',
      name: 'EigenLayer',
      icon: 'eigenlayer',
      description:
        "Holds the native stake of EigenPod-backed nodes: their validators' withdrawal credentials point at an EigenLayer EigenPod, so that ETH sits inside EigenLayer contracts. Its DelegationManager, EigenPodManager and StrategyManager are upgradeable by EigenLayer governance, and since the slashing release an AVS can slash delegated stake. Exits from these pods also wait out EigenLayer's roughly 14-day withdrawal delay. A node created without a pod is itself its validators' withdrawal address and requests exits directly through the EIP-7002 system contract, outside EigenLayer.",
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
