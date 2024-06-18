import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('lzoftv2')
const enaExecutor = EthereumAddress(
  (
    discovery.getContractValue('SendUln302', 'defaultExecutor_ENA') as [
      number,
      string,
    ]
  )[1],
)

export const lzoftv2: Bridge = {
  type: 'bridge',
  id: ProjectId('lzoftv2'),
  display: {
    name: 'OFT (LayerZero v2)',
    slug: 'lzoftv2',
    warning:
      'The security parameters of each Omnichain Fungible Token must be individually assessed, and can be changed by their developers.',
    category: 'Token Bridge',
    links: {
      websites: ['https://layerzero.network/'],
      repositories: [
        'https://github.com/LayerZero-Labs/',
        'https://github.com/stargate-protocol',
      ],
      documentation: [
        'https://docs.layerzero.network/v2/developers/evm/oft/quickstart',
      ],
      socialMedia: ['https://x.com/LayerZero_Labs'],
    },
    description:
      'This page gathers significant Omnichain Fungible Tokens (OFTs) built on top of LayerZero v2 AMB protocol.',
    detailedDescription:
      'Risk associated with using any OFT varies, depending on the technological decisions ([OApp configuration and security stack](https://docs.layerzero.network/v2/developers/evm/configuration/default-config)) made by the developers.\
       LayerZero as a framework to build omnichain application does not provide any base security as applications can define their own security settings,\
       however applications and tokens choosing the default security settings will leverage security provided by the current default Verifiers and Executor.\
       Default settings are managed by LayerZero team.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The LayerZero message protocol is used. If all preconfigured verifiers agree on a message, it is considered verified and can be executed by a permissioned Executor at the destination.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Omnichain tokens can be individually upgradable and their security assumptions must be individually assessed for each token contract / OApp.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: [
      'Ethereum',
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Arbitrum',
      'Optimism',
      'Fantom',
      'DFK',
      'Harmony',
      'Dexalot Subnet',
      'Celo',
      'Moonbeam',
      'Fuse',
      'Gnosis',
      'DOS Chain',
      'Klaytn',
      'Metis',
      'Core Blockchain',
      'OKXChain',
      'Polygon zkEVM',
      'Canto',
      'zkSync Era',
      'Moonriver',
      'Solana',
      'Tenet',
      'Arbitrum Nova',
      'Meter',
      'Kava',
      'Mantle',
      'Hubble',
      'Linea',
      'Base',
      'Zora',
      'Viction',
      'Loot',
      'Merit Circle',
      'TelosEVM',
      'opBNB',
      'Astar',
      'Aurora',
      'Conflux eSpace',
      'Orderly',
      'Scroll',
      'Horizen EON',
      'XPLA',
      'Manta',
      'Shimmer',
      'Injective',
      'Rari Chain',
      'Xai',
      're.al',
      'Tiltyard',
      'Blast',
      'Fraxtal',
      'Astar zkEVM',
      'Mode',
      'Masa',
      'Homeverse',
      'Merlin',
      'Degen',
      'Skale',
      'Xlayer',
      'Sanko',
      'Bob',
      'Sei',
      'EBI',
      'Cyber',
      'Iota',
      'Japan Open Chain',
      'Taiko',
      'Xchain',
      'Etherlink',
      'Tron',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `Omnichain Fungible Tokens (OFTs) are tokenized Token Bridges. Apart from the OFT standard provided by LayerZero, which extends the ERC-20 standard, the OFT implementation details vary widely. 
        
        The common interface of OFTs handles crosschain messaging through the LayerZero arbitrary message bridge (AMB). Each OFT is a LayerZero OApp and can be configured to use custom security stacks when interacting with the AMB.
        Among these OApp configuration parameters are the DVN(s) (who will read and verify the interchain messages), the executor (who will deliver and execute the transaction on the destination chain), and the minimum block confirmations needed. 
        Additionally, the OFT owner can often use other admin functions on the OFT contract that are specific to the ERC-20 implementation (similar to other ERC-20 tokens, like arbitrary minting or pausing functions) and not related to LayerZero.
        
        OFTs can be either natively multichain or they can use an adapter. Native OFTs are burned at their origin and minted at their destination when bridging. 
        Adapter OFTs have a main chain, where they are locked in an adapter escrow. This mints a 'native' OFT version of the locked token that can then be bridged on all chains by burn-minting. 
        To receive back the original locked token, a user would have to return to the main chain and unlock it from the adapter escrow.`,
      risks: [],
      references: [],
    },
    validation: {
      name: 'Custom Verifiers',
      description:
        'Each crosschain transaction is emitted on the origin chain and must be picked up and verified by preconfigured verifiers (LayerZero calls these DVNs). If they agree on a message, it is considered verified and can be executed by a permissioned Executor at the destination.',
      references: [
        {
          text: 'LayerZero security model analysis',
          href: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracles or relayers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'omnichain token owner changes Oracle/Relayer pair for their own.',
          isCritical: true,
        },
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x58538e6A46E07434d7E7375Bc268D3cb839C0133'),
        tokens: ['ENA'],
        description: 'OFT adapter escrow for ENA on Ethereum.',
      }),
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'EndpointV2',
        'The central Endpoint contract for LayerZero v2 on Ethereum. OApps like OFT adapters or token contracts register with this Endpoint to define their send and receive libraries and LayerZero-related configurations.',
      ),
      discovery.getContractDetails(
        'SendUln302',
        'The default send library for the LayerZero EndpointV2. This contract defines a framework and configuration options for sending messages across the LayerZero Arbitrary Message Bridge (AMB). New libraries can be added by the LayerZero Multisig. This contract accumulates fees configured by the OApp owners.',
      ),
      discovery.getContractDetails(
        'ReceiveUln302',
        'The default receive library for the LayerZero EndpointV2. This contract defines a framework and configuration options for receiving messages across the LayerZero Arbitrary Message Bridge (AMB). New libraries can be added by the LayerZero Multisig.',
      ),
      discovery.getContractDetails(
        'LayerZeroDVN',
        'The LayerZero Verifier delivers their verified messages through this contract. It is one of the default DVNs configured in the LayerZero EndpointV2.',
      ),
      discovery.getContractDetails(
        'GoogleCloudDVN',
        'The GoogleCloud Verifier delivers their verified messages through this contract. It is one of the default DVNs configured in the LayerZero EndpointV2.',
      ),
      discovery.getContractDetails(
        'PolyhedraDVN',
        'The Polyhedra Verifier delivers their verified messages through this contract. It is one of the default DVNs configured in the LayerZero EndpointV2.',
      ),
      discovery.getContractDetails(
        'Treasury',
        'Manages fees and fee recipients for registered OApps. Fees accumulate in the sendLib and OApp owners can withdraw them.',
      ),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'LayerZero Multisig',
      'The owner of EndpointV2, both Uln302 and Treasury. Can register and set default MessageLibraries and change the Treasury address.',
    ),
    {
      accounts: [discovery.formatPermissionedAccount(enaExecutor)],
      name: 'Default LayerZero Executor',
      description:
        'Messages passed through the LayerZero AMB are, by default, sent to the destination chain by this Executor. This can be changed by the respective OApp owner.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
  ],
}
