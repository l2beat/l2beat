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
