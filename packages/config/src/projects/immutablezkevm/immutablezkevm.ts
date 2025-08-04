import {
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('immutablezkevm')

const upgradeability = {
  upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
}

const withdrawalDelay = discovery.getContractValue<number>(
  'Bridge',
  'withdrawalDelay',
)

export const immutablezkevm: ScalingProject = {
  type: 'layer2',
  id: ProjectId('immutablezkevm'),
  capability: 'universal',
  addedAt: UnixTime(1707318380), // 2024-02-07T15:06:20Z
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Immutable zkEVM',
    slug: 'immutablezkevm',
    description:
      'Immutable zkEVM is a sidechain focused on gaming and powered by Polygon stack. It plans to eventually transition to a ZK Rollup.',
    category: 'Other',
    purposes: ['Universal'],
    links: {
      websites: ['https://immutable.com/products/immutable-zkevm'],
      documentation: ['https://docs.x.immutable.com/docs/zkEVM/overview'],
      socialMedia: ['https://twitter.com/Immutable'],
      explorers: ['https://explorer.immutable.com/'],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  chainConfig: {
    name: 'immutablezkevm',
    chainId: 13371,
    coingeckoPlatform: 'immutable',
    sinceTimestamp: UnixTime(1702962563),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.immutable.com',
        callsPerMinute: 500,
      },
    ],
  },
  config: {
    associatedTokens: ['IMX'],
    escrows: [
      {
        address: EthereumAddress('0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6'),
        sinceTimestamp: UnixTime(1702962563),
        tokens: ['IMX', 'USDC', 'ETH', 'USDT', 'GOG', 'QUEST', 'OIK'],
        premintedTokens: ['QUEST', 'OIK'],
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: DA_MODES.TRANSACTION_DATA,
  },
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
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
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
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'OwnerMultisig',
          'Multisig controlling the ProxyAdmin, potentially stealing all locked funds.',
        ),
        discovery.contractAsPermissioned(
          discovery.getContract('ProxyAdmin'),
          'Contract allowed to upgrade the Bridge, its flow rate control and the Axelar adaptor.',
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('Bridge', {
          description: 'Main escrow for tokens.',
          ...upgradeability,
        }),
        discovery.getContractDetails('RootAxelarBridgeAdaptor', {
          description: 'Axelar adaptor contract used by the bridge.',
          ...upgradeability,
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
