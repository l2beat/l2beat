import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const discovery = new ProjectDiscovery('stargatev2')
const discovery_arbitrum = new ProjectDiscovery('stargatev2', 'arbitrum')
const discovery_optimism = new ProjectDiscovery('stargatev2', 'optimism')
const discovery_base = new ProjectDiscovery('stargatev2', 'base')
const discovery_scroll = new ProjectDiscovery('stargatev2', 'scroll')
const discovery_metis = new ProjectDiscovery('stargatev2', 'metis')
const discovery_linea = new ProjectDiscovery('stargatev2', 'linea')
const discovery_mantle = new ProjectDiscovery('stargatev2', 'mantle')

const discoveredOAppOwners = [
  ...discovery.getPermissionedAccounts('CreditMessaging', 'owner'),
  ...discovery.getPermissionedAccounts('TokenMessaging', 'owner'),
]
const discoveredDelegates = [
  ...discovery.getPermissionedAccounts(
    'EndpointV2',
    'delegatesCreditMessaging',
  ),
  ...discovery.getPermissionedAccounts('EndpointV2', 'delegatesTokenMessaging'),
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
  addedAt: new UnixTime(1718620600), // 2024-06-17T10:36:40Z
  display: {
    name: 'Stargate v2 (LayerZero v2)',
    shortName: 'Stargate v2',
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
      'Stargate v2 is a Hybrid Bridge (mainly Liquidity Network) built on top of the LayerZero messaging protocol.',
    detailedDescription:
      'It uses liquidity pools on all supported chains, supports optional batching and a Token Bridge mode called Hydra that can mint tokens at the destination.',
    category: 'Hybrid',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The LayerZero message protocol is used. If all preconfigured DVNs agree on a message, it is considered verified and can be executed by a permissioned Executor at the destination.',
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
      description: `
      On chains where assets are available through other bridges, Stargate acts as a Liquidity Bridge. This requires Stargate liquidity pools for assets at the sources and destinations.
      
      
      While liquidity providers need to keep all pools buffered with assets, users can deposit into a pool on their chosen source chain and quickly receive the equivalent asset at the destination through an Executor.
      Users can choose between an economical batched bridge mode ('bus') or an individual fast 'taxi' mode that delivers the bridging message as soon as the user deposits.
      
      
      The Executor is a permissioned actor that withdraws the asset from the liquidity pool at the destination directly to the user.
      They are only a relayer and depend on LayerZero DVNs (distributed validator networks) to verify the message coming from the source chain. These DVNs can be freely configured by the OApp owner (Stargate) for each pair of endpoints.
      Stargatev2 currently has two DVNs configured: Stargate and Nethermind. From the viewpoint of the LayerZero message protocol, each DVN is a single signer and the current threshold for verification is 2.
      
      
      Just like the assets themselves, so-called *credits* are bridged among the supported pools in the Stargate v2 system. Credits can be seen as claims on assets, so a liquidity pool needs credits for a remote pool to be able to bridge there.
      These credits can be moved and rebalanced (but not minted) by a permissioned Planner.
      
      
      In the case of the Executor failing to deliver the bridge message, the user can try to deliver the message to the destination themselves, either if it was already verified or if the user has access to the signed verifier message (e.g. through layerzeroscan.com).`,
      references: [
        {
          title: 'Stargate Docs: Modes of transport',
          url: 'https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/modes-of-transport-taxi-and-bus',
        },
        {
          title: 'Stargate Docs: Credit allocation system',
          url: 'https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/credit-allocation-system',
        },
      ],
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
        'The configured Executor for Stargate changed: Review the risk, PoO and permissions sections.',
      )

      return {
        name: 'LayerZero messaging',
        description:
          'The LayerZero message protocol is used: For validation of messages from Stargate over LayerZero, two DVNs are currently configured: Nethermind and Stargate.\
        If both DVNs agree on a message, it is verified and can be executed by an Executor at the destination. This configuration can be changed at any time by the StargateMultisig.',
        references: [
          {
            title: 'LayerZero Docs: Security Stack',
            url: 'https://docs.layerzero.network/v2/home/modular-security/security-stack-dvns',
          },
        ],
        risks: [
          {
            category: 'Users can be censored if',
            text: 'any of the two whitelisted DVNs fail to approve the transaction.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'both whitelisted DVNs collude to submit a fraudulent message.',
          },
        ],
      }
    })(),
    destinationToken: {
      name: 'Destination Tokens',
      description:
        'Since Stargate is mainly a Liquidity Network, its liquidity pools at the destination are filled with tokens from canonical or other bridges than Stargate. As no new tokens are minted, the users do not inherit the risk of the Stargate bridge as soon as the bridging is complete. For chains where a destination asset is not available, Stargate v2 offers a Token Bridge mode called Hydra that locks the asset at the source and mints a Stargate OFT at the destination.',
      references: [
        {
          title: 'Stargate Docs: Token Bridge mode (Hydra)',
          url: 'https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/token-types/hydra-ofts',
        },
      ],
      risks: [],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc026395860Db2d07ee33e05fE50ed7bD583189C7'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x77b2043768d28E9C9aB44E1aBfC95944bcE57931'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x933597a323Eb81cAe705C5bC29985172fd5A3973'),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3'),
        tokens: ['Metis'],
        description: 'Stargate liquidity pool for METIS on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D'),
        tokens: ['mETH'],
        description: 'Stargate liquidity pool for mETH on Ethereum.',
      }),
      // MULTICHAIN ESCROWS:
      discovery_arbitrum.getEscrowDetails({
        address: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Arbitrum.',
      }),
      discovery_arbitrum.getEscrowDetails({
        address: EthereumAddress('0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0'),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Arbitrum.',
      }),
      discovery_arbitrum.getEscrowDetails({
        address: EthereumAddress('0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Arbitrum.',
      }),
      discovery_optimism.getEscrowDetails({
        address: EthereumAddress('0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Optimism.',
      }),
      discovery_optimism.getEscrowDetails({
        address: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Optimism.',
      }),
      discovery_optimism.getEscrowDetails({
        address: EthereumAddress('0x19cFCE47eD54a88614648DC3f19A5980097007dD'),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Optimism.',
      }),
      discovery_base.getEscrowDetails({
        address: EthereumAddress('0x27a16dc786820B16E5c9028b75B99F6f604b5d26'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Base.',
      }),
      discovery_base.getEscrowDetails({
        address: EthereumAddress('0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for USDC on Base.',
      }),
      discovery_scroll.getEscrowDetails({
        address: EthereumAddress('0x3Fc69CC4A842838bCDC9499178740226062b14E4'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Scroll.',
      }),
      discovery_scroll.getEscrowDetails({
        address: EthereumAddress('0xC2b638Cb5042c1B3c5d5C969361fB50569840583'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Scroll.',
      }),
      discovery_metis.getEscrowDetails({
        address: EthereumAddress('0x36ed193dc7160D3858EC250e69D12B03Ca087D08'),
        tokens: ['WETH'],
        description: 'Stargate liquidity pool for ETH on Metis.',
      }),
      discovery_metis.getEscrowDetails({
        address: EthereumAddress('0xD9050e7043102a0391F81462a3916326F86331F0'),
        tokens: ['Metis'],
        description: 'Stargate liquidity pool for METIS on Metis.',
      }),
      discovery_metis.getEscrowDetails({
        address: EthereumAddress('0x4dCBFC0249e8d5032F89D6461218a9D2eFff5125'),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Metis.',
      }),
      discovery_linea.getEscrowDetails({
        address: EthereumAddress('0x81F6138153d473E8c5EcebD3DC8Cd4903506B075'),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Linea.',
      }),
      discovery_mantle.getEscrowDetails({
        address: EthereumAddress('0x4c1d3Fc3fC3c177c3b633427c2F769276c547463'),
        tokens: ['WETH'],
        description: 'Stargate liquidity pool for ETH on Mantle.',
      }),
      discovery_mantle.getEscrowDetails({
        address: EthereumAddress('0xB715B85682B731dB9D5063187C450095c91C57FC'),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Mantle.',
      }),
      discovery_mantle.getEscrowDetails({
        address: EthereumAddress('0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC'),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Mantle.',
      }),
      discovery_mantle.getEscrowDetails({
        address: EthereumAddress('0xF7628d84a2BbD9bb9c8E686AC95BB5d55169F3F1'),
        tokens: ['mETH'],
        description: 'Stargate liquidity pool for mETH on Mantle.',
      }),
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'TokenMessaging',
          "A LayerZero OApp owned by Stargate that manages bridging messages from all pools on Ethereum. It can batch messages with a 'bus' mode or dispatch them immediately for higher fees.",
        ),
        discovery.getContractDetails(
          'CreditMessaging',
          'A LayerZero OApp owned by Stargate that is used for the virtual accounting of available tokens to the local pools. A local pool thus has a record of how many tokens are available when bridging to another remote pool. The permissioned Planner role can move these credits.',
        ),
        discovery.getContractDetails(
          'Stargate Verifier',
          'One of the registered DVNs for the OApp acts through this smart contract. They are allowed to verify LayerZero messages for the Stargate bridge and enable their execution at the destination.',
        ),
        discovery.getContractDetails(
          'Nethermind Verifier',
          'One of the registered DVNs for the OApp acts through this smart contract. They are allowed to verify LayerZero messages for the Stargate bridge and enable their execution at the destination.',
        ),
      ],
    },
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
          'A contract that is part of the LayerZero messaging protocol. The Stargate OApp owner can configure verification and execution settings here.',
        ),
        discovery.getContractDetails(
          'Stargate Verifier',
          'One out of the two DVN contracts that are currently registered to verify all cross chain messages.',
        ),
        discovery.getContractDetails(
          'Nethermind Verifier',
          'One out of the two DVN contracts that are currently registered to verify all cross chain messages.',
        ),
        discovery.getContractDetails(
          'LayerZero Executor',
          'Is trusted to execute verified messages at the destination for a fee. Jobs are assigned to this contract by the LayerZero Endpoint.',
        ),
      ]
    })(),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'the OApp owner changes the configuration of the OApp to a malicious DVN.',
      },
      {
        category: 'Funds can be frozen if',
        text: "the permissioned Planner moves all credits away from the users' chain, preventing them from bridging.",
      },
    ],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        ...(() => {
          assert(
            discoveredOAppOwners[0].address ===
              discoveredOAppOwners[1].address &&
              discoveredOAppOwners[1].address ===
                discoveredDelegates[0].address &&
              discoveredDelegates[0].address ===
                discoveredDelegates[1].address &&
              discoveredDelegates[1].address ===
                discovery.getContract('Stargate Multisig').address,
            'Update the permissions and risk section, the OApp owners or delegates are different from the Stargate Multisig.',
          )
          return [
            discovery.getMultisigPermission(
              'Stargate Multisig',
              'Owner of all pools and the associated OApps, can create new pools and endpoints, set fees and modify the OApp configuration to change DVNs and executors.',
            ),
          ]
        })(),
        discovery.getMultisigPermission(
          'LayerZero Multisig',
          'The owner of the LayerZero contracts EndpointV2, Uln302 and Treasury. Can register and set default MessageLibraries (used e.g. for verification of Stargate messages) and change the Treasury address (LayerZero fee collector).',
        ),
        discovery.getPermissionDetails(
          'Planner',
          discovery.getPermissionedAccounts('CreditMessaging', 'planner'),
          'Central actor who can move credits (see CreditMessaging contract) among chains and thus move liquidity claims of the Stargate pools. Abuse of this permission can impact liveness but not security.',
        ),
      ],
    },
  },
  knowledgeNuggets: [
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
  ],
}
