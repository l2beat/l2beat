import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('cbridge')

export const cBridge: Bridge = {
  type: 'bridge',
  id: ProjectId('cbridge'),
  display: {
    name: 'cBridge (Celer)',
    slug: 'cbridge',
    description:
      'Celer cBridge offers cross-chain token bridging in two modes: Token Bridge and Liquidity Network. It also offers AMB facility - ability to pass arbitrary\
      messages across chains. It leverages the "State Guardian Network" aka SGN to perform cross-chain communication.\
      For Liquidity Network, liquidity providers need to rely on SGN to remove their funds from the network.',
    category: 'Hybrid',
    links: {
      websites: ['https://www.celer.network/'],
      apps: ['https://cbridge.celer.network/'],
      explorers: [
        'https://cbridge-analytics.celer.network/',
        'https://celerscan.com/',
      ],
      documentation: ['https://cbridge-docs.celer.network/'],
      repositories: ['https://github.com/celer-network'],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  config: {
    escrows: [
      // liquidity pool
      {
        address: EthereumAddress('0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820'),
        sinceTimestamp: new UnixTime(1638346811),
        tokens: ['ETH', 'USDC', 'WETH', 'USDT', 'MASK', 'BUSD', 'LYRA'],
      },
      // token bridge v1
      {
        address: EthereumAddress('0xB37D31b2A74029B5951a2778F959282E2D518595'),
        sinceTimestamp: new UnixTime(1639553135),
        tokens: [
          'USDC',
          'WETH',
          'USDT',
          'FRAX',
          'DAI',
          'RLY',
          'WBTC',
          'CELR',
          'FXS',
          'WXT',
        ],
      },
      // token bridge v2
      {
        address: EthereumAddress('0x7510792A3B1969F9307F3845CE88e39578f2bAE1'),
        sinceTimestamp: new UnixTime(1651661389),
        tokens: ['WETH', 'PSTAKE'],
      },
    ],
  },
  technology: {
    destination: [
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Arbitrum',
      'Optimism',
      'Fantom',
      'Gnosis Chain',
      'Metis',
      'Boba Network',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Celer cBridge is a hybrid solution able to work in two modes: Token Bridge and Liquidity Network, depending on the token and destination chain. More information is provided in Destination Tokens section.',
      references: [
        {
          text: 'Bridging models',
          href: 'https://cbridge-docs.celer.network/introduction/fungible-token-bridging-models',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'validators (SGN) decide to not process a withdrawal request from liquidity providers.',
          isCritical: true,
        },
      ],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in an external network called SGN that is operated by validators running on Tendermint consensus protocol. Nodes in the network observe contracts on each supported chain and sign messages when everything is correct. Based on the signature user can withdraw funds from the bridge.',
      references: [
        {
          text: 'State Guardian Network (SGN)',
          href: 'https://cbridge-docs.celer.network/introduction/state-guardian-network',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators (SGN) decide to stop processing certain transactions.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators (SGN) allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators (SGN) sign a fraudulent message allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Celer cBridge works in two token bridging models: xAsset and xLiquidity. xAsset model, the canonical mapping bridge, is intended for a token that is deployed on Ethereum but is not deployed on the destination chain. In this case cBridge will deploy a mapped version of the token on destination via lock-mint model. xLiquidity model, the pool-based bridge, is intended for token already deployed on Ethereum and destination. When users transfer between these chains they will be depositing their tokens into the pool on Ethereum and withdrawing a matching number of tokens from the pool on the destination chain based on a bridge rate generated by the StableSwap price curve. Additionally, it is worth pointing out that Celer introduced xAsset V2, the standard allowing for seamless cross-chain bridged assets transfers, without the need to return to source chain for liquidity. It is accomplished by changing the lock-mint model from V1 to burn-mint model in V2. What is more, Celer introduced "Open Canonical Token Bridge Standard" aiming to prevent bridge vendor lock-in.',
      references: [
        {
          text: 'Bridging models',
          href: 'https://cbridge-docs.celer.network/introduction/fungible-token-bridging-models',
        },
        {
          text: 'Open Canonical Token Bridge Standard',
          href: 'https://blog.celer.network/2021/12/13/say-no-to-vendor-lock-in-calling-for-an-open-canonical-token-bridge-standard/',
        },
        {
          text: 'xAsset V2',
          href: 'https://blog.celer.network/2022/06/02/celer-cbridge-launches-xasset-v2-to-support-omni-directional-cross-chain-transfers-for-bridged-tokens/',
        },
        {
          text: 'StableSwap',
          href: 'https://curve.fi/files/stableswap-paper.pdf',
        },
      ],
      risks: [],
    },
  },
  riskView: {
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be signed by external actors set by the governance.',
      sentiment: 'bad',
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'MessageBus',
        'Contract providing cross-chain AMB facility. It connects with Liquidity Network and Token Bridges to processes certain types of messages.',
      ),
      discovery.getContractDetails(
        'Liquidity Network',
        'Contract providing cross-chain swaps, allows user to deposit funds and withdraw them. Additionally user can add liquidity to this address to generate yield.',
      ),
      discovery.getContractDetails(
        'OriginalTokenVault',
        'Contract serving as token bridge, user can deposit funds and later withdraw them from this escrow.',
      ),
      discovery.getContractDetails(
        'OriginalTokenVaultV2',
        'Contract serving as token bridge, user can deposit funds and later withdraw them from this escrow.',
      ),
      discovery.getContractDetails(
        'PeggedTokenBridge',
        'Contract minting/burning tokens when receiving a message from Token Bridge.',
      ),
      discovery.getContractDetails(
        'PeggedTokenBridgeV2',
        'Contract minting/burning tokens when receiving a message from Token Bridge.',
      ),
      discovery.getContractDetails(
        'TransferAgent',
        'Routing contract that transfers assets cross-chain using either Liquidity Network or Token Bridge.',
      ),
    ],
    references: [],
    risks: [],
  },
  permissions: [
    {
      name: 'Bridge Governance',
      description:
        'The owner of the main bridge contract, can update bridge parameters such as Token Bridge and Liquidity Network addresses.',
      accounts: [discovery.getPermissionedAccount('MessageBus', 'owner')],
    },
    {
      name: 'Bridge Governance (2)',
      description:
        'The owner of the Token Bridge, Liquidity Network and Transfer Agent is a governance contract with the permissions to manage: signers responsible for messages relaying, pausers with the ability to pause the bridge as well as governance of the system.',
      accounts: [
        discovery.getPermissionedAccount('OriginalTokenVaultV2', 'owner'),
      ],
    },
    {
      name: 'Governors',
      description:
        'Can modify bridge operational parameters such as minimal and maximal send amounts, max slippage and transfer delay.',
      accounts: discovery.getPermissionedAccounts(
        'Liquidity Network',
        'governors',
      ),
    },
    {
      name: 'Pausers',
      description: 'Can pause and unpause the system.',
      accounts: discovery.getPermissionedAccounts(
        'Liquidity Network',
        'pausers',
      ),
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How HTLC bridge works?',
      url: 'https://twitter.com/bkiepuszewski/status/1437031523455229964',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'cBridge deep dive',
      url: 'https://li.fi/knowledge-hub/cbridge-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
