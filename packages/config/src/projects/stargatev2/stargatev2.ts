import {
  assert,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('stargatev2')

const discoveredSendLib = <string>(
  discovery.getContractValue('EndpointV2', 'getSendLibrary')
)
const discoveredReceiveLib = <{ lib: string; isDefault: boolean }>(
  discovery.getContractValue('EndpointV2', 'getReceiveLibrary')
)
const discoveredUlnConfig = discovery.getContractValue<{
  confirmations: number
  requiredDVNCount: number
  optionalDVNCount: number
  optionalDVNThreshold: number
  requiredDVNs: string[]
  optionalDVNs: string[]
}>('ReceiveUln302', 'getUlnConfig')

const discoveredExecutorConfig = discovery.getContractValue<{
  maxMessageSize: number
  executor: string
}>('SendUln302', 'getExecutorConfig')

assert(
  ChainSpecificAddress(discoveredReceiveLib.lib) ===
    discovery.getContract('ReceiveUln302').address &&
    ChainSpecificAddress(discoveredSendLib) ===
      discovery.getContract('SendUln302').address,
  "Update the contracts and risk section, the endpoint's message libraries have changed.",
)

export const stargatev2: Bridge = {
  type: 'bridge',
  id: ProjectId('stargatev2'),
  addedAt: UnixTime(1718620600), // 2024-06-17T10:36:40Z
  display: {
    name: 'Stargate v2 (LayerZero v2)',
    shortName: 'Stargate v2',
    slug: 'stargatev2',
    links: {
      websites: ['https://stargate.finance/', 'https://layerzero.network/'],
      bridges: ['https://layerzeroscan.com/'],
      repositories: [
        'https://github.com/stargate-protocol/stargate-v2',
        'https://github.com/LayerZero-Labs/LayerZero-v2',
      ],
      socialMedia: [
        'https://discord.com/invite/eG5TgNpUE7',
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
        'The LayerZero message protocol is used. If all preconfigured DVNs agree on a message, it is considered verified and can be executed at the destination.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL, // TODO: find Hydra onchain
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
On chains where assets are available through other bridges, Stargate acts as a Liquidity Bridge. This requires Stargate liquidity pools for assets at the sources and destinations since no assets can be burned or minted.
While liquidity providers need to keep all pools buffered with assets, users can deposit into a pool on their chosen source chain and quickly receive the equivalent asset at the destination through an Executor.
Users can choose between an economical batched bridge mode ('bus') or an individual fast 'taxi' mode that delivers the bridging message as soon as the user deposits.

While Stargate operates the local token pools on each supported chain, they are all connected through the LayerZero messaging protocol, which is responsible for verifying and delivering the crosschain messages.
Verification is done by Stargate-selected permissioned verifiers (called DVNs in LayerZero terminology), currently configured as a 2/2 of Stargate and Nethermind custom Multisigs. 
Crosschain message passing is done by professional relayers and executors but could technically be done by anyone (even the user themselves if they have access to the bridge message signed by the two verifiers e.g. in case they have committed the verification onchain).

Just like the assets themselves, so-called *credits* (also OFTs) are bridged among the supported pools in the Stargate v2 system. Credits can be seen as claims on assets, so a liquidity pool needs credits for a remote pool to be able to bridge there.
These credits can be moved and rebalanced (but not minted) by a permissioned role called Planner.`,
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
        discoveredUlnConfig.requiredDVNCount === 2 &&
          discoveredUlnConfig.requiredDVNs[0] ===
            'eth:0x8FafAE7Dd957044088b3d0F67359C327c6200d18' && // Stargate DVN address
          discoveredUlnConfig.requiredDVNs[1] ===
            'eth:0xa59BA433ac34D2927232918Ef5B2eaAfcF130BA5', // Nethermind DVN address
        'Update the validation, poO and permissions sections, the security config of Stargatev2 has changed.',
      )
      assert(
        discoveredExecutorConfig.executor ===
          'eth:0x173272739Bd7Aa6e4e214714048a9fE699453059', // LayerZero Executor
        'The configured Executor for Stargatev2 changed: Review the permissions section.',
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
        address: ChainSpecificAddress(
          'eth:0x783129E4d7bA0Af0C896c239E57C06DF379aAE8c',
        ),
        tokens: ['EURC'],
        description: 'Stargate liquidity pool for EURC on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xc026395860Db2d07ee33e05fE50ed7bD583189C7',
        ),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x77b2043768d28E9C9aB44E1aBfC95944bcE57931',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x933597a323Eb81cAe705C5bC29985172fd5A3973',
        ),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3',
        ),
        tokens: ['Metis'],
        description: 'Stargate liquidity pool for METIS on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D',
        ),
        tokens: ['mETH'],
        description: 'Stargate liquidity pool for mETH on Ethereum.',
      }),
      // MULTICHAIN ESCROWS:
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'arb1:0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
        ),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Arbitrum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'arb1:0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        ),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Arbitrum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'arb1:0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Arbitrum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'oeth:0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        ),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Optimism.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'oeth:0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Optimism.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'oeth:0x19cFCE47eD54a88614648DC3f19A5980097007dD',
        ),
        tokens: ['USDT'],
        description: 'Stargate liquidity pool for USDT on Optimism.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'base:0x87Dd5A7481726a53C5Ac6b0D296F5846f95a72f2',
        ),
        tokens: ['EURC'],
        description: 'Stargate liquidity pool for EURC on Base.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'base:0x27a16dc786820B16E5c9028b75B99F6f604b5d26',
        ),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Base.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'base:0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Base.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'scr:0x3Fc69CC4A842838bCDC9499178740226062b14E4',
        ),
        tokens: ['USDC'],
        description: 'Stargate liquidity pool for USDC on Scroll.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'scr:0xC2b638Cb5042c1B3c5d5C969361fB50569840583',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Scroll.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'linea:0x81F6138153d473E8c5EcebD3DC8Cd4903506B075',
        ),
        tokens: ['ETH'],
        description: 'Stargate liquidity pool for ETH on Linea.',
      }),
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
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
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
