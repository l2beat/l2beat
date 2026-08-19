import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DA_LAYERS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('soon')

const batchInbox = ChainSpecificAddress.address(
  discovery.getContractValue('SystemConfig', 'batchInbox'),
)
const batcher = ChainSpecificAddress.address(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)
const l2OutputOracle = discovery.getContract('L2OutputOracle')
const oldBatcher = EthereumAddress('0xae0Fbdd7CEC6036F3364000eE6d2a60BdAbb10c6')
const batcherRotationTimestamp = UnixTime(1785309419)
const portalImplementation = ChainSpecificAddress.address(
  discovery.getContractValue('OptimismPortal', '$implementation'),
)

export const soon: ScalingProject = opStackL2({
  addedAt: UnixTime(1726836904), // 2024-09-20T12:55:04Z
  discovery,
  daProvider: EIGENDA_DA_PROVIDER(false, DA_LAYERS.ETH_BLOBS),
  additionalBadges: [BADGES.VM.SolanaVM],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],

  display: {
    name: 'Soon Alpha Mainnet',
    shortName: 'Soon',
    slug: 'soon',
    description:
      "SOON is a Layer 2 chain built on top of the SOON Stack. It innovates with a Decoupled SVM that separates Solana's execution (needed for the SOON SVM) from its consensus (not needed since SOON settles on Ethereum), yielding performance and flexibility improvements.",
    links: {
      websites: ['https://soo.network/'],
      bridges: ['https://bridge.mainnet.soo.network/home'],
      documentation: ['https://docs.soo.network/introduction/what-is-soon'],
      explorers: ['https://explorer.soo.network/'],
      repositories: ['https://github.com/soonlabs'],
      socialMedia: [
        'https://x.com/soon_svm',
        'https://discord.gg/soon-svm',
        'https://medium.com/@soon_SVM',
      ],
    },
  },
  usingAltVm: true,
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: oldBatcher,
        to: batchInbox,
        sinceTimestamp: UnixTime(1696566432),
        untilTimestamp: batcherRotationTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: batcher,
        to: batchInbox,
        sinceTimestamp: batcherRotationTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(l2OutputOracle.address),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(l2OutputOracle.sinceTimestamp ?? 1696566432),
      },
    },
  ],
  nonTemplateTechnology: {
    dataAvailability: {
      name: 'Data is posted to EigenDA',
      description:
        'Transactions roots are posted onchain and the full data is posted on EigenDA.  Since the ServiceManager bridge is not used, availability of the data is not verified against EigenDA operators, meaning that the Sequencer can single-handedly publish unavailable commitments. If EigenDA becomes unavailable, the sequencer falls back to Ethereum.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable transaction root.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the data is not available on the external provider.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'EigenDA Docs - Overview',
          url: 'https://docs.eigenda.xyz/overview',
        },
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        {
          title: 'BatchInbox - address',
          url: `https://etherscan.io/address/${batchInbox}#code`,
        },
        {
          title:
            'OptimismPortal.sol - source code, depositTransaction function',
          url: `https://etherscan.io/address/${portalImplementation}#code`,
        },
      ],
    },
    otherConsiderations: [
      {
        name: 'Solana Virtual Machine is supported',
        description:
          'OP stack chains are usually pursuing the EVM Equivalence model. But Soon implements the rust-based Solana virtual machine (SVM) which uses parallel processing.',
        risks: [],
        references: [
          {
            title: 'Soon Docs - Decoupled SVM',
            url: 'https://docs.soo.network/introduction/decoupled-svm',
          },
        ],
      },
    ],
  },
  activityConfig: {
    type: 'slot',
    startSlot: 1,
  },
  chainConfig: {
    name: 'soon',
    chainId: undefined,
    apis: [
      {
        type: 'svm-rpc',
        url: 'https://rpc.mainnet.soo.network/rpc',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1696566432), // TODO: update
  isNodeAvailable: false,
  daTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21541468, // SystemConfig deployment
      inbox: batchInbox,
      sequencers: [oldBatcher, batcher],
    },
    {
      type: 'eigen-da',
      customerId: '0x52ebeea8a7dcaaa17ee398b9f9b01dfa64db63ae',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1735822800),
    },
    {
      type: 'eigen-da',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1753412400),
      customerId: '0x420ad2641f22bf6f180c52d0b0566e7ec701c45a',
    },
    {
      type: 'eigen-da',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1786951919),
      customerId: '0xcb3a6380c666ff97f474e11fd41519c320b7a276',
    },
  ],
})
