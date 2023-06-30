import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('pNetwork')

export const pNetwork: Bridge = {
  type: 'bridge',
  id: ProjectId('pNetwork'),
  display: {
    name: 'pNetwork',
    slug: 'pnetwork',
    warning:
      'TVL of the bridge does not take into the account pTokens minted on Ethereum. These are wrapped tokens that should be backed 1:1 with their native counterparts on\
    other chains, for example pBTC being backed by BTC on  Bitcoin or pFTM backed by FTM on Fantom.',
    category: 'Token Bridge',
    links: {
      websites: ['https://p.network/'],
      apps: ['https://dapp.ptokens.io/'],
      repositories: ['https://github.com/provable-things'],
      documentation: ['https://docs.p.network/en/home'],
      socialMedia: [
        'https://t.me/pNetworkDefi',
        'https://provablethings.medium.com/',
        'https://twitter.com/pNetworkDeFi',
      ],
    },
    description:
      'pNetwork aims to be a decentralized system facilitating cross-chain movement of assets.\
      It is built as a simple Token Bridge that uses a single EOA address to move assets across. For a typical token transfer,\
      "pToken" is minted on the destination chain.',
  },
  config: {
    associatedTokens: ['PNT'],
    escrows: [
      {
        address: EthereumAddress('0xe396757EC7E6aC7C8E5ABE7285dde47b98F22db8'), // Proxy to ERC20 Vault V2
        sinceTimestamp: new UnixTime(1640867581),
        tokens: ['GALA', 'PNT', 'USDT', 'USDC'], // BIST, CGG due to almost non-existent volume
      },
      {
        address: EthereumAddress('0x9f8622b11984AfC8f0a42A394928702017c5968D'), // ERC20 Vault V1
        sinceTimestamp: new UnixTime(1626265622),
        tokens: ['UOS'],
      },
      {
        address: EthereumAddress('0x112334f50Cb6efcff4e35Ae51A022dBE41a48135'), // ERC20 Vault V1
        sinceTimestamp: new UnixTime(1620212602),
        tokens: ['WETH', 'LRC', 'BAT', 'DAI', 'ZRX', 'PNT'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a designed address.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
  technology: {
    destination: [
      'Algorand',
      'Polygon',
      'Arbitrum',
      'Bitcoin',
      'BSC',
      'EOS',
      'Telos',
      'xDAI',
      'Ultra',
      'Fio',
      'Fantom',
      'Phoenix',
    ],
    canonical: false,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a Token Bridge that locks tokens in the escrow contracts on Ethereum and mints "pTokens" on the destination network. The validation of cross-chain transactions\
        is performed by a group of Validators running MPC protocol that control one EOA address on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'External Validators observe events on pNetwork bridge and sign transfer requests on destination chain. On Ethereum a single EOA address controls such transfers.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to stop processing certain transactions.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators sign a fraudulent message allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Tokens transferred end up as their wrapped representation (pTokens). Note: on November 2022, due to misconfiguration, control over pGALA token on BSC\
        was taken over by an unknown attacker that could have resulted in minting unlimited amount of unbacked pGALA tokens.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
    },
  },

  contracts: {
    isIncomplete: true,
    addresses: [
      discovery.getContractDetails(
        'ERC20 Vault V2',
        'Has special logic for handling inflation of PNT token.',
      ),
      discovery.getContractDetails('ERC20 Vault V1'),
      discovery.getContractDetails('UOS Vault'),
      discovery.getContractDetails(
        'PProxyAdmin',
        'Proxy owner of ERC20 Vault v2.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },

  permissions: [
    {
      name: 'PNETWORK',
      description:
        'A set of EOA addresses (different ones for different Vault contracts) that can transfer tokens and perform admin functions. It is supposed to be controlled by a group of Validator nodes in a MPC network.',
      accounts: [
        discovery.getPermissionedAccount('ERC20 Vault V2', 'PNETWORK'),
        discovery.getPermissionedAccount('ERC20 Vault V1', 'PNETWORK'),
        discovery.getPermissionedAccount('UOS Vault', 'PNETWORK'),
      ],
    },
    ...discovery.getMultisigPermission(
      'pNetwork Multisig',
      'Can upgrade ERC20 Vault V2.',
    ),
  ],

  milestones: [
    {
      name: 'Mainnet Launch of pNetwork v2',
      link: 'https://medium.com/pnetwork/ptokens-to-ptokens-bridge-now-live-8329dd93dd28',
      date: '2022-10-18T00:00:00Z',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
    },
    {
      name: 'pGALA token on BSC exploit',
      link: 'https://medium.com/pnetwork/pgala-post-mortem-measures-taken-to-safeguard-the-ecosystem-from-malicious-actors-and-recovery-6407048f4497',
      date: '2022-11-05T00:00:00Z',
      description:
        'Due to the misconfiguration of BSC the exploiter took over the control of pGALA tokens.',
    },
    {
      name: 'pBTC token on BSC exploit',
      link: 'https://medium.com/pnetwork/pnetwork-post-mortem-pbtc-on-bsc-exploit-170890c58d5f',
      date: '2021-09-21T00:00:00Z',
      description:
        'Due to the the bug in the validators code, unauthorized token transfers were processed on BTC.',
    },
    {
      name: 'pNetwork rebranding',
      link: 'https://medium.com/pnetwork/were-all-in-for-pnetwork-bdf511410cc9',
      date: '2020-09-16T00:00:00Z',
      description:
        'Provable Things, pTokens and Eidoo gets rebranded as pNetwork.',
    },
    {
      name: 'pBTC launch on Ethereum',
      link: 'https://www.coindesk.com/tech/2020/03/05/new-cross-chain-network-plans-to-bring-bitcoins-liquidity-to-the-defi-space/',
      date: '2020-03-05T00:00:00Z',
      description: 'Launch of the first pToken, pBTC on Ethereum.',
    },
  ],
}
