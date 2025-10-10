import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('hop')

export const hop: Bridge = {
  type: 'bridge',
  id: ProjectId('hop'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Hop',
    slug: 'hop',
    category: 'Liquidity Network',
    links: {
      websites: ['https://hop.exchange/'],
      repositories: ['https://github.com/hop-protocol'],
      socialMedia: [
        'https://twitter.com/HopProtocol',
        'https://medium.com/hop-protocol',
        'https://discord.com/invite/PwCF88emV4',
      ],
    },
    description:
      'Hop is a Liquidity Network that facilitates fast withdrawals and L2-->L2 token transfer via optimistic message passing.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a'),
        sinceTimestamp: UnixTime(1623907245),
        tokens: ['USDC'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1'),
        sinceTimestamp: UnixTime(1631654328),
        tokens: ['DAI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x3E4a3a4796d16c0Cd582C382691998f7c06420B6'),
        sinceTimestamp: UnixTime(1626739308),
        tokens: ['USDT'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xb8901acB165ed027E32754E0FFe830802919727f'),
        sinceTimestamp: UnixTime(1633066189),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x22B1Cbb8D98a01a3B71D034BB899775A76Eb1cc2'),
        sinceTimestamp: UnixTime(1628225875),
        tokens: ['MATIC'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x914f986a44AcB623A277d6Bd17368171FCbe4273'),
        sinceTimestamp: UnixTime(1663897247),
        tokens: ['HOP'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x893246FACF345c99e4235E5A7bbEE7404c988b96'),
        sinceTimestamp: UnixTime(1664398079),
        tokens: ['SNX'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
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
    destinationToken: {
      value: 'Canonical',
      description:
        'The bridge uses a technical hToken that is minted for Liquidity Providers. The hToken is then swapped for  canonical tokens on the destination chain',
      sentiment: 'good',
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('USDC Bridge'),
        discovery.getContractDetails('DAI Bridge'),
        discovery.getContractDetails('USDT Bridge'),
        discovery.getContractDetails('ETH Bridge'),
        discovery.getContractDetails('MATIC Bridge'),
        discovery.getContractDetails('WBTC Bridge'),
        discovery.getContractDetails('SNX Bridge'),
        discovery.getContractDetails('HOP Bridge'),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Hop Multisig',
          'Sets bridge parameters including bond size, challenge period length, etc... Manages whitelist of Bonders.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
