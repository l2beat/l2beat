import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('ronin')

const operatorsCount = discovery.getPermissionedAccounts(
  'MainchainBridgeManager',
  'getBridgeOperators',
).length

const thresholdArray = discovery.getContractValue<{
  num_: number
  denom_: number
}>('MainchainGateway', 'getThreshold')

const thresholdPerc = thresholdArray.num_

const operatorsString = `${thresholdPerc}% out of ${operatorsCount}`

const paused =
  discovery.getContractValue<boolean>('MainchainGateway', 'paused') === true
const warningText = paused ? 'The bridge is currently paused.' : undefined

const pausable = {
  paused,
  pausableBy: ['MainchainGatewayV3 Sentry Account'],
}

export const ronin: Bridge = {
  type: 'bridge',
  id: ProjectId('ronin'),
  createdAt: new UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Ronin V3',
    slug: 'ronin',
    warning: warningText,
    links: {
      websites: ['https://bridge.roninchain.com/'],
      apps: ['https://bridge.roninchain.com/'],
      documentation: ['https://docs.roninchain.com/get-started'],
      explorers: ['https://explorer.roninchain.com/'],
      socialMedia: [
        'https://discord.gg/axie',
        'https://twitter.com/ronin_network',
        'https://twitter.com/SkyMavisHQ',
      ],
    },
    description:
      'Ronin Bridge V3 is the official bridge for the Axie Infinity chain (Ronin chain). It uses external validators to confirm deposits for a typical Token Bridge swap.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['AXS'],
    escrows: [
      {
        address: EthereumAddress('0x1A2a1c938CE3eC39b6D47113c7955bAa9DD454F2'), // old bridge
        sinceTimestamp: new UnixTime(1611575595),
        tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08'), // new bridge
        sinceTimestamp: new UnixTime(1655883630),
        tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'SLP', 'USDT', 'MATIC', 'LINK'],
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: `${operatorsString} operators.`,
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: `Gateway Proxy can be upgraded by ${operatorsString} operators.`,
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL,
      description:
        RISK_VIEW.CANONICAL.description +
        ' The Ronin explorer does not show contract source code!',
      sentiment: 'warning',
    },
  },
  technology: {
    destination: ['Axie Infinity Chain'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a typical Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the Ronin network. When bridging back to Ethereum tokens are burned on Ronin and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'A Ronin Bridge service watches for events on Ethereum and transmits those events to a contract on Ronin chain (Axie Infinity chain). Designated group of weighted validators vote on the validity of those events, and when acknowledged, a "representation token" is minted on the Ronin chain. To withdraw tokens, user needs to deposit them to a contract on the Ronin chain, which will generate an event to be picked by the validators. When validators acknowledge the event, they generate signature, which can be submitted to the Ethereum bridge contract to finalize the withdrawal. Ronin V2 introduced multi-tier withdrawal limits dependent on the overall value of the transaction and the token used. The higher value of transaction, the more validators need to vote to approve withdrawal request. There is a separate group of actors called "governors" who are able to change thresholds, add/remove validators and update contracts. Each validator has a corresponding weighted governor account. There is also a daily withdrawal limit. If it\'s crossed, an address from a list of "Withdrawal unlockers" needs to participate in the transaction.',
      references: [
        {
          text: 'Token withdrawals',
          href: 'https://docs.roninchain.com/apps/ronin-bridge/withdraw-token',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to not approve a token mint after observing an event on Ethereum.',
          isCritical: true,
        },
        {
          category: 'Users can be censored if',
          text: 'validators decide not to sign withdrawal requests.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'malicious validators generate signature of a fake withdrawal request.',
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: 'withdrawal limits are misconfigured.',
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens',
      description: 'Tokens transferred end up as wrapped ERC20/ERC721.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
  },
  contracts: {
    // TODO: we need all contracts (check roles on escrows) and a diagram
    addresses: [
      {
        ...discovery.getContractDetails(
          'MainchainGateway',
          `Bridge V3 contract handling deposits and withdrawals.`,
        ),
        upgradableBy: ['MainchainBridgeManager Governors'],
        upgradeDelay: 'No delay',
        pausable,
      },
      discovery.getContractDetails(
        'MainchainBridgeManager',
        `Contract storing all operators, governors and their associated weights. It is used to manage all administrative actions of the bridge.`,
      ),
      discovery.getContractDetails(
        'PauseEnforcer',
        `Contract owning the emergencyPauser role in the MainchainGateway and managing its access control.`,
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'MainchainBridgeManager Operators',
      accounts: discovery.getPermissionedAccounts(
        'MainchainBridgeManager',
        'getBridgeOperators',
      ),
      description: `List of operators that can validate incoming messages. Transfer needs to be signed by ${operatorsString} Operators.`,
    },
    {
      name: 'MainchainBridgeManager Governors',
      accounts: discovery.getPermissionedAccounts(
        'MainchainBridgeManager',
        'getGovernors',
      ),
      description: `List of governors that can update their corresponding operators, upgrade and change bridge parameters.`,
    },
    {
      name: 'RoninManagerMultiSig', // non-standard MultiSig
      accounts: [
        {
          address: discovery.getContract('RoninManagerMultiSig').address,
          type: 'MultiSig',
        },
      ],
      description:
        'Admin of the Ronin Bridge, can change Sentry Account and accounts able to unlock withdrawals. This is a non-standard MultiSig with 2 / 3 threshold.',
    },
    {
      name: 'RoninManagerMultiSig participants', // non-standard MultiSig owners
      accounts: discovery.getPermissionedAccounts(
        'RoninManagerMultiSig',
        'getOwners',
      ),

      description: 'Those are the participants of the AdminMultisig.',
    },
    ...discovery.getMultisigPermission(
      'RoninAdminMultisig',
      'Can upgrade the bridge and the MainchainBridgeManager instantly by being Admin of the latter. Can add and remove sentries (un-/pausers).',
    ),
    {
      name: 'MainchainGatewayV3 Sentry Account',
      accounts: [
        discovery.getPermissionedAccount('MainchainGateway', 'emergencyPauser'),
      ],
      description:
        'An address that can pause the bridge in case of emergency (can be another contract).',
    },
    {
      name: 'PauseEnforcer Sentries',
      accounts: discovery.getAccessControlRolePermission(
        'PauseEnforcer',
        'SENTRY_ROLE',
      ),
      description: `These accounts can pause and unpause the bridge through the PauseEnforcer.`,
    },
    {
      name: 'PauseEnforcer Admins',
      accounts: discovery.getAccessControlRolePermission(
        'PauseEnforcer',
        'DEFAULT_ADMIN_ROLE',
      ),
      description: `These accounts can add and remove sentries (bridge pause-/unpausers) in the PauseEnforcer.`,
    },
    {
      name: 'MainchainGatewayV3 Withdrawal Unlockers',
      accounts: discovery.getAccessControlRolePermission(
        'MainchainGateway',
        'WITHDRAWAL_UNLOCKER_ROLE',
      ),
      description: 'Addresses that can unlock withdrawals.',
    },
  ],
  milestones: [
    {
      name: 'Whitehat hack for $12M',
      date: '2024-08-06T00:00:00Z',
      link: 'https://x.com/Ronin_Network/status/1820804772917588339',
      type: 'incident',
    },
    {
      name: 'Ronin bridge hacked for ~$625M',
      date: '2022-03-23T00:00:00Z',
      link: 'https://web.archive.org/web/20230518085104/https://blog.roninchain.com/p/back-to-building-ronin-security-breach',
      type: 'incident',
    },
  ],
}
