import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  STATE_CORRECTNESS,
  UPCOMING_RISK_VIEW,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zkfair')

export const zkfair: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkfair'),
  display: {
    name: 'ZKFair',
    slug: 'zkfair',
    description:
      'ZKFair is the first community Validium based on Polygon CDK and Celestia DA, championing fairness.',
    purpose: 'Universal',
    category: 'Validium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://zkfair.io/'],
      apps: ['https://wallet.zkfair.io/'],
      documentation: ['https://docs.zkfair.io/'],
      explorers: ['https://scan.zkfair.io/'],
      repositories: ['https://github.com/ZKFair'],
      socialMedia: ['https://twitter.com/ZK_fair'],
    },
    activityDataSource: 'Closed API',
    liveness: {
      explanation:
        'Polygon zkEVM is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. State updates are a three step process: first blocks are committed to L1, then they are proved, and then it is possible to execute them.',
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9cb4706e20A18E59a48ffa7616d700A3891e1861'),
        sinceTimestamp: new UnixTime(18810961),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
    },
    liveness: {
      duplicateData: [
        {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      ],
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1CbC08bf0D48b18F9f97796c61352b192d1850A5',
          ),
          selector: '0x5e9145c9',
          functionSignature:
            'function sequenceBatches((bytes,bytes32,uint64,uint64)[] batches,address l2Coinbase)',
          sinceTimestamp: new UnixTime(18810961),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1CbC08bf0D48b18F9f97796c61352b192d1850A5',
          ),
          selector: '0x2b0006fa',
          functionSignature:
            'function verifyBatchesTrustedAggregator(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] proof)',
          sinceTimestamp: new UnixTime(18810961),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1CbC08bf0D48b18F9f97796c61352b192d1850A5',
          ),
          selector: '0x621dd411',
          functionSignature:
            'function verifyBatches(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] calldata proof) ',
          sinceTimestamp: new UnixTime(18810961),
        },
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
    dataAvailability: DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
      },
    ],
  },
  contracts: CONTRACTS.EMPTY,
  milestones: [
    {
      name: 'ZKFair Mainnet is Live',
      link: 'https://twitter.com/ZKFCommunity/status/1737307444181869017',
      date: '2023-12-20T00:00:00Z',
      description: 'ZKFair launched.',
    },
  ],
}
