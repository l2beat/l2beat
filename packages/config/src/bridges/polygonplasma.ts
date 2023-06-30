import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { polygonpos } from './polygonpos'
import { Bridge } from './types'

export const polygonplasma: Bridge = {
  type: 'bridge',
  id: ProjectId('polygon-plasma'),
  display: {
    name: 'Polygon "Plasma"',
    slug: 'polygon-plasma',
    links: polygonpos.display.links,
    description:
      'Polygon Plasma is the official bridge provided by the Polygon team to bridge MATIC tokens from Ethereum to Polygon chain. Originally it was also used to bridge DAI, but now Polygon PoS bridge is recommended. Tokens are bridged to the same Polygon sidechain as if Polygon PoS bridge was used, the only difference is a required 7-day withdrawal delay. This delay was originally designed to allow users to challenge the withdrawal, however this functionality is not deployed.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['MATIC'],
    escrows: [
      {
        address: EthereumAddress('0x401F6c983eA34274ec46f84D70b31C151321188b'),
        sinceTimestamp: new UnixTime(1590850640),
        tokens: ['MATIC', 'DAI'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: '48 hours delay',
      description:
        'The bridge can be upgraded by 5/9 MSig after 48 hour delay.',
      sentiment: 'warning',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('MATIC'),
  },
  technology: {
    destination: ['Polygon'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a very typical Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the Polygon network. When bridging back to Ethereum tokens are burned on Polygon and then released from the escrow on Ethereum. The withdrawal process includes 7-day delay.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Outbound transfers are externally verified, inbound require merkle proof',
      description:
        'Validators on the Polygon network watch for events on Ethereum and when they see that tokens have been locked they mint new tokens on Polygon. Every 30 minutes validators submit new Polygon state checkpoints to the Ethereum smart contracts. To withdraw tokens users need to present a merkle proof of a burn event that is verified against the checkpoints.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Polygon decide to not mint tokens after observing an event on Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'If MATIC ERC20 token is bridged, the native MATIC token is minted on Polygon sidechain.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x401F6c983eA34274ec46f84D70b31C151321188b'),
        name: 'Deposit Manager',
        description: 'Escrow contract for MATIC and DAI.',
        upgradeability: {
          type: 'Custom',
          implementation: EthereumAddress(
            '0xDdaC6D3A2a787b1F4bf26AB6FAF519ae3F1a94cf',
          ),
          admin: EthereumAddress('0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf'),
        },
      },
      {
        address: EthereumAddress('0x2A88696e0fFA76bAA1338F2C74497cC013495922'),
        name: 'Withdraw Manager',
        description:
          'Contract handling completion of user withdrawal requests after the 7-day delay.',
        upgradeability: {
          type: 'Custom',
          implementation: EthereumAddress(
            '0x4ef5123a30e4CFeC02B3E2F5Ce97F1328B29f7de',
          ),
          admin: EthereumAddress('0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf'),
        },
      },
      {
        address: EthereumAddress('0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95'),
        name: 'ERC20PredicateBurnOnly',
        description:
          'Contract allowing users to start the withdrawal process. It should also exit challenges, however with empty verifyDeprecation() method no challenges are supported.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('48 hours')],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xFa7D2a996aC6350f4b56C043112Da0366a59b74c',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'Polygon MultiSig',
      description:
        'Can propose and execute code upgrades on escrows via Timelock contract.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x39415255619783A2E71fcF7d8f708A951d92e1b6',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xFb9af163DF1e54171bC773eb88B46aa1E912489f',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xb771380f912E4b5F6beDdf81314C383c13F16ab5',
          ),
          type: 'EOA',
        },
      ],
      name: 'MultiSig Participants',
      description: 'Participants of the 5/9 Polygon MultiSig.',
    },
  ],
}
