import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const cBridge: Bridge = {
  type: 'bridge',
  id: ProjectId('cbridge'),
  display: {
    name: 'cBridge V2',
    slug: 'cbridge',
    description:
      'Celer is a general messaging bridge, token-bridge and a liquidity network that leverages the "state-guardian" aka SGN thats operated by validators running on Tendermint engine to perform cross-chain transactions.',
    links: {
      websites: ['https://www.celer.network/'],
      apps: ['https://cbridge.celer.network/'],
      explorers: ['https://cbridge-analytics.celer.network/'],
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
      {
        address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
        sinceTimestamp: new UnixTime(1638346811),
        tokens: ['USDC', 'WETH', 'USDT', 'MASK', 'BUSD'],
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
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Synapse Bridge is a Token Bridge that locks tokens in the escrow account and mints tokens on destination network. When bridging back to Ethereum tokens are burned on source chain and transferred back to the receiver on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in external network called SGN. Nodes in the network, called state-guardian, observe contracts on each supported chain and sign messages when everything is correct. Based on the signatures user can withdraw funds on the other end of the bridge.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: '"state-guardians" decide to stop processing certain transactions.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: '"state-guardians" allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: '"state-guardians" sign a fraudulent message allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Type of the token received on the destination chain depends on the token, if it is native to this chain user will receive canonical token. If the bridged token is not native to the destination chain then user will end up with wrapped version.',
      references: [],
      risks: [],
    },
  },
  riskView: {
    sourceUpgradeability: {
      value: 'No',
      description: 'The code that secures the system can never change',
    },
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
      {
        name: 'Bridge',
        address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
        description:
          'Main Bridge contract which is the entry point for deposits and withdrawals. The escrow locked on the Ethereum side of the bridge is held on this address.',
      },
    ],
    references: [],
    risks: [],
  },
  permissions: [
    {
      name: 'Bridge Governance',
      description:
        'The owner of the bridge is a governance contract with the permissions to manage: signers responsible for messages relaying, pausers with the ability to pause the bridge as well as governance of the system.',
      accounts: [
        {
          address: '0xF380166F8490F24AF32Bf47D1aA217FBA62B6575',
          type: 'Contract',
        },
      ],
    },
    {
      name: 'Bridge Governance voters',
      description:
        'Can vote on proposal which will be executed by the contract. Each voter holds the same voting power.',
      accounts: [
        {
          address: '0x1b9dFC56e38b0F92448659C114e2347Bd803911c',
          type: 'EOA',
        },
        {
          address: '0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9',
          type: 'EOA',
        },
        {
          address: '0xDfE4F07D1F36B8d559b25082460a4f6A72531de2',
          type: 'EOA',
        },
        {
          address: '0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823',
          type: 'EOA',
        },
        {
          address: '0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Governors',
      description:
        'Can modify bridge operational parameters such as minimal and maximal send amounts, max slippage and transfer delay.',
      accounts: [
        {
          address: '0x8e9174ed59eA4b81E70d0aE0DE13242e2329106c',
          type: 'EOA',
        },
        {
          address: '0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823',
          type: 'EOA',
        },
        {
          address: '0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9',
          type: 'EOA',
        },
        {
          address: '0x1b9dFC56e38b0F92448659C114e2347Bd803911c',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Pauser',
      description: 'Can pause and unpause the system.',
      accounts: [
        {
          address: '0x1a0aEc0fC48F1B5cc538BE74A90E340b278189e4',
          type: 'EOA',
        },
        {
          address: '0x2FB8783C14A71C08bFC1dE8Fc3D715Dd93039BF2',
          type: 'EOA',
        },
        {
          address: '0x9F6B03Cb6d8AB8239cF1045Ab28B9Df43dfCC823',
          type: 'EOA',
        },
        {
          address: '0x34dFa1226F8b3E36FE597B34eEa809a2B5c0bBf9',
          type: 'EOA',
        },
        {
          address: '0xDfE4F07D1F36B8d559b25082460a4f6A72531de2',
          type: 'EOA',
        },
        {
          address: '0x1b9dFC56e38b0F92448659C114e2347Bd803911c',
          type: 'EOA',
        },
      ],
    },
  ],
}
