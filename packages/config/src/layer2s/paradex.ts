import {
  EthereumAddress,
  formatLargeNumberShared,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  EXITS,
  makeBridgeCompatible,
  makeDataAvailabilityConfig,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { FORCE_TRANSACTIONS } from '../common/forceTransactions'
import { RISK_VIEW } from '../common/riskView'
import { STATE_CORRECTNESS } from '../common/stateCorrectness'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('paradex')
const verifierAddress = discovery.getAddressFromValue('Paradex', 'verifier')

const upgradeDelaySeconds = discovery.getContractUpgradeabilityParam(
  'Paradex',
  'upgradeDelay',
)

const escrowUSDCDelaySeconds = discovery.getContractUpgradeabilityParam(
  'USDC Bridge',
  'upgradeDelay',
)

const minDelay = Math.min(upgradeDelaySeconds, escrowUSDCDelaySeconds)

function formatMaxTotalBalanceString(
  ticker: string,
  maxTotalBalance: number,
  decimals: number,
) {
  return `The current bridge cap is ${formatLargeNumberShared(
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
  display: {
    name: 'Paradex',
    slug: 'paradex',
    provider: 'Starknet',
    description:
      'Paradex is a high-performance crypto-derivatives exchange built on a Starknet Appchain.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',

    links: {
      websites: ['https://paradex.trade/'],
      apps: ['https://app.paradex.trade'],
      documentation: ['https://docs.paradex.trade/'],
      explorers: [],
      repositories: ['https://github.com/tradeparadex'],
      socialMedia: ['https://twitter.com/tradeparadex'],
    },
    liveness: {
      explanation:
        'Paradex is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. Proofs are aggregated with other projects using SHARP and state updates have to refer to proved claims.',
    },
    finality: {
      finalizationPeriod: 0,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3'),
        tokens: ['USDC'],
        upgradableBy: ['USDC Escrow owner'],
        upgradeDelay: formatSeconds(escrowUSDCDelaySeconds),
        description:
          'Paradex USDC Escrow.' + ' ' + escrowUSDCMaxTotalBalanceString,
      }),
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
          programHashes: [
            '2479841346739966073527450029179698923866252973805981504232089731754042431018',
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
    ],
    finality: 'coming soon',
  },
  dataAvailability: makeDataAvailabilityConfig({
    type: 'On chain',
    layer: 'Ethereum (calldata)',
    mode: 'State diffs',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L218',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L213',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(minDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'Paradex',
          references: [
            'https://etherscan.io/address/0xA964D693cd45FCBe4303524E0EFe0988cfF5ed08#code#F1#L199',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.CANONICAL_USDC,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: false,
    },
    stage1: {
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
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKNET_ON_CHAIN,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          text: 'Censorship resistance of Starknet - Forum Discussion',
          href: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('Paradex', {
        description:
          'Paradex contract received verified state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 messages.',
        upgradeDelay: upgradeDelaySeconds
          ? formatSeconds(upgradeDelaySeconds)
          : 'No delay',
        upgradableBy: ['Paradex owner'],
      }),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
  },
  permissions: [
    {
      name: 'Paradex owner',
      accounts: getProxyGovernance(discovery, 'Paradex'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge and potentially allowing fraudulent state to be posted. ' +
        delayDescriptionFromSeconds(upgradeDelaySeconds),
    },
    {
      name: 'Paradex Implementation Governors',
      accounts: discovery.getPermissionedAccounts('Paradex', 'governors'),
      description:
        'The governors are responsible for: appointing operators, changing program hash, changing config hash, changing message cancellation delay. There is no delay on governor actions.',
    },
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('Paradex', 'operators'),
      description:
        'Allowed to post state updates. When the operator is down the state cannot be updated.',
    },
    {
      name: 'USDC Escrow owner',
      accounts: getProxyGovernance(discovery, 'USDC Bridge'),
      description:
        'Can upgrade implementation of the USDC Escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowUSDCDelaySeconds),
    },
  ],
  milestones: [
    {
      name: 'Open Beta Mainnet Launch',
      link: 'https://twitter.com/tradeparadex',
      date: '2023-10-01T00:00:00.00Z',
      description: 'Paradex launches Open Beta on Mainnet.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
