import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  RISK_VIEW,
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('immutablezkevm')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const withdrawalDelay = discovery.getContractValue<number>(
  'Bridge',
  'withdrawalDelay',
)

export const immutablezkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('immutablezkevm'),
  createdAt: new UnixTime(1707318380), // 2024-02-07T15:06:20Z
  badges: [Badge.VM.EVM, Badge.DA.CustomDA],
  display: {
    name: 'Immutable zkEVM',
    slug: 'immutablezkevm',
    description:
      'Immutable zkEVM is a sidechain focused on gaming and powered by Polygon stack. It plans to eventually transition to a ZK Rollup.',
    category: 'Other',
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    purposes: ['Universal'],
    links: {
      websites: ['https://immutable.com/products/immutable-zkevm'],
      apps: [],
      documentation: ['https://docs.x.immutable.com/docs/zkEVM/overview'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Immutable'],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['IMX'],
    escrows: [
      {
        address: EthereumAddress('0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6'),
        sinceTimestamp: new UnixTime(1702962563),
        tokens: ['IMX', 'USDC', 'ETH', 'USDT', 'GOG'],
        chain: 'ethereum',
      },
    ],
  },
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.EXTERNAL],
      bridge: DA_BRIDGES.NONE,
      mode: DA_MODES.TRANSACTION_DATA,
    }),
  ],
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      secondLine: `${formatSeconds(withdrawalDelay)} challenge period`,
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    stateCorrectness: {
      name: 'No state validation',
      description: `Immutable zkEVM bridge makes use of Axelar network (a Cosmos chain) to transfer assets between Ethereum and Immutable zkEVM. As in any standard Cosmos chain, validators are bonded by staking tokens and can be slashed by social consensus for misbehaviour. 

A deposit starts by a user depositing tokens on the Bridge contract and then the tokens are minted on the destination chain.

Withdrawals to Ethereum can be delayed by a predefined time with a flow rate mechanism that controls outflows of the bridge escrow. The ProxyAdmin or an address with the rate_control role can define so-called buckets for each token: Each bucket has a capacity and a refill rate. All withdrawals that exceed the tokens bucket capacity trigger the withdrawal queue, which delays subsequent withdrawals of *any* of the bridges' assets for a time defined in withdrawalDelay (currently ${formatSeconds(
        withdrawalDelay,
      )}).`,
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Axelar decide to not mint tokens after observing an event on Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: "validators relay a withdraw request that wasn't originated on the source chain.",
        },
      ],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'Multisig controlling the ProxyAdmin, potentially stealing all locked funds.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ProxyAdmin'),
      'Contract allowed to upgrade the Bridge, its flow rate control and the Axelar adaptor.',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('Bridge', {
        description: 'Main escrow for tokens.',
        ...upgradeability,
      }),
      discovery.getContractDetails('RootAxelarBridgeAdaptor', {
        description: 'Axelar adaptor contract used by the bridge.',
        ...upgradeability,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
