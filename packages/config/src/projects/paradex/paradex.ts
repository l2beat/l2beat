import {
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { formatExecutionDelay } from '../../common/formatDelays'
import { RISK_VIEW } from '../../common/riskView'
import { getStage } from '../../common/stages/getStage'
import { STATE_VALIDATION } from '../../common/stateValidation'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('paradex')

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'Paradex',
  'StarkWareProxy_upgradeDelay',
)

const escrowUSDCDelaySeconds = discovery.getContractValue<number>(
  'USDC Bridge',
  'StarkWareProxy_upgradeDelay',
)

const minDelay = Math.min(upgradeDelaySeconds, escrowUSDCDelaySeconds)
const finalizationPeriod = 0

function formatMaxTotalBalanceString(
  ticker: string,
  maxTotalBalance: number,
  decimals: number,
) {
  return `The current bridge cap is ${formatLargeNumber(
    maxTotalBalance / 10 ** decimals,
  )} ${ticker}.`
}

const escrowUSDCMaxTotalBalanceString = formatMaxTotalBalanceString(
  'USDC',
  discovery.getContractValue<number>('USDC Bridge', 'maxTotalBalance'),
  6,
)

export const paradex: ScalingProject = {
  type: 'layer2',
  id: ProjectId('paradex'),
  capability: 'universal',
  addedAt: UnixTime(1698756386), // 2023-10-31T12:46:26Z
  badges: [
    BADGES.VM.CairoVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Stack.SNStack,
    BADGES.Infra.SHARP,
  ],
  display: {
    name: 'Paradex',
    slug: 'paradex',
    stacks: ['SN Stack'],
    description:
      'Paradex is a high-performance crypto-derivatives exchange built on a Starknet Appchain.',
    purposes: ['Universal', 'Exchange'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://paradex.trade/'],
      bridges: ['https://app.paradex.trade', 'https://paradex.trade/stats'],
      documentation: ['https://docs.paradex.trade/'],
      repositories: ['https://github.com/tradeparadex'],
      socialMedia: [
        'https://twitter.com/tradeparadex',
        'https://discord.com/invite/paradex',
      ],
    },
    liveness: {
      explanation:
        'Paradex is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. Proofs are aggregated with other projects using SHARP and state updates have to refer to proved claims.',
    },
  },
  chainConfig: {
    name: 'paradex',
    chainId: undefined,
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'starknet',
        url: 'https://pathfinder.api.prod.paradex.trade/rpc/v0_7',
        callsPerMinute: 120,
      },
    ],
  },
  config: {
    activityConfig: {
      type: 'block',
    },
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3',
        ),
        tokens: ['USDC'],
        upgradableBy: [
          {
            name: 'USDC Escrow owner',
            delay: formatSeconds(escrowUSDCDelaySeconds),
          },
        ],
        description:
          'Paradex USDC Escrow.' + ' ' + escrowUSDCMaxTotalBalanceString,
      }),
    ],
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0xF338cad020D506e8e3d9B4854986E0EcE6C23640'),
        sequencers: [
          EthereumAddress('0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1636978914),
          untilTimestamp: UnixTime(1704729971),
          programHashes: [
            '3258367057337572248818716706664617507069572185152472699066582725377748079373',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1704729971),
          untilTimestamp: UnixTime(1706626427),
          programHashes: [
            '54878256403880350656938046611252303365750679698042371543935159963667935317',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          // Updated to this program hash in tx 0x7eb527c897e8449234ad770573a2a5ba3737e6b9014600c261741bc258849639
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1706626427),
          untilTimestamp: UnixTime(1710346919),
          programHashes: [
            '2479841346739966073527450029179698923866252973805981504232089731754042431018',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1710346919),
          untilTimestamp: UnixTime(1710764843),
          programHashes: [
            '109586309220455887239200613090920758778188956576212125550190099009305121410',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1710764843),
          untilTimestamp: UnixTime(1725811535),
          programHashes: [
            '3383082961563516565935611087683915026448707331436034043529592588079494402084',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1725811535),
          untilTimestamp: UnixTime(1744056299), // april 9 2025
          programHashes: [
            '853638403225561750106379562222782223909906501242604214771127703946595519856', // Starknet OS
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1725811535),
          untilTimestamp: UnixTime(1744056299), // april 9 2025
          programHashes: [
            '1161178844461337253856226043908368523817098764221830529880464854589141231910', // Aggregator
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1744056299),
          programHashes: [
            '2534935718742676028234156221136000178296467523045214874259117268197132196876', // Starknet OS
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1744056299),
          programHashes: [
            '273279642033703284306509103355536170486431195329675679055627933497997642494', // Aggregator
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xF338cad020D506e8e3d9B4854986E0EcE6C23640',
          ),
          selector: '0x77552641',
          functionSignature:
            'function updateState(uint256[] programOutput, uint256 onchainDataHash, uint256 onchainDataSize)',
          sinceTimestamp: UnixTime(1689850631),
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xF338cad020D506e8e3d9B4854986E0EcE6C23640',
          ),
          selector: '0xb72d42a1',
          functionSignature:
            'function updateStateKzgDA(uint256[] programOutput, bytes kzgProof)',
          sinceTimestamp: UnixTime(1710346919),
          untilTimestamp: UnixTime(1725811535),
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xF338cad020D506e8e3d9B4854986E0EcE6C23640',
          ),
          selector: '0x507ee528',
          functionSignature:
            'function updateStateKzgDA(uint256[] programOutput, bytes[] kzgProofs)',
          sinceTimestamp: UnixTime(1725811667),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: RISK_VIEW.EXIT_WINDOW(minDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://docs.paradex.trade/documentation/paradex-chain/node-setup',
    },
  ),
  stateDerivation: {
    nodeSoftware:
      'SN stack-compatible node software can be used, please find the Paradex-specific node setup guide [in their docs](https://docs.paradex.trade/documentation/paradex-chain/node-setup).The [Juno](https://github.com/NethermindEth/juno) node software can be used to reconstruct the L2 state entirely from L1. The feature has not been released yet, but can be found in this [PR](https://github.com/NethermindEth/juno/pull/1335).',
    compressionScheme:
      'Paradex uses [stateful compression since v0.13.4](https://docs.starknet.io/architecture-and-concepts/network-architecture/data-availability/#v0_13_4).',
    genesisState: 'There is no non-empty genesis state.',
    dataFormat:
      'The data format has been updated with different versions, and the full specification can be found [here](https://docs.starknet.io/architecture-and-concepts/network-architecture/data-availability/).',
  },
  stateValidation: {
    categories: [STATE_VALIDATION.VALIDITY_PROOFS],
  },
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKNET_ON_CHAIN(true),
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          title: 'Censorship resistance of Starknet - Forum Discussion',
          url: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Perpetual Options Launch',
      url: 'https://x.com/tradeparadex/status/1907041207177613610',
      date: '2025-04-01T00:00:00Z',
      description: 'Paradex opens perpetual options trading to all users.',
      type: 'general',
    },
    {
      title: 'Vaults Launched',
      url: 'https://x.com/tradeparadex/status/1843550172443512998',
      date: '2024-10-08T00:00:00Z',
      description:
        'Paradex launches Vaults, the future of on-chain investment management.',
      type: 'general',
    },
    {
      title: 'Paradex exits Open Beta',
      url: 'https://x.com/tradeparadex/status/1854537396714651707',
      date: '2024-11-07T00:00:00Z',
      description: 'Paradex launches XP Warzone Season 1 and exits Open Beta.',
      type: 'general',
    },
    {
      title: 'Paradex starts using blobs',
      url: 'https://twitter.com/tradeparadex/status/1768306190596153799',
      date: '2024-03-26T00:00:00Z',
      description: 'Paradex starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Open Beta Mainnet Launch',
      url: 'https://twitter.com/tradeparadex',
      date: '2023-10-01T00:00:00.00Z',
      description: 'Paradex launches Open Beta on Mainnet.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
