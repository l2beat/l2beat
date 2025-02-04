import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../types'
import { RISK_VIEW } from './common'

const discovery = new ProjectDiscovery('near')

const threshold = discovery.getContractValue<number>(
  'BridgeAdminMultisig',
  '$threshold',
)

const owners: string[] = discovery.getContractValue<string[]>(
  'BridgeAdminMultisig',
  '$members',
)

const size = owners.length
const adminThresholdString = `${threshold} / ${size}`

const lockDurationSeconds = discovery.getContractValue<number>(
  'NearBridge',
  'lockDuration',
)

const lockDurationHours = lockDurationSeconds / 3600

const lockRequirementInWei = discovery.getContractValue<number>(
  'NearBridge',
  'lockEthAmount',
)

export const near: Bridge = {
  type: 'bridge',
  id: ProjectId('near'),
  addedAt: new UnixTime(1662628329), // 2022-09-08T09:12:09Z
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
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52'),
        sinceTimestamp: new UnixTime(1624579200),
        tokens: ['ETH'],
        chain: 'ethereum',
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
      description: `Bridge cannot be upgraded but ${adminThresholdString} Admin Multisig can move all funds out of the bridge via admin functions with no warning.`,
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
      description: `Near Rainbow bridge implements a light client for both inbound and outbound transfers. For inbound transfers, checkpoints of NEAR state are submitted every ${lockDurationHours} hours. \
          These are optimistically assumed to be signed by 2/3 of Near Validators. The signatures are not immediately verified by Ethereum due to a different signature scheme \
          used on NEAR and - as a result - very high gas cost on Ethereum. Checkpoints relayers are required to lock ${utils.formatEther(
            lockRequirementInWei,
          )} ETH in order to submit block headers. If signatures are found to be invalid, checkpoints can be permissionlessly challenged and the relayers' bond is slashed. \
          Challengers can specify an address to receive half of the slashed bond. \
          Users can withdraw funds by submitting a Merkle proof of a burn event against the checkpoint. \
          For outbound transfers, Ethereum light client is implemented on NEAR and a Merkle proof of a lock event must be presented.`,
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'incorrect checkpoint is submitted and nobody challenges it.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'bridge administrator removes funds from the bridge escrow.',
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
        },
      ],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('NearBridge', {
          description: 'Contract storing Near state checkpoints.',
        }),
        discovery.getContractDetails('NearProver', {
          description:
            'Contract verifying merkle proofs, used for withdrawals.',
        }),
        discovery.getContractDetails(
          'ERC20Locker',
          'Escrow contract for ERC20 tokens.',
        ),
        discovery.getContractDetails(
          'EthCustodian',
          'Escrow contract for ETH tokens.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'BridgeAdminMultisig',
          'Admin can pause/unpause contracts, modify contracts storage and delegate call to any contract. This allows for any arbitrary action including removal of all tokens from escrows.',
        ),
      ],
    },
  },
}
