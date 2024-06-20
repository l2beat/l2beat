import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { NUGGETS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('layerzerov2oft')
const enaExecutor = EthereumAddress(
  (
    discovery.getContractValue('SendUln302', 'defaultExecutor_ENA') as [
      number,
      string,
    ]
  )[1],
)

export const layerzerov2oft: Bridge = {
  type: 'bridge',
  id: ProjectId('layerzerov2oft'),
  display: {
    name: 'LayerZero v2 OFTs',
    slug: 'layerzerov2oft',
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
      'Celo',
      'Moonbeam',
      'Fuse',
      'Gnosis',
      'Klaytn',
      'Metis',
      'OKXChain',
      'Polygon zkEVM',
      'Canto',
      'zkSync Era',
      'Moonriver',
      'Solana',
      'Tenet',
      'Arbitrum Nova',
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
      'Astar',
      'Aurora',
      'Orderly',
      'Scroll',
      'Manta',
      'Shimmer',
      'Injective',
      'Rari Chain',
      'Xai',
      're.al',
      'Blast',
      'Fraxtal',
      'Astar zkEVM',
      'Mode',
      'Merlin',
      'Degen',
      'Skale',
      'Xlayer',
      'Sanko',
      'Bob',
      'Sei',
      'Cyber',
      'Iota',
      'Taiko',
      'Xchain',
      'Etherlink',
      'Tron',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `Omnichain Fungible Tokens (OFTs) are individually configurable Token Bridges. This means that an asset is usually locked or burned at its origin to start the bridging. 
      Then a witness event of this is emitted, verfied and relayed to the destination by third verfiiers. Finally, a permissioned Executor submits a transaction at the destination chain to mint the bridged asset. 
      
      The shared feature among all OFTs is the messaging interface, which always uses the LayerZero message protocol (or arbitrary message bridge, AMB). 
      Apart from the OFT standard provided by LayerZero, which extends the ERC-20 standard, implementation details are highly customizable and vary widely. 
      
      Each OFT is a LayerZero OApp and can be configured to use custom security settings when interacting with the AMB.
      Among these OApp configuration parameters are the DVN(s) (who will read and verify the interchain messages), the executor (who will deliver and execute the transaction on the destination chain), and the minimum block confirmations needed. 
      These can be set by the Oapp / OFT owner or a delegate that they can define in the EndpointV2 contract.
      Additionally, the OFT owner can often use other admin functions on the OFT contract that are specific to the ERC-20 implementation (similar to other ERC-20 tokens, like arbitrary minting or pausing functions) and not related to LayerZero.
      
      OFTs can either be natively multichain or they can use an adapter. Native OFTs are burned at their origin and minted at their destination when bridging. 
      Adapter OFTs have a main chain, where they are locked in an adapter escrow. This mints a 'native' OFT version of the locked token that can then be bridged on all chains by burn-minting. 
      To receive the original locked token back, a user would have to return to the main chain and unlock it from the adapter escrow.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the OApp owner upgrades the OFT(Adapter) contract maliciously.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'LayerZero V2 docs: Overview',
          href: 'https://docs.layerzero.network/v2/home/v2-overview',
        },
        {
          text: 'LayerZero V2 docs: OFT Quickstart',
          href: 'https://docs.layerzero.network/v2/developers/evm/oft/quickstart',
        },
      ],
    },
    validation: {
      name: 'Configurable Verifiers',
      description:
        'Each crosschain transaction is emitted on the origin chain and must be picked up and verified by preconfigured verifiers (LayerZero calls these DVNs). If they agree on a message, it is considered verified and can be executed by a permissioned Executor at the destination.',
      references: [
        {
          text: 'Etherscan: Function setConfig() in SendUln302.sol',
          href: 'https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1#code#F1#L30',
        },
        {
          text: 'L2Beat Blog: Circumventing Layer Zero',
          href: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the executor or all required verifiers fail to facilitate the transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Executor and the Verifiers collude to submit fraudulent block hash and relay fraudulent transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'the OApp owner changes the security stack maliciously.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'there is no custom security stack configured and the LayerZero Multisig changes the default security stack maliciously.',
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0xCB07992DE144bDeE56fDb66Fff2454B43243b052'),
        tokens: ['CYBER'],
        description: 'OFT adapter escrow 1 for CYBER on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3d2fe83ea885C2E43A422C82C738847669708210'),
        tokens: ['CYBER'],
        description: 'OFT adapter escrow 2 for CYBER on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E'),
        tokens: ['TRESTLE'],
        description: 'OFT adapter escrow for TRESTLE on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0ab9EfCb9DF64D575085A8d1eF7b961b57785aA2'),
        tokens: ['wTIA'],
        description: 'OFT adapter escrow for Trestle Wrapped TIA on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6182995916d79DeDb60db1570776F9994fCdCA0a'),
        tokens: ['PARAM'],
        description: 'OFT adapter escrow for PARAM on Ethereum.',
      }),
      // not launched yet
      // discovery.getEscrowDetails({
      //   address: EthereumAddress('0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf'),
      //   tokens: ['KIA'],
      //   description: 'OFT adapter escrow for Kinetix Finance Token on Ethereum.',
      // }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711'),
        tokens: ['WOO'],
        description: 'OFT adapter escrow for WOO on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6'),
        tokens: ['MYT'],
        description: 'OFT adapter escrow for MYSO Token on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D'),
        tokens: ['weETH'],
        description:
          'OFT adapter escrow for ether.fi wrapped eETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E'),
        tokens: ['sFRAX'],
        description: 'OFT adapter escrow for sFRX on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A'),
        tokens: ['sfrxETH'],
        description: 'OFT adapter escrow for sfrxETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x23432452B720C80553458496D4D9d7C5003280d0'),
        tokens: ['FXS'],
        description: 'OFT adapter escrow for FraxShares on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x801642B6efB861fE624dAD704b7A747779d9B433'),
        tokens: ['PEAS'],
        description: 'OFT adapter escrow for Peapods Finance on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34'),
        tokens: ['USDe'],
        description: 'OFT adapter escrow for USDe on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2'),
        tokens: ['sUSDe'],
        description: 'OFT adapter escrow for staked USDe on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1762c17f671FA27cE6C59256f5F28242de9274d0'),
        tokens: ['TBANK'],
        description: 'OFT adapter escrow for TaoBank token on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208'),
        tokens: ['pxETH'],
        description: 'OFT adapter escrow for Dinero Staked ETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D'),
        tokens: ['MAVIA'],
        description: 'OFT adapter escrow for MAVIA on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3'),
        tokens: ['rsETH'],
        description: 'OFT adapter escrow for Kelp DAO rsETH on Ethereum.',
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
        'The default send library for the LayerZero EndpointV2. This contract defines a framework and configuration options for sending messages across the LayerZero Arbitrary Message Bridge (AMB). It also accumulates fees configured by the OApp owners via the Treasury contract. New libraries can be added by the LayerZero Multisig.',
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
    references: [
      {
        text: 'LayerZero Docs: OFT Adapter',
        href: 'https://docs.layerzero.network/v2/developers/evm/oft/adapter',
      },
      {
        text: 'LayerZero Docs: Deployed contracts and supported chains',
        href: 'https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts',
      },
      {
        text: 'LayerZero Docs: DVN addresses',
        href: 'https://docs.layerzero.network/v2/developers/evm/technical-reference/dvn-addresses',
      },
    ],
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
