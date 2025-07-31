import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('layerzerov2oft')
const enaExecutor = ChainSpecificAddress(
  discovery.getContractValue<{
    maxMessageSize: number
    executor: string
  }>('SendUln302', 'defaultExecutor_ENA').executor,
)

export const layerzerov2oft: Bridge = {
  type: 'bridge',
  id: ProjectId('layerzerov2oft'),
  addedAt: UnixTime(1718891395), // 2024-06-20T13:49:55Z
  display: {
    name: 'LayerZero v2 OFTs',
    slug: 'layerzerov2oft',
    warning:
      'The security parameters of each Omnichain Fungible Token must be individually assessed, and can be changed by their developers (OFT/OApp owners).',
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
      socialMedia: [
        'https://x.com/layerzero_core',
        'https://t.me/joinchat/VcqxYkStIDsyN2Rh',
        'https://discord.com/invite/ktbvm8Nkcr',
        'https://medium.com/layerzero-official',
      ],
    },
    description:
      'This page gathers significant Omnichain Fungible Tokens (OFTs) built on top of LayerZero v2 AMB protocol.',
    detailedDescription:
      'Risk associated with using any OFT varies, depending on the technological decisions ([OApp configuration and security stack](https://docs.layerzero.network/v2/developers/evm/protocol-gas-settings/default-config)) made by the developers (OFT/OApp owners).\
       LayerZero as a framework to build omnichain application only provides a default, but does not enforce any minimum security as applications can define their own security settings.\
       Applications and tokens choosing the default security settings will leverage security provided by the current default Verifiers and Executor managed by the LayerZero team.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The LayerZero message protocol is used. If all preconfigured verifiers agree on a message, it is considered verified and can be executed at the destination.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
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
      description: `
Omnichain Fungible Tokens (OFTs) are individually configurable asset-specific Token Bridges. This means that an asset is usually locked or burned at its origin to start the bridging. 
Then a witness event of this is emitted, verified and relayed to the destination by third parties. Finally, an Executor submits a transaction at the destination chain to mint the bridged asset. 

The shared feature among all OFTs is the messaging interface, which always uses the LayerZero message protocol (or arbitrary message bridge, AMB). 
Apart from the OFT token standard provided by LayerZero, which extends the ERC-20 standard, implementation details are highly customizable and vary widely. 

Each OFT contract is a LayerZero OApp and can be configured to use custom security settings when interacting with the AMB.
Among these OApp configuration parameters are the DVN(s) (verifiers who will read and verify the interchain messages), the executor (who will execute the transaction on the destination chain and pay for gas), and the minimum block confirmations needed. 
These can be set by the Oapp / OFT owner or a delegate that they can define in the EndpointV2 contract.
Additionally, the OFT owner can often use other admin functions on the OFT contract that are specific to the ERC-20 implementation (similar to other ERC-20 tokens, like arbitrary minting or pausing functions) and not related to LayerZero.

In the case of the Executor failing to deliver the bridge message, the user can try to deliver the message to the destination themselves, either if it was already verified and committed onchain or if the user has access to the signed verifier message (e.g. through the layerzeroscan API).

OFTs can either be natively multichain or they can use an adapter. Native OFTs are burned at their origin and minted at their destination when bridging. 
Adapter OFTs have a main chain, where they are locked in an adapter escrow. This mints a 'native' OFT version of the locked token that can then be bridged on all chains by burn-minting. 
To receive the original locked token back, a user would have to return to the main chain and unlock it from the adapter escrow.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the OApp owner upgrades the OFT(Adapter) contract maliciously.',
        },
      ],
      references: [
        {
          title: 'LayerZero V2 docs: Overview',
          url: 'https://docs.layerzero.network/v2/home/v2-overview',
        },
        {
          title: 'LayerZero V2 docs: OFT Quickstart',
          url: 'https://docs.layerzero.network/v2/developers/evm/oft/quickstart',
        },
      ],
    },
    validation: {
      name: 'Configurable Verifiers',
      description:
        'Each crosschain transaction is emitted on the origin chain and must be picked up and verified by preconfigured verifiers (aka DVNs). If they agree on a message, it is considered verified and can be executed at the destination.',
      references: [
        {
          title: 'Etherscan: Function setConfig() in SendUln302.sol',
          url: 'https://etherscan.io/address/0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1#code#F1#L30',
        },
        {
          title: 'L2BEAT Blog: Circumventing Layer Zero',
          url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'any required Verifiers fail to approve the transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'all required Verifiers collude to approve and relay a fraudulent transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the OApp owner changes the security stack maliciously.',
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
        address: ChainSpecificAddress(
          'eth:0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee',
        ),
        tokens: ['USDT'],
        description: 'OFT adapter escrow for USDT0 on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x58538e6A46E07434d7E7375Bc268D3cb839C0133',
        ),
        tokens: ['ENA'],
        description: 'OFT adapter escrow for ENA on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xCB07992DE144bDeE56fDb66Fff2454B43243b052',
        ),
        tokens: ['CYBER'],
        description: 'OFT adapter escrow 1 for CYBER on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x3d2fe83ea885C2E43A422C82C738847669708210',
        ),
        tokens: ['CYBER'],
        description: 'OFT adapter escrow 2 for CYBER on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x17Ce6AEc7FD1aCcB5C0B2712eDDeFf8939BAB91E',
        ),
        tokens: ['TRESTLE'],
        description: 'OFT adapter escrow for TRESTLE on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x6182995916d79DeDb60db1570776F9994fCdCA0a',
        ),
        tokens: ['PARAM'],
        description: 'OFT adapter escrow for PARAM on Ethereum.',
      }),
      // not launched yet
      // discovery.getEscrowDetails({
      //   address: ChainSpecificAddress('eth:0xdDF5a3259a88Ab79D5530eB3eB14c1C92CD97FCf'),
      //   tokens: ['KIA'],
      //   description: 'OFT adapter escrow for Kinetix Finance Token on Ethereum.',
      // }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xAd6cA80Fe4D3c54f6433fF725d744772AaE87711',
        ),
        tokens: ['WOO'],
        description: 'OFT adapter escrow for WOO on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x3e52fd3383E1ee6D3959Ce5c6Aa9d1fCb46AbFA6',
        ),
        tokens: ['MYT'],
        description: 'OFT adapter escrow for MYSO Token on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xFE7fe01F8B9A76803aF3750144C2715D9bcf7D0D',
        ),
        tokens: ['weETH'],
        description:
          'OFT adapter escrow for ether.fi wrapped eETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E',
        ),
        tokens: ['sFRAX.legacy'],
        description: 'OFT adapter escrow for sFRX on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x1f55a02A049033E3419a8E2975cF3F572F4e6E9A',
        ),
        tokens: ['sfrxETH'],
        description: 'OFT adapter escrow for sfrxETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x23432452B720C80553458496D4D9d7C5003280d0',
        ),
        tokens: ['FRAX'],
        description: 'OFT adapter escrow for FraxShares on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x801642B6efB861fE624dAD704b7A747779d9B433',
        ),
        tokens: ['PEAS'],
        description: 'OFT adapter escrow for Peapods Finance on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
        ),
        tokens: ['USDe'],
        description: 'OFT adapter escrow for USDe on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2',
        ),
        tokens: ['sUSDe'],
        description: 'OFT adapter escrow for staked USDe on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x1762c17f671FA27cE6C59256f5F28242de9274d0',
        ),
        tokens: ['TBANK'],
        description: 'OFT adapter escrow for TaoBank token on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x1cd5b73d12CB23b2835C873E4FaFfE83bBCef208',
        ),
        tokens: ['pxETH'],
        description: 'OFT adapter escrow for Dinero Staked ETH on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xE6C2B672B3eB64A1F460AdcD9676a3B6c67abD4D',
        ),
        tokens: ['MAVIA'],
        description: 'OFT adapter escrow for MAVIA on Ethereum.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x85d456B2DfF1fd8245387C0BfB64Dfb700e98Ef3',
        ),
        tokens: ['rsETH'],
        description: 'OFT adapter escrow for Kelp DAO rsETH on Ethereum.',
      }),
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
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
          'USDT0DVN',
          'The USDT0 Verifier delivers their verified messages through this contract. USDT0 operations must be verified by this DVN.',
        ),
        discovery.getContractDetails(
          'Treasury',
          'Manages fees and fee recipients for registered OApps. Fees accumulate in the sendLib and OApp owners can withdraw them.',
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'LayerZero Multisig',
          'The owner of EndpointV2, both Uln302 and Treasury. Can register and set default MessageLibraries and change the Treasury address.',
        ),
        discovery.getPermissionDetails(
          'Default LayerZero Executor',
          discovery.formatPermissionedAccounts([enaExecutor]),
          'Messages passed through the LayerZero AMB are, by default, sent to the destination chain by this Executor. They are reimbursed for gas at the origin and can be set by the respective OApp owner.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
