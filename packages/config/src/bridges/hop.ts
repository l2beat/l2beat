import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { NUGGETS } from '../layer2s'
import { Bridge } from './types'

export const hop: Bridge = {
  type: 'bridge',
  id: ProjectId('hop'),
  display: {
    name: 'Hop',
    slug: 'hop',
    links: {
      websites: ['https://hop.exchange/'],
      repositories: ['https://github.com/hop-protocol'],
      socialMedia: [
        'https://twitter.com/HopProtocol',
        'https://medium.com/hop-protocol',
      ],
    },
    description:
      'Hop is a Liquidity Network that facilitates fast withdrawals and L2-->L2 token transfer via optimistic message passing.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a'),
        sinceTimestamp: new UnixTime(1623907245),
        tokens: ['USDC'],
      },
      {
        address: EthereumAddress('0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1'),
        sinceTimestamp: new UnixTime(1631654328),
        tokens: ['DAI'],
      },
      {
        address: EthereumAddress('0x3E4a3a4796d16c0Cd582C382691998f7c06420B6'),
        sinceTimestamp: new UnixTime(1626739308),
        tokens: ['USDT'],
      },
      {
        address: EthereumAddress('0xb8901acB165ed027E32754E0FFe830802919727f'),
        sinceTimestamp: new UnixTime(1633066189),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2'),
        sinceTimestamp: new UnixTime(1628225875),
        tokens: ['MATIC'],
      },
      {
        address: EthereumAddress('0x914f986a44AcB623A277d6Bd17368171FCbe4273'),
        sinceTimestamp: new UnixTime(1663897247),
        tokens: ['HOP'],
      },
      {
        address: EthereumAddress('0x893246FACF345c99e4235E5A7bbEE7404c988b96'),
        sinceTimestamp: new UnixTime(1664398079),
        tokens: ['SNX'],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Polygon', 'Gnosis', 'Optimism', 'Arbitrum'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Hop is a Liquidity Network with ability to facilitate fast transfers using Ethereum as a settlement layer. It uses a technical hToken and AMM between hToken and canonical token on \
        a destination chain to facilitate token transfers. Users are isolated from individual risks related to destination chains.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Optimistic Validation with fallback to native bridge',
      description:
        'Messages announcing token withdrawals are sent from the source to the destination chain using native AMB (Arbitrary Messaging Bridge) to Ethereum for a given chain source chain. Depending on a chain, these\
        can be slow, e.g. 7-days for Optimistic Rollups. Designated actors called Bonders "pre-announce" the incoming transfer of a message bundle to the destination chain. For 24 hours anyone\
        can challenge the validity of the message bundle. If left unchallenged, the bundle is assumed to be valid and Bonder can remove the collateral which make all withdrawals\
        from this bundle to settle against bridge funds. If challenged, the Bonder\'s collateral is locked in a bridge until the native message arrives and challenge is resolved.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'AMB of the destination chain censors the message.',
          isCritical: false,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'Bonder submits invalid message bundle and is left unchallenged for 24 hours.',
          isCritical: false,
          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens are upgradeable',
      description:
        'Tokens transferred end up as "representation tokens" some of them may be upgradable.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'Messages are relayed to the destination chain and assumed to be correct unless challenged within the 24 hour fraud proof window.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'No',
      description: 'The code that secures the system can never change.',
    },
    destinationToken: {
      value: 'Canonical',
      description:
        'The bridge uses a technical hToken that is minted for Liquidity Providers. The hToken is then swapped for  canonical tokens on the destination chain',
    },
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a'),
        name: 'L1_ERC20_Bridge',
        description: 'USDC Bridge.',
      },
      {
        address: EthereumAddress('0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1'),
        name: 'L1_ERC20_Bridge',
        description: 'DAI Bridge.',
      },
      {
        address: EthereumAddress('0x3E4a3a4796d16c0Cd582C382691998f7c06420B6'),
        name: 'L1_ERC20_Bridge',
        description: 'USDT Bridge.',
      },
      {
        address: EthereumAddress('0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2'),
        name: 'L1_ERC20_Bridge',
        description: 'MATIC Bridge.',
      },
      {
        address: EthereumAddress('0xb8901acB165ed027E32754E0FFe830802919727f'),
        name: 'L1_ETH_Bridge',
        description: 'ETH Bridge.',
      },
      {
        address: EthereumAddress('0x914f986a44AcB623A277d6Bd17368171FCbe4273'),
        name: 'L1_HOP_Bridge',
        description: 'HOP Bridge.',
      },
      {
        address: EthereumAddress('0x893246FACF345c99e4235E5A7bbEE7404c988b96'),
        name: 'L1_ERC20_Bridge',
        description: 'SNX Bridge.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x22e3F828b3f47dAcFACd875D20bd5cc0879C96e7',
          ),
          type: 'Contract',
        },
      ],
      name: 'Timelock for Hop Governance',
      description:
        'Sets bridge parameters including bond size, challenge period length, etc... Manages whitelist of Bonders.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x9f8d2dafE9978268aC7c67966B366d6d55e97f07',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x404c2184a4027b0092C5877BC4599099cd63E62D',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xEb34e93f90fa76c865112F4596eAb65D6F0d2F62',
          ),
          type: 'EOA',
        },
      ],
      name: 'Hop MultiSig Participants',
      description: 'Participants of the 2/3 Hop MultiSig.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Hop protocol deep dive',
      url: 'https://li.fi/knowledge-hub/hop-a-deep-dive/',
      thumbnailUrl: NUGGETS.LIFI_THUMBNAIL,
    },
    {
      title: 'How Hop protocol works?',
      url: 'https://twitter.com/bkiepuszewski/status/1437320613358673922',
      thumbnailUrl: NUGGETS.BARTEK_TWITTER_THUMBNAIL,
    },
    {
      title: 'How HTLC bridge works?',
      url: 'https://twitter.com/bkiepuszewski/status/1437031523455229964',
      thumbnailUrl: NUGGETS.BARTEK_TWITTER_THUMBNAIL,
    },
  ],
}
