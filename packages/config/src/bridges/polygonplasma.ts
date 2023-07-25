import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { formatSeconds } from '../utils/formatSeconds'
import { RISK_VIEW } from './common'
import { polygonpos } from './polygonpos'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('polygon-plasma')

const delayString = formatSeconds(
  discovery.getContractValue('Timelock', 'getMinDelay'),
)

const upgrades = {
  upgradableBy: ['PolygonMultisig'],
  upgradeDelay: delayString,
}

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
      value: `${delayString} delay`,
      description: `The bridge can be upgraded by the PolygonMultisig after a delay of ${delayString}.`,
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
        'This is a very typical Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the Polygon network. When bridging back to Ethereum tokens are burned on Polygon and then released from the escrow on Ethereum. There is no exit delay since the challenge system is not implemented.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Outbound transfers are externally verified, inbound require merkle proof',
      description:
        'Validators on the Polygon network watch for events on Ethereum and when they see that tokens have been locked they mint new tokens on Polygon. Validators periodically submit new Polygon state checkpoints to the Ethereum smart contracts. To withdraw tokens users need to present a merkle proof of a burn event that is verified against the checkpoints.',
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
        'If the MATIC ERC20 token is bridged, the native MATIC token is minted on Polygon sidechain.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'StateSender',
        'Smart contract containing the logic for syncing the state of registered bridges.',
      ),
      discovery.getContractDetails('RootChain', {
        description:
          'Contract storing Polygon sidechain checkpoints. Note that the validity of the checkpoints is not verified, it is assumed to be valid if signed by 2/3 of the Polygon Validators.',
        ...upgrades,
      }),
      discovery.getContractDetails('DepositManager', {
        description: 'Contract used to deposit ETH, ERC20 or ERC721 tokens.',
        ...upgrades,
      }),
      discovery.getContractDetails('WithdrawManager', {
        description: "Contract handling users' withdrawal finalization.",
        ...upgrades,
      }),
      discovery.getContractDetails('ERC20PredicateBurnOnly', {
        description:
          'Contract used to initiate ERC20 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
      }),
      discovery.getContractDetails('ERC721PredicateBurnOnly', {
        description:
          'Contract used to initiate ERC721 token withdrawals. The function to handle Plasma proofs is empty, meaning exits cannot be challenged.',
      }),
      discovery.getContractDetails('Registry', {
        description:
          'Contract mantaining the addresses of the contracts used in the system.',
      }),
      discovery.getContractDetails('StakeManager', {
        description:
          'Contract managing the staker network and that checks checkpoints signatures.',
        ...upgrades,
      }),
      discovery.getContractDetails('Governance', {
        description:
          'Contract used to manage permissions in the system. It consists of a single owner: the PolygonMultisig.',
        ...upgrades,
      }),
      discovery.getContractDetails('EventsHub', {
        description: 'Contains events used by other contracts.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'StakingInfo',
        'Contains logging and getter functions regarding the staking network.',
      ),
      discovery.getContractDetails(
        'ValidatorShareFactory',
        'Contract used to create ValidatorShare contracts.',
      ),
      discovery.getContractDetails(
        'ValidatorShare',
        'Contract used to delegate to a validator.',
      ),
      discovery.getContractDetails(
        'ExitNFT',
        'NFTs used to represent an exit.',
      ),
      discovery.getContractDetails('SlashingManager'),
      discovery.getContractDetails('ChildChain'),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('48 hours')],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'PolygonMultisig',
      'Can propose and execute code upgrades via Timelock contract.',
    ),
  ],
}
