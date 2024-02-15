import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('near')

export const near: Bridge = {
  type: 'bridge',
  id: ProjectId('near'),
  display: {
    name: 'Rainbow Bridge',
    slug: 'near',
    links: {
      websites: ['https://near.org/'],
      explorers: ['https://explorer.near.org/', 'https://aurorascan.dev/'],
      apps: ['https://rainbowbridge.app/'],
      repositories: ['https://github.com/aurora-is-near/rainbow-bridge'],
      socialMedia: ['https://twitter.com/auroraisnear'],
    },
    description:
      'Rainbow bridge is a light client based bridge between NEAR/AURORA and Ethereum that allows for asset and data movement between these chains. For better gas efficiency from NEAR to Ethereum, it leverages optimistic validation, which adds some trust assumption and latency.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['AURORA'],
    escrows: [
      {
        address: EthereumAddress('0x23Ddd3e3692d1861Ed57EDE224608875809e127f'),
        sinceTimestamp: new UnixTime(1615826693),
        tokens: '*',
      },
      {
        address: EthereumAddress('0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52'),
        sinceTimestamp: new UnixTime(1624579200),
        tokens: ['ETH'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'Transfers out of the bridge are validated using Optimistic Light Client of Near Chain on Ethereum. Transfers into NEAR are validated by Ethereum light client on NEAR side.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'Bridge cannot be upgraded but 3/5 Admin Multisig can move all funds out of the bridge via admin functions with no warning.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.CANONICAL_OR_WRAPPED,
      description:
        RISK_VIEW.CANONICAL_OR_WRAPPED.description +
        ' Tokens minted on AURORA do not appear to be verified on explorer.aurora.dev.', // TBC
      sentiment: 'bad',
    },
  },
  technology: {
    canonical: true,
    destination: ['Near', 'Aurora'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Rainbow is a Token Bridge that allows transferring assets and passing arbitrary messages between Ethereum, NEAR, and Aurora chains. During token transfers, Rainbow Bridge locks tokens in the escrow contracts on Ethereum and mints tokens on the Aurora or NEAR networks. When bridging back to Ethereum, tokens are burned on Aurora / NEAR and then released from the escrow on Ethereum.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Both inbound and outbound transfers are verified by the light client',
      description:
        'Near Rainbow bridge implements a light client for both inbound and outbound transfers. For inbound transfers, checkpoints of NEAR state are submitted every 4 hours. \
          These are optimistically assumed to be signed by 2/3 of Near Validators. The signatures are not immediately verified by Ethereum due to a different signature scheme \
          used on NEAR and - as a result - very high gas cost on Ethereum. If signatures are found to be invalid, checkpoints can be permissionlessly challenged. \
          Users can withdraw funds by submitting a Merkle proof of a burn event against the checkpoint. \
          For outbound transfers, Ethereum light client is implemented on NEAR and a Merkle proof of a lock event must be presented.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'incorrect checkpoint is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge administrator removes funds from the bridge escrow.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
    destinationToken: {
      name: 'Destination tokens are not verified',
      description:
        'Tokens transferred end up as ERC20 tokens on AURORA or NEAR and they do not appear to be verified.',
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
  contracts: {
    addresses: [
      discovery.getContractDetails('ERC20Locker', {
        description: 'Escrow contract for ERC20 tokens.',
      }),
      discovery.getContractDetails('EthCustodian', {
        description: 'Escrow contract for ETH tokens.',
      }),
      discovery.getContractDetails('NearProver', {
        description: 'Contract verifying merkle proofs, used for withdrawals.',
      }),
      discovery.getContractDetails('NearBridge', {
        description: 'Contract storing Near state checkpoints.',
      }),
      {
        address: EthereumAddress('0x3be7Df8dB39996a837041bb8Ee0dAdf60F767038'), // old near bridge
        name: 'NearBridge (old)',
        description: 'Contract storing Near state checkpoints.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'BridgeAdminMultisig',
      'Can pause and reconfigure the bridge with no delay, can remove all tokens from Escrow via adminTransfer() method.',
    ),
  ],
}
