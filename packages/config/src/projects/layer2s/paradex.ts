import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatLargeNumber,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ESCROW } from '../../common'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { formatExecutionDelay } from '../../common/formatDelays'
import { RISK_VIEW } from '../../common/riskView'
import { STATE_CORRECTNESS } from '../../common/stateCorrectness'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../../discovery/starkware'
import type { Layer2 } from '../../types'
import { delayDescriptionFromSeconds } from '../../utils/delayDescription'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('paradex')
const verifierAddress = discovery.getAddressFromValue('Paradex', 'verifier')

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

export const paradex: Layer2 = {
  type: 'layer2',
  id: ProjectId('paradex'),
  capability: 'universal',
  addedAt: new UnixTime(1698756386), // 2023-10-31T12:46:26Z
  badges: [
    Badge.VM.CairoVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.SNStack,
    Badge.Infra.SHARP,
  ],
  display: {
    name: 'Paradex',
    slug: 'paradex',
    stack: 'SN Stack',
    description:
      'Paradex is a high-performance crypto-derivatives exchange built on a Starknet Appchain.',
    purposes: ['Universal', 'Exchange'],
    category: 'ZK Rollup',

    links: {
      websites: ['https://paradex.trade/'],
      apps: ['https://app.paradex.trade', 'https://paradex.trade/stats'],
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
    finality: {
      finalizationPeriod,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3'),
        tokens: ['USDC'],
        ...ESCROW.CANONICAL_EXTERNAL,
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
        inbox: '0xF338cad020D506e8e3d9B4854986E0EcE6C23640',
        sequencers: ['0xC70ae19B5FeAA5c19f576e621d2bad9771864fe2'],
      },
    ],
    trackedTxs: [
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1636978914),
          untilTimestamp: new UnixTime(1704729971),
          programHashes: [
            '3258367057337572248818716706664617507069572185152472699066582725377748079373',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1704729971),
          untilTimestamp: new UnixTime(1706626427),
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
          sinceTimestamp: new UnixTime(1706626427),
          untilTimestamp: new UnixTime(1710346919),
          programHashes: [
            '2479841346739966073527450029179698923866252973805981504232089731754042431018',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1710346919),
          untilTimestamp: new UnixTime(1710764843),
          programHashes: [
            '109586309220455887239200613090920758778188956576212125550190099009305121410',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1710764843),
          untilTimestamp: new UnixTime(1725811535),
          programHashes: [
            '3383082961563516565935611087683915026448707331436034043529592588079494402084',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1725811535),
          programHashes: [
            '853638403225561750106379562222782223909906501242604214771127703946595519856', // Starknet OS
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1725811535),
          programHashes: [
            '1161178844461337253856226043908368523817098764221830529880464854589141231910', // Aggregator
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
          sinceTimestamp: new UnixTime(1689850631),
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
          sinceTimestamp: new UnixTime(1710346919),
          untilTimestamp: new UnixTime(1725811535),
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
          sinceTimestamp: new UnixTime(1725811667),
        },
      },
    ],
    finality: {
      lag: 0,
      type: 'Starknet',
      minTimestamp: new UnixTime(1725811667),
      stateUpdate: 'disabled',
    },
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
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: false,
    },
    stage1: {
      principle: false,
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
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
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('Paradex', {
          description:
            'Paradex contract received verified state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 messages.',
          upgradableBy: [
            {
              name: 'Paradex owner',
              delay: upgradeDelaySeconds
                ? formatSeconds(upgradeDelaySeconds)
                : 'no',
            },
          ],
        }),
        ...getSHARPVerifierContracts(discovery, verifierAddress),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Paradex owner',
          getProxyGovernance(discovery, 'Paradex'),
          'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge and potentially allowing fraudulent state to be posted. ' +
            delayDescriptionFromSeconds(upgradeDelaySeconds),
        ),
        discovery.getPermissionDetails(
          'Paradex Implementation Governors',
          discovery.getPermissionedAccounts('Paradex', 'governors'),
          'The governors are responsible for: appointing operators, changing program hash, changing config hash, changing message cancellation delay. There is no delay on governor actions.',
        ),
        ...getSHARPVerifierGovernors(discovery, verifierAddress),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('Paradex', 'operators'),
          'Allowed to post state updates. When the operator is down the state cannot be updated.',
        ),
        discovery.getPermissionDetails(
          'USDC Escrow owner',
          getProxyGovernance(discovery, 'USDC Bridge'),
          'Can upgrade implementation of the USDC Escrow, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromSeconds(escrowUSDCDelaySeconds),
        ),
      ],
    },
  },
  milestones: [
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
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
