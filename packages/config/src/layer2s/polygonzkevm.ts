import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, makeBridgeCompatible, TECHNOLOGY, RISK_VIEW, STATE_CORRECTNESS, DATA_AVAILABILITY, OPERATOR, FORCE_TRANSACTIONS, EXITS } from './common'
import { Layer2 } from './types'

export const polygonzkevm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    description:
      'Polygon zkEVM is a decentralized Ethereum Layer 2 scalability solution that uses cryptographic zero-knowledge proofs to offer validity and quick finality to off-chain transaction computation, also known as a ZK-Rollup. Polygon zkEVM is equivalent with the Ethereum Virtual Machine, this means that most of the existing smart contracts, developer tools, and wallets work seamlessly. Polygon zkEVM harnesses the power of ZK proofs to reduce transaction cost and increase throughput, all while inheriting the security of Ethereum L1.',
    purpose: 'Universal',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://bridge.zkevm-rpc.com'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: ['https://zkevm.polygonscan.com/','https://explorer.mainnet.zkevm-test.net/'],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe'),
        sinceTimestamp: new UnixTime(1679653127),
        tokens: '*',
      }
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://zkevm-rpc.com',
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADE_DELAY('10 days'),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: {
      value: 'Propose blocks',
      description:
        'Anyone can validate batches that has not been proven on the last 5-days',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),

  technology: {
    ...TECHNOLOGY.UPCOMING,
    provider: 'Polygon',
    category: 'ZK Rollup',
    stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
    dataAvailability: DATA_AVAILABILITY.ON_CHAIN,
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.NO_MECHANISM,
    exitMechanisms: EXITS.REGULAR('zk', 'merkle proof'),
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Polygon zkEVM is pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on Polygon zkEVM. Currently we are missing some pre-compiled contracts like: blake, pairings, sha256 and expmod.',
      risks: [],
    },
  },
  
  contracts: CONTRACTS.EMPTY,
}
