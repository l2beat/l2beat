import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('pulseChain')

const reqNumberOfSigs = discovery.getContractValue<number>(
  'BridgeValidators',
  'requiredSignatures',
)

const numOfValidators = discovery.getContractValue<number>(
  'BridgeValidators',
  'validatorCount',
)

export const pulseChain: Bridge = {
  type: 'bridge',
  id: ProjectId('pulseChain'),
  display: {
    name: 'PulseChain',
    slug: 'pulsechain',
    description:
      'Bridge used to transfer assets from Ethereum to PulseChain. Transfers are validated by set of trusted Validators.',
    // not sure about this
    category: 'Token Bridge',
    links: {
      websites: [
        'https://pulsechain.com/',
        'https://bridge.pulsechain.com/#/bridge',
      ],
      socialMedia: [
        'https://twitter.com/PulseChainCom',
        'https://t.me/PulseChainCom',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1715a3E4A142d8b698131108995174F37aEBA10D'),
        sinceTimestamp: new UnixTime(1684137600),
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
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to a destination chain to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Ethereum chain allowing a user to withdraw tokens from Ethereum escrow when equivalent amount of tokens has not been deposited and burned on destination chain.',
          isCritical: true,
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
      value: 'Third Party',
      description:
        'Transfers need to be signed offchain by a designed list of Validators.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: [
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
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Validators',
      description: `Permissioned set of validators that can sign off any arbitrary message from PulseChain including withdrawal request. ${reqNumberOfSigs} / ${numOfValidators} signatures\
        are required.`,
      accounts: discovery.getPermissionedAccounts(
        'BridgeValidators',
        'validatorList',
      ),
    },
    {
      name: 'Owner of Validators contract',
      description:
        'Owner of Validators contract keeping a list of current Validators. Can add/remove Validators.',
      accounts: [discovery.getPermissionedAccount('BridgeValidators', 'owner')],
    },
    {
      name: 'Upgradeability Owner of main bridge contract',
      description:
        'Owner of the main bridge contract, able to upgrade the contract with no notice.',
      accounts: [
        discovery.getPermissionedAccount(
          'ForeignOmnibridge',
          'upgradeabilityOwner',
        ),
      ],
    },
  ],
}
