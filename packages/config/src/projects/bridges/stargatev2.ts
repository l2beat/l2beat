import { assert, EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('stargatev2')
const discovery_arbitrum = new ProjectDiscovery('stargatev2', 'arbitrum')
// const discovery_optimism = new ProjectDiscovery('stargatev2', 'optimism')

const discoveredOAppOwners = [
  discovery.getPermissionedAccount('CreditMessaging', 'owner'),
  discovery.getPermissionedAccount('TokenMessaging', 'owner'),
]
const discoveredDelegates = [
  discovery.getPermissionedAccount('EndpointV2', 'delegatesCreditMessaging'),
  discovery.getPermissionedAccount('EndpointV2', 'delegatesTokenMessaging'),
]
const discoveredSendLib = <string>(
  discovery.getContractValue('EndpointV2', 'getSendLibrary')
)
const discoveredReceiveLib = <[string, boolean]>(
  discovery.getContractValue('EndpointV2', 'getReceiveLibrary')
)
const discoveredUlnConfig: [
  number, // confirmations
  number, // requiredDVNCount
  number, // optionalDVNCount
  number, // optionalDVNThreshold
  string[], // requiredDVNs (addresses)
  string[], // optionalDVNs (addresses)
] = discovery.getContractValue('ReceiveUln302', 'getUlnConfig')
const discoveredExecutorConfig: [number, string] = discovery.getContractValue(
  'SendUln302',
  'getExecutorConfig',
)

export const stargatev2: Bridge = {
  type: 'bridge',
  id: ProjectId('stargatev2'),
  display: {
    name: 'Stargate v2 (LayerZero)',
    slug: 'stargatev2',
    links: {
      websites: ['https://stargate.finance/', 'https://layerzero.network/'],
      apps: ['https://layerzeroscan.com/'],
      repositories: [
        'https://github.com/stargate-protocol/stargate-v2',
        'https://github.com/LayerZero-Labs/LayerZero-v2',
      ],
      socialMedia: [
        'https://discord.com/invite/ymBqyE6',
        'https://t.me/joinchat/LEM0ELklmO1kODdh',
        'https://medium.com/stargate-official',
        'https://x.com/StargateFinance',
      ],
    },
    description:
      'Stargate v2 is a Hybrid Bridge (mainly Liquidity Network) built on top of the Layer Zero messaging protocol.',
    detailedDescription:
      'It uses liquidity pools on all supported chains, supports optional batching and a Token Bridge mode called Hydra that can mint tokens at the destination.',
    category: 'Hybrid',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The Layer Zero message protocol is used: If all preconfigured verifiers agree on a message, it is considered verified and can be executed by a permissioned Executor at the destination.',
      sentiment: 'bad',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL, // TODO: find Hydra onchain
  },
  technology: {
    destination: [
      'Ethereum',
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Arbitrum',
      'Optimism',
      'Metis',
      'Linea',
      'Mantle',
      'Base',
      'Kava',
      'Scroll',
      'Klaytn',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Stargate is a Liquidity Network. It relies on liquidity providers to supply tokens to liquidity pools on each chain. \
        Users can swap tokens between chains by transferring their tokens to a pool and receive token from the pool on the destination chain.',
      references: [],
      risks: [],
    },
    validation: (() => {
      assert(
        discoveredUlnConfig[1] === 2 && // requiredDVNCount
          discoveredUlnConfig[4][0] ===
            '0x8FafAE7Dd957044088b3d0F67359C327c6200d18' && // Stargate DVN address
          discoveredUlnConfig[4][1] ===
            '0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5', // Nethermind DVN address
        'Update the verification and permissions section, the verification config of Stargate has changed.',
      )
      assert(
        discoveredExecutorConfig[1] ===
          '0x173272739Bd7Aa6e4e214714048a9fE699453059', // LayerZero Executor
        'The configured Executor for Stargate changed: Review the risk and permissions section.',
      )

      return {
        name: 'Layer Zero message verification',
        description:
          'The Layer Zero message protocol is used: For validation of messages from Stargate over Layer Zero, two verifiers are currently configured: Nethermind and Stargate.\
        If both verifiers agree on a message, it is verified and can be executed by a permissioned Executor at the destination. This configuration can be changed at any time by the StargateMultisig.',
        references: [],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'both whitelisted Verifiers or the Layer Zero Executor fail to facilitate the transaction.',
            isCritical: true,
          },
          {
            category: 'Funds can be stolen if',
            text: 'both whitelisted Verifiers collude to submit a fraudulent message.',
            isCritical: true,
          },
        ],
      }
    })(),
  },
  config: {
    escrows: [
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0xc026395860Db2d07ee33e05fE50ed7bD583189C7',
          ),
          tokens: ['USDC'],
          description: 'Stargate Liquidity pool for USDC on Ethereum.',
        }),
      },
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0x77b2043768d28E9C9aB44E1aBfC95944bcE57931',
          ),
          tokens: ['ETH'],
          description: 'Stargate Liquidity pool for ETH on Ethereum.',
        }),
      },
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0x933597a323Eb81cAe705C5bC29985172fd5A3973',
          ),
          tokens: ['USDT'],
          description: 'Stargate Liquidity pool for USDT on Ethereum.',
        }),
      },
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3',
          ),
          tokens: ['Metis'],
          description: 'Stargate Liquidity pool for METIS on Ethereum.',
        }),
      },
      {
        ...discovery.getEscrowDetails({
          address: EthereumAddress(
            '0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D',
          ),
          tokens: ['mETH'],
          description: 'Stargate Liquidity pool for mETH on Ethereum.',
        }),
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        ...discovery_arbitrum.getEscrowDetails({
          address: EthereumAddress(
            '0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
          ),
          tokens: ['USDC'],
          description: 'Stargate Liquidity pool for USDC on Arbitrum.',
        }),
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        ...discovery_arbitrum.getEscrowDetails({
          address: EthereumAddress(
            '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
          ),
          tokens: ['USDT'],
          description: 'Stargate Liquidity pool for USDT on Arbitrum.',
        }),
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        ...discovery_arbitrum.getEscrowDetails({
          address: EthereumAddress(
            '0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F',
          ),
          tokens: ['ETH'],
          description: 'Stargate Liquidity pool for ETH on Arbitrum.',
        }),
      },
      // {
      //   chain: 'optimism',
      //   includeInTotal: false,
      //   ...discovery_optimism.getEscrowDetails({
      //     address: EthereumAddress(
      //       '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
      //     ),
      //     tokens: ['USDC'],
      //     description: 'Stargate Liquidity pool for USDC on Optimism.',
      //   }),
      // },
      // {
      //   chain: 'base',
      //   includeInTotal: false,
      //   ...discovery.getEscrowDetails({
      //     address: EthereumAddress(
      //       '0x27a16dc786820B16E5c9028b75B99F6f604b5d26',
      //     ),
      //     tokens: ['USDC'],
      //     description: 'Stargate Liquidity pool for USDC on Base.',
      //   }),
      // },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'TokenMessaging',
        "A Layer Zero OApp owned by Stargate that manages bridging messages from all pools on Ethereum. It can batch messages with a 'bus' mode or dispatch them immediately for higher fees.",
      ),
      discovery.getContractDetails(
        'CreditMessaging',
        'A Layer Zero OApp owned by Stargate that is used for the virtual accounting of available tokens to the local pools. A local pool thus has a record of how many tokens are available when bridging to another remote pool. The permissioned Planner role can move these credits.',
      ),
    ],
    ...(() => {
      assert(
        EthereumAddress(discoveredReceiveLib[0]) ===
          discovery.getContract('ReceiveUln302').address &&
          EthereumAddress(discoveredSendLib) ===
            discovery.getContract('SendUln302').address,
        "Update the contracts and risk section, the endpoint's message libraries have changed.",
      )
      return [
        discovery.getContractDetails(
          'EndpointV2',
          'A contract that is part of the Layer Zero messaging protocol. The Stargate OApp owner can configure verification and execution settings here.',
        ),
        discovery.getContractDetails(
          'Stargate Verifier',
          'One out of the two verifier contracts that are currently registered to verify all cross chain messages.',
        ),
        discovery.getContractDetails(
          'Nethermind Verifier',
          'One out of the two verifier contracts that are currently registered to verify all cross chain messages.',
        ),
        discovery.getContractDetails(
          'LayerZero Executor',
          'Is trusted to execute verified messages at the destination for a fee. Jobs are assigned to this contract by the Layer Zero Endpoint.',
        ),
      ]
    })(),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the OApp owner changes the configuration of the OApp to malicious verifiers and executors.',
        isCritical: true,
      },
      {
        category: 'Users can be censored if',
        text: "the permissioned Planner moves all credits away from the users' chain, preventing them from bridging.",
      },
    ],
  },
  permissions: [
    ...(() => {
      assert(
        discoveredOAppOwners[0].address === discoveredOAppOwners[1].address &&
          discoveredOAppOwners[1].address === discoveredDelegates[0].address &&
          discoveredDelegates[0].address === discoveredDelegates[1].address &&
          discoveredDelegates[1].address ===
            discovery.getContract('Stargate Multisig').address,
        'Update the permissions and risk section, the OApp owners or delegates are different from the Stargate Multisig.',
      )
      return [
        ...discovery.getMultisigPermission(
          'Stargate Multisig',
          'Owner of all pools and the associated OApps, can create new pools and endpoints, set fees and modify the OApp configuration to change verifiers and executors.',
        ),
      ]
    })(),
    ...discovery.getMultisigPermission(
      'LayerZero Multisig',
      'The owner of the Layer Zero contracts EndpointV2, Uln302 and Treasury. Can register and set default MessageLibraries (used e.g. for verification of Stargate messages) and change the Treasury address (Layer Zero fee collector).',
    ),
    {
      name: 'Planner',
      accounts: [
        discovery.getPermissionedAccount('CreditMessaging', 'planner'),
      ],
      description:
        'Central actor who can move credits (see CreditMessaging contract) among chains and thus move liquidity claims of the Stargate pools.',
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
