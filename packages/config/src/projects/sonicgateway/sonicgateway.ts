import {
  assert,
  ChainSpecificAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('sonicgateway')

// we are assuming each validator still has 100 weight, see discovery for the data/config
assert(
  discovery.getContractValue<number>(
    'ValidatorsRegistry',
    'lastValidatorId',
  ) === 8 &&
    discovery.getContractValue<number>('ValidatorsRegistry', 'getQuorum') ===
      533,
  'Update the threshold info (also check discovery config for hardcoded validator addresses).',
)
const validatorThresholdString = '6/8'
const timeUntilDeadString = discovery.getContractValue<string>(
  'TokenDeposit',
  'TimeUntilDead',
)
const heartBeatInterval = discovery.getContractValue<number>(
  'UpdateManager',
  'heartbeat',
)
const fastLaneFee =
  discovery.getContractValue<number>('UpdateManager', 'fastLaneFee') / 1e18

export const sonicgateway: Bridge = {
  type: 'bridge',
  id: ProjectId('sonicgateway'),
  addedAt: UnixTime(1738059875), // 2025-01-28T10:24:35+00:00
  display: {
    name: 'Sonic Gateway',
    slug: 'sonicgateway',
    links: {
      websites: ['https://gateway.soniclabs.com/'],
      documentation: ['https://docs.soniclabs.com/sonic/sonic-gateway'],
      explorers: [],
      bridges: ['https://gateway.soniclabs.com/ethereum/sonic/s'],
      repositories: [],
      socialMedia: [
        'https://x.com/SonicLabs',
        'https://t.me/SonicAnnouncements',
        'https://discord.gg/3Ynr2QDSnB',
        'https://reddit.com/r/0xSonic/',
      ],
    },
    description:
      'The Sonic Gateway is a token bridge built for token transfers between Ethereum and Sonic. It has a quasi-symmetrical design for two-way bridging but converts Ethereum-locked FTM into S on Sonic.',
    category: 'Single-chain',
  },
  config: {
    associatedTokens: ['FTM'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20',
        ),
        tokens: [
          'FTM',
          'USDT',
          'USDC',
          'EURC',
          'WETH',
          'DOLA',
          'Silo',
          'UNI',
          'CRV',
        ],
        description:
          'This is the central escrow that locks tokens on the Ethereum side of the Sonic Gateway.',
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: `Multisig (${validatorThresholdString})`,
      description: `${validatorThresholdString} Validators with onchain signer addresses. Identities of the signers are not publicly disclosed.`,
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: `Multisig (${discovery.getMultisigStats('SonicGatewayMultisig')})`,
        description: `Critical contracts can be upgraded by the ${discovery.getMultisigStats('SonicGatewayMultisig')} SonicGatewayMultisig`,
        sentiment: 'bad',
      },
      pause: {
        value: 'Not pausable',
        sentiment: 'good',
        description:
          "There is no pause function in the bridge's smart contract.",
      },
    },
    livenessFailure: {
      value: 'Reclaim funds',
      description: `If the operators do not service the bridge, deposited funds do not arrive at the destination chain but can be reclaimed on the source chain after ${timeUntilDeadString}.`,
      sentiment: 'warning',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Sonic'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description: `
This is a standard Token Bridge that locks tokens in the escrow contract on Ethereum and mints tokens on Sonic. Permissioned relayers need to periodically update the state root in the StateOracle on both sides of the bridge. Referencing the latest state root, a user can then prove their deposit at the destination bridge contract using a merkle proof and receive their tokens. Each state root update must be signed by at least ${validatorThresholdString} validators. The permissioned validator set can be changed with each state update as long as it is signed by ${validatorThresholdString} of the current validator set.

For the special case of the S token (gas token on Sonic), there is an adapter contract on the Sonic side that escrows S and unlocks the tokens for incoming bridge transactions. The FTM token on the Ethereum side is mapped to the S token on Sonic, which means the token gets 'converted' when bridged in either direction. Since new S or FTM cannot be minted by the bridge, there is a limit to how much can be bridged either way. For other supported tokens, this is not the case because they can be minted on Sonic.

State updates are expected regularly (currently every ${heartBeatInterval} Sonic blocks) and can be fast-tracked by paying a fee of ${fastLaneFee} ETH. The state updates are not enforced and only Relayers are permitted to update. The bridge has a liveness self-check that sets the bridge status to 'dead' after a predefined period of ${timeUntilDeadString} in which no new state updates have arrived. In the 'dead' state, users can re-claim their deposits on the source chain side and withdraw based on the latest available state root on the destination chain side.`,
      references: [
        {
          title: 'Sonic Documentation: Sonic Gateway',
          url: 'https://docs.soniclabs.com/sonic/sonic-gateway',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description: `All bridge transfers are encoded in state updates that must be relayed and signed by at least ${validatorThresholdString} validators. These validators are unrelated to the consensus validators of the Sonic network. The validators are permissioned actors and can be changed with each state update.`,
      references: [
        {
          title: 'ValidatorsRegistry contract: function verifyUpdate()',
          url: 'https://etherscan.io/address//0x72965045A6691E5A74299D1e878f303264D4D910#code#F1#L74',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'relayers or validators decide to stop processing certain transactions.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators allow to mint more tokens than there are locked on Ethereum, preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators sign a fraudulent message allowing themselves to withdraw all locked funds.',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'The type of token received on the destination chain depends on the token: If it is native to this chain, the user will receive the canonical token. If the bridged token is not native to the destination chain the user will receive a minted version. The token contract in this case is called MintedErc20 and is upgradeable.',
      references: [
        {
          title: 'MintedErc20 contract implementation',
          url: 'https://sonicscan.org/address/0xffe007336904a5a2c8d6e3c685f2b1d132b864c8#code',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the destination token contract is maliciously upgraded.',
        },
      ],
    },
  },

  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },

  permissions: generateDiscoveryDrivenPermissions([discovery]),
  milestones: [
    {
      title: 'Sonic introduces Sonic Gateway',
      date: '2024-09-18T00:00:00.00Z',
      url: 'https://blog.soniclabs.com/sonic-gateway-decentralized-trustless-bridge/',
      description: 'Sonic officially launches the Sonic Gateway.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
