import { NEW_CRYPTOGRAPHY, RISK_VIEW } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('astarzkevm')

const membersCountDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'AstarValidiumDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'AstarValidiumEtrog',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

export const astarzkevm: Layer2 = polygonCDKStack({
  daProvider: {
    name: 'DAC',
    bridge: {
      type: 'DAC Members',
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: membersCountDAC,
        requiredSignatures: requiredSignaturesDAC,
      }),
      sources: [
        {
          contract: 'AstarValidiumEtrog',
          references: [
            'https://etherscan.io/address/0x9cf80f7eB1C76ec5AE7A88b417e373449b73ac30',
          ],
        },
      ],
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted on-chain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'AstarValidiumEtrog.sol - Etherscan source code, sequenceBatches function',
          href: 'https://etherscan.io/address/0x519E42c24163192Dca44CD3fBDCEBF6be9130987',
        },
      ],
    },
  },
  rollupManagerContract: discovery.getContract('PolygonRollupManager'),
  rollupModuleContract: discovery.getContract('AstarValidiumEtrog'),
  rollupVerifierContract: discovery.getContract('AstarVerifier'),
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is a Validium that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    purposes: ['Universal'],
    headerWarning:
      'Astar zkEVM is using AggLayer, meaning it shares the TVL escrow contracts with Polygon zkEVM and other connected chains. For now, you can check its TVL [here](https://dune.com/hashed_official/astar-zkevm). We have not verified it so proceed with caution.',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/build/zkEVM/'],
      explorers: ['https://astar-zkevm.explorer.startale.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://discord.com/invite/astarnetwork',
        'https://youtube.com/@AstarNetwork',
        'https://t.me/PlasmOfficial',
      ],
    },
  },
  discovery,
  isForcedBatchDisallowed,
  nonTemplateEscrows: [],
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the AstarValidiumEtrog contract.',
  },
  nonTemplateContracts: [
    discovery.getContractDetails('AstarValidiumDAC', {
      description:
        'Validium committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
    }),
  ],
  milestones: [
    {
      name: 'Astar zkEVM Launch',
      link: 'https://polygon.technology/blog/astar-zkevm-built-with-polygon-cdk-connects-to-agglayer-and-taps-unified-liquidity-with-polygon-zkevm',
      date: '2024-03-06',
      description:
        'Astar Network launched Astar zkEVM, integrated with Polygon AggLayer.',
    },
  ],
  knowledgeNuggets: [],
})
