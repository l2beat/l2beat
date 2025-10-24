import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('pulseChain')

const reqNumberOfSigs = discovery.getContractValue<number>(
  'BridgeValidators',
  '$threshold',
)

const numOfValidators = discovery.getContractValue<number>(
  'BridgeValidators',
  'validatorCount',
)

export const pulseChain: Bridge = {
  type: 'bridge',
  id: ProjectId('pulseChain'),
  addedAt: UnixTime(1684347955), // 2023-05-17T18:25:55Z
  display: {
    name: 'PulseChain',
    slug: 'pulsechain',
    description:
      'Bridge used to transfer assets from Ethereum to PulseChain. Transfers are validated by set of trusted Validators.',
    // not sure about this
    category: 'Single-chain',
    links: {
      websites: [
        'https://pulsechain.com/',
        'https://bridge.pulsechain.com/#/bridge',
      ],
      socialMedia: [
        'https://twitter.com/PulseChainCom',
        'https://t.me/PulseChainCom',
      ],
      explorers: ['https://ipfs.scan.pulsechain.com'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x1715a3E4A142d8b698131108995174F37aEBA10D',
        ),
        sinceTimestamp: UnixTime(1684137600),
        tokens: '*',
      }),
    ],
  },
  technology: {
    destination: ['PulseChain'],
    validation: {
      name: 'Validation',
      description:
        'PulseChain Bridge stores a number of Validators which need to sign off every message coming from the PulseChain. Once quorum of signatures is \
        reached, message (e.g. withdrawal request) can be relayed to a destination contract.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to not pass selected messages between chains.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to a destination chain to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Ethereum chain allowing a user to withdraw tokens from Ethereum escrow when equivalent amount of tokens has not been deposited and burned on destination chain.',
        },
        {
          category: 'Funds can be frozen if',
          text: "validators don't relay messages between chains.",
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: `Multisig (${discovery.getMultisigStats('BridgeValidators')})`,
      description: `${discovery.getMultisigStats('BridgeValidators')} BridgeValidators Multisig. Identities of the signers are not publicly disclosed.`,
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: 'EOA',
        description: 'Critical contracts can be upgraded by an EOA.',
        sentiment: 'bad',
      },
      pause: {
        value: 'EOA',
        sentiment: 'bad',
        description:
          'Although there is no formal pause function, the liveness of the bridge depends on the Multisig and operators.',
      },
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'ForeignOmnibridge',
          'The main Bridge contract and the escrow for the PulseChain bridge. It is used to deposit tokens to the bridge.',
        ),
        discovery.getContractDetails(
          'ForeignAMB',
          'The Arbitrary Message Bridge receiving messages from the Foreign Chain. It is used for processing withdrawals from the bridge.',
        ),
        discovery.getContractDetails(
          'BridgeValidators',
          'Contract managing the list of trusted bridge Validators.',
        ),
        discovery.getContractDetails(
          'WETHOmnibridgeRouter',
          'The Auxiliary contract that handles wrapped tokens.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'BridgeValidators',
          discovery.getPermissionedAccounts('BridgeValidators', '$members'),
          `Permissioned set of validators that can sign off any arbitrary message from PulseChain including withdrawal request. ${reqNumberOfSigs} / ${numOfValidators} signatures are required.`,
        ),
        discovery.getPermissionDetails(
          'Owner of Validators contract',
          discovery.getPermissionedAccounts('BridgeValidators', 'owner'),
          'Owner of Validators contract keeping a list of current Validators. Can add/remove Validators.',
        ),
        discovery.getPermissionDetails(
          'Upgradeability Owner of main bridge contract',
          discovery.getPermissionedAccounts(
            'ForeignOmnibridge',
            'upgradeabilityOwner',
          ),
          'Owner of the main bridge contract, able to upgrade the contract with no notice.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
