import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const discovery = new ProjectDiscovery('socket')

export const socket: Bridge = {
  type: 'bridge',
  id: ProjectId('socket'),
  addedAt: new UnixTime(1706204584), // 2024-01-25T17:43:04Z
  display: {
    name: 'Socket',
    slug: 'socket',
    warning:
      'The security parameters of each individual token and vault must be individually assessed, and can be changed by the developers. DYOR and use Socket at your own risk.',
    category: 'Token Bridge',
    links: {
      websites: ['https://socketscan.io/'],
      repositories: [
        'https://github.com/SocketDotTech/socket-DL',
        'https://github.com/SocketDotTech/socket-plugs/tree/main/contracts/bridge',
      ],
      documentation: ['https://developer.socket.tech/Learn/protocol-design'],
      socialMedia: ['https://twitter.com/SocketDotTech'],
    },
    description:
      'This page gathers Socket vaults built on top of Socket Data Layer cross chain messaging protocol.',
    detailedDescription:
      'Socket is highly flexible and configurable and risks vary depending on the current configuration of the specific route. It allows to define custom Token Vaults that communicate using different messaging protocols.\
    Token Vaults are connected via Plugs and Switchboards to their remote counterparts. The central contract on each chain, Socket, stores the configuration of all Plugs and Switchboards.\
    Some Switchboards may be as secure as "native" (canonical) bridge, some may use simple Relayers/Watchers to move messages across chains.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Depending on the Switchboard, transfers may need to be independently confirmed by third parties, for example when using FastSwitchboard there is a set of WATCHERS that need to authorize the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Vaults can be individually upgradable and the security assumptions must be individually assessed for each individual vault.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Tokens transferred end up as ERC20 proxies, some of them are upgradable. The contract is named UChildERC20Proxy.',
    },
  },
  technology: {
    destination: ['Ethereum', 'Reya', 'Lyra', 'Kinto', 'Polynomial', 'Blast'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Socket is a bridge framework connecting different chains via a set of "switchboards". Every chain using Socket for some of its tokens can mix & match many switchboards with varying trust assumptions, for example mixing a "fast" route via "Fast Switchboard" with a "Standard Route" using a native rollup AMB.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Various switchboards',
      description:
        'Vaults can use any registered switchboards. The validation model is chosen by the switchboard and their security can vary from using a canonical bridge to a third-party validation model.',
      references: [
        {
          title: 'Protocol Design - Socket Documentation',
          url: 'https://developer.socket.tech/Learn/protocol-design#architecture',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'watchers fail to facilitate the transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'watchers submit fraudulent block hash and relay fraudulent transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Socket Vault owners change the Vault configuration.',
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      // Derive
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE3E96892D30E0ee1a8131BAf87c891201F7137bf'),
        name: 'sUSDe Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['sUSDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6D303CEE7959f814042D31E0624fB88Ec6fbcC1d'),
        name: 'USDC Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x26Cf1Dc84694E04277F2Fe4C13E43597c6010C2A'),
        name: 'USDe Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['USDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5e98A25d8d6FF69A8992d6Aa57948dFB77D4ECBa'),
        name: 'USDT Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['USDT'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x613e87BE1cd75dEBC5e6e56a2AF2fED84162C142'),
        name: 'sDAI Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['sDAI'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7E1d17b580dD4F89037DB331430eAEe8B8e50c91'),
        name: 'DAI Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['DAI'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8180EcCC825b692ef65FF099a0A387743788bf78'),
        name: 'weETH Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['weETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD4efe33C66B8CdE33B8896a2126E41e5dB571b7e'),
        name: 'WETH Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['WETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x4BB4C3CDc7562f08e9910A0C7D8bB7e108861eB4'),
        name: 'rswETH Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['rswETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x35d4D9bc79B0a543934b1769304B90d752691caD'),
        name: 'rsETH Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['rsETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x76624ff43D610F64177Bb9c194A2503642e9B803'),
        name: 'LBTC Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['LBTC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7D7aC8d55A9bD4152b703011f3E61AB3bB0A5592'),
        name: 'SNX Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['SNX'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3Eec7c855aF33280F1eD38b93059F5aa5862E3ab'),
        name: 'WBTC Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['WBTC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x25d35C8796c9dcD3857abE90D802FC17b1FB55A5'),
        name: 'eBTC Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['eBTC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5F18C54e4E10287414A47925a24Ea3A8Cf4A9F50'),
        name: 'cbBTC Vault Derive',
        description:
          'Socket Vault associated with Derive and owned by LyraMultisig.',
        tokens: ['cbBTC'],
      }),
      // Kinto
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5B8Ae1C9c5970e2637Cf3Af431acAAebEf7aFb85'),
        name: 'sDAI Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['sDAI'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x43b718Aa5e678b08615CA984cbe25f690B085b32'),
        name: 'sUSDe Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['sUSDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd1228C6CB94a670F30D5ACb1340a9d96aC30e6A8'),
        name: 'SPX Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['SPX'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xdf34E61B6e7B9e348713d528fEB019d504d38c1e'),
        name: 'USDe Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['USDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x755cD5d147036E11c76F1EeffDd94794fC265f0d'),
        name: 'USDC Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x95d60E34aB2E626407d98dF8C240e6174e5D37E5'),
        name: 'ETHFI Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['ETHFI'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0fC783f611A888A2cAbC3dA482Add3215334dCc2'),
        name: 'MKR Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['MKR'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xdb161cdc9c11892922F7121a409b196f3b00e640'),
        name: 'EIGEN Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['EIGEN'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xc5d01939Af7Ce9Ffc505F0bb36eFeDde7920f2dc'),
        name: 'wstETH Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['wstETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA6Ae29Ce5c38DFE0Dd95B716748ac747f31E4013'),
        name: 'LINK Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['LINK'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA2bc0DaA9BF98820632bCa0663a9616f6bC180f8'),
        name: 'SOL Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['SOL'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xeB66259d2eBC3ed1d3a98148f6298927d8A36397'),
        name: 'weETH Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['weETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x00A0c9d82B95a17Cdf2D46703F2DcA13EB0E8A94'),
        name: 'WETH Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['WETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x12Cf431BdF7F143338cC09A0629EDcCEDCBCEcB5'),
        name: 'DAI Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoMultisig.',
        tokens: ['DAI'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x25f0D71Da51A77Ca231484eBbAD1f588A0230ef2'),
        name: 'PAXG Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['PAXG'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd04Bc056BE36a6127267E4F71d3b43D1BEEfE8bF'),
        name: 'XAUt Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['XAUt'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8F5247072e9580624Be243D4EC8cD3F3ABfF86B9'),
        name: 'cbBTC Vault Kinto',
        description:
          'Socket Vault associated with Kinto and owned by KintoEOA.',
        tokens: ['cbBTC'],
      }),
      // Polynomial
      discovery.getEscrowDetails({
        address: EthereumAddress('0xDf9Fa2b420689384E8DD55a706262DC0ED37020F'),
        name: 'USD0++ Vault Polynomial',
        description:
          'Socket Vault associated with Polynomial and owned by PolynomialEOA.',
        tokens: ['USD0++'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xC6cfb996A7CFEB89813A68CD13942CD75553032b'),
        name: 'sUSDe Vault Polynomial',
        description:
          'Socket Vault associated with Polynomial and owned by PolynomialEOA.',
        tokens: ['sUSDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xDE1617Ddb7C8A250A409D986930001985cfad76F'),
        name: 'USDC Vault Polynomial',
        description:
          'Socket Vault associated with Polynomial and owned by PolynomialEOA.',
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x615172e47c0C5A6dA8ea959632Ac0166f7a59eDc'),
        name: 'sDAI Vault Polynomial',
        description:
          'Socket Vault associated with Polynomial and owned by PolynomialEOA.',
        tokens: ['sDAI'],
      }),
      // Blast
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa83B4006c16DAeAb2718294696c0122519195137'),
        name: 'LOOKS Vault Blast',
        description:
          'Socket Vault associated with Blast and owned by LooksRareMultisig.',
        tokens: ['LOOKS'],
      }),
      // Zora
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1417f50f864ba75D5c6cb4CD14479c48Ce5166fB'),
        name: 'USDT Vault Zora',
        description:
          'Socket Vault associated with Zora and owned by Unknown Owner.',
        tokens: ['USDT'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xdFf78A949E47c1e90f3Dd6dd7Fe2Fa72B42a75f7'),
        name: 'USDC Vault Reya',
        description:
          'Socket Vault associated with Reya and owned by Socket EOA.',
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xaA2f2B6cD33Eaabb795c6DB60AAec599C8450F35'),
        name: 'USDe Vault Reya',
        description:
          'Socket Vault associated with Reya and owned by Socket EOA.',
        tokens: ['USDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5F3B301B4967623fDb3AE52Bb8FF4dB01C460Cd3'),
        name: 'sUSDe Vault Reya',
        description:
          'Socket Vault associated with Reya and owned by Socket EOA.',
        tokens: ['sUSDe'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x64dF894688c5052BeAdC35371cF69151Ebc5D658'),
        name: 'WETH Vault Reya',
        description:
          'Socket Vault associated with Reya and owned by Socket EOA.',
        tokens: ['WETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x2344621d5aA6e784e8C6f4c54b0B29Dd9c3Ad4B6'),
        name: 'WBTC Vault Reya',
        description:
          'Socket Vault associated with Reya and owned by Socket EOA.',
        tokens: ['WBTC'],
      }),
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'Socket',
          'Central contract in Socket SuperBridge holding configuration of all Plugs and associated Switchboards.',
        ),
        discovery.getContractDetails(
          'FastSwitchboard',
          'Fast Switchboard having a set of Watchers authorizing transfers. If the transfer is not explicitly authorized within certain period of time, it is optimistically considered to be valid. Watchers can also stop (trip) an invalid transfer.',
        ),
        discovery.getContractDetails(
          'PolygonL1Switchboard',
          'Switchboard using native Polygon message passing.',
        ),
        discovery.getContractDetails(
          'OptimismSwitchboard',
          'Switchboard using native Optimism message passing.',
        ),
        discovery.getContractDetails(
          'ArbitrumL1Switchboard',
          'Switchboard using native Arbitrum message passing.',
        ),
        discovery.getContractDetails(
          'ExecutionManager',
          'Manages crosschain execution and fees.',
        ),
        discovery.getContractDetails(
          'TransmitManager',
          'Manages and verifies transmitters: Permissioned actors who are allowed to send messages via socket.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'socketadmin.eth EOA',
          discovery.getPermissionedAccounts('Socket', 'owner'),
          'Account privileged to set up different roles in the main Socket contract.',
        ),
        discovery.getMultisigPermission(
          'LyraMultisig',
          'Multisig that owns the Socket Vaults associated with Lyra.',
        ),
        discovery.getMultisigPermission(
          'KintoMultisig',
          'Multisig that owns the Socket Vaults associated with Kinto.',
        ),
        discovery.getPermissionDetails(
          'KintoEOA',
          discovery.getPermissionedAccounts('PAXG Vault Kinto', 'owner'),
          'owns some Vaults associated with Kinto.',
        ),
        discovery.getMultisigPermission(
          'LooksRareMultisig',
          'Multisig that owns a Socket Vault associated with LOOKS token.',
        ),
        discovery.getPermissionDetails(
          'PolynomialEOA',
          discovery.getPermissionedAccounts('USDC Vault Polynomial', 'owner'),
          'EOA that owns the Socket Vaults associated with Polynomial L2.',
        ),
      ],
    },
  },
  knowledgeNuggets: [],
}
