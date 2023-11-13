import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
} from './common'
import { RISK_VIEW } from './common/riskView'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantle')

const upgradesAddressManager = {
  upgradableBy: ['OwnerMultisig'],
  upgradeDelay: 'No delay',
  upgradeConsiderations:
    'The AddressManager can be used to replace this contract.',
}

const regularUpgrades = {
  upgradableBy: ['OwnerMultisig'],
  upgradeDelay: 'No delay',
}

const TssThreshold = discovery.getContractValue<
  [number, number, string, string[]]
>('TssGroupManager', 'getTssGroupInfo')
const TssGroup = `${TssThreshold[1]} / ${TssThreshold[3].length}`

export const mantle: Layer2 = {
  type: 'layer2',
  id: ProjectId('mantle'),
  display: {
    name: 'Mantle',
    slug: 'mantle',
    warning:
      'Fraud proof system is currently disabled. Slashing conditions for MantleDA are currently disabled. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'Mantle is an EVM compatible Optimium that has been designed for use on the Ethereum network, based on the Optimism OVM architecture.\
      It has a modular architecture trying to leverage EigenDA as Data Availability layer and Specular Network fraud proof system for fraud proofs.\
      Note that as currently both of these technologies are yet to be fully launched on mainnet, Mantle needs to be considered "under development".\
      Additionally Mantle uses a set of nodes that are required to co-sign state roots via TSS (Threshold Signature Scheme). This component is\
      intended to be eventually run by third parties, and act as an independent check on state validity prior to batch submission.',
    purpose: 'Universal',
    category: 'Optimium',
    provider: 'OVM',
    links: {
      websites: ['https://www.mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['MNT'],
    escrows: [
      {
        // L1StandardBridge
        address: EthereumAddress('0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012'),
        sinceTimestamp: new UnixTime(1687954103),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://rpc.mantle.xyz',
      callsPerMinute: 1500,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL,
      description:
        RISK_VIEW.DATA_EXTERNAL.description +
        ' MantleDA contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions. DA fraud proof mechanism is not live yet.',
      sources: [
        {
          contract: 'EigenDataLayerChain',
          references: [
            // The contract that is supposed to perfrom the signature check is not verified!
            'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L328',
            'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L395', // dummy proveFraud function
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'L1CrossDomainMessenger',
          references: [
            'https://etherscan.io/address/0x676A795fe6E43C17c668de16730c3F690FEB7120#code',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      description:
        RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1.description +
        ' The operators can also reset the batch index, effectively removing transactions from the chain from a certain point onwards.',
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L210',
          ],
        },
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L539',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'StateCommitmentChain',
          references: [
            'https://etherscan.io/address/0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa#code#F1#L111', // isCollateralized call
            'https://etherscan.io/address/0x31aBe1c466C2A8b95fd84258dD1471472979B650#code#F1#L31', // dummy isCollateralized function
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('MNT'),
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately Mantle will use fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots. Deriving the chain is based on data held externally by team, so it might not be possible to detect frauds, even offchain.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'StateCommitmentChain.sol#L140 - Etherscan source code, permissioned state root deletion function without fraud proof',
          href: 'https://etherscan.io/address/0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa#code#F1#L140',
        },
        {
          text: 'Fraud proofs are not live - Mantle documentation',
          href: 'https://docs.mantle.xyz/network/for-validators/network-roles#rollup-verifiers-replica-nodes',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
      references: [
        {
          text: 'EigenDataLayerChain.sol#L308 - Etherscan source code, confirmData function',
          href: 'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L308',
        },
        {
          text: 'EigenDataLayerChain.sol#L328 - Etherscan source code, signature verification check contract is not verified',
          href: 'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L328',
        },
        {
          text: 'EigenDataLayerChain.sol#L395 - Etherscan source code, dummy proveFraud function',
          href: 'https://etherscan.io/address/0xDF401d4229Fc6cA52238f7e55A04FA8EBc24C55a#code#F1#L395',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'CanonicalTransactionChain.sol#L302 - Etherscan source code, appendSequencerBatch function: permissioned sequencer check',
          href: 'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L302',
        },
        {
          text: 'StateCommitmentChain.sol#L111 - Etherscan source code, isCollateralized function: permissioned proposer check',
          href: 'https://etherscan.io/address/0x89E9D387555AF0cDE22cb98833Bae40d640AD7fa#code#F1#L111',
        },
        {
          text: 'BondManager.sol#L31 - Etherscan source code, dummy isCollateralized function',
          href: 'https://etherscan.io/address/0x31aBe1c466C2A8b95fd84258dD1471472979B650#code#F1#L31',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.ENQUEUE,
      description:
        FORCE_TRANSACTIONS.ENQUEUE.description +
        ' The operators can also reset the batch index, effectively removing transactions from the chain from a certain point onwards.',
      references: [
        {
          text: 'CanonicalTransactionChain.sol#L210 - Etherscan source code, enqueue function',
          href: 'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L210',
        },
        {
          text: 'CanonicalTransactionChain.sol#L539 - Etherscan source code, resetIndex function',
          href: 'https://etherscan.io/address/0x291dc3819b863e19b0a9b9809F8025d2EB4aaE93#code#F1#L539',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'BondManager.sol#L31 - Etherscan source code, dummy isCollateralized function',
            href: 'https://etherscan.io/address/0x31aBe1c466C2A8b95fd84258dD1471472979B650#code#F1#L31',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Mantle is EVM compatible. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on Mantle. Some opcodes behave differently.',
      risks: [],
      references: [
        {
          text: 'Solidity support - Mantle documentation',
          href: 'https://docs.mantle.xyz/network/for-devs/solidity-support',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('CanonicalTransactionChain', {
        description:
          'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the batches instance of the ChainStorageContainerCTC. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue a transaction, which the Sequencer must eventually append to the rollup state.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('StateCommitmentChain', {
        description:
          'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Only the BVM_Proposer (which currently resolves to the Rollup contract) is allowed to submit new state roots.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('ChainStorageContainerCTC', {
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('ChainStorageContainerSCC', {
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('BondManager', {
        description:
          'Mock implementation of the contract supposed to handle deposits from proposers. The contract only allows the BVM_Proposer to publish state roots.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('L1CrossDomainMessenger', {
        description:
          "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to Mantle, and relays messages from Mantle onto L1. In the event that a message sent from L1 to Mantle is rejected for exceeding the Mantle epoch gas limit, it can be resubmitted via this contract's replay function.",
        ...upgradesAddressManager,
        pausable: {
          paused: discovery.getContractValue<boolean>(
            'L1CrossDomainMessenger',
            'paused',
          ),
          pausableBy: ['Owner'],
        },
      }),
      discovery.getContractDetails('L1StandardBridge', {
        description:
          'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway. This contract can store any token.',
        ...upgradesAddressManager,
      }),
      discovery.getContractDetails('AddressManager', {
        description:
          'This is a library that stores the mappings between names and their addresses. Changing the values effectively upgrades the system. It is controlled by the OwnerMultisig.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('TssGroupManager', {
        description:
          "This contract controls the TSS group. It can update the public key, add and remove members, and check signed messages. Proposer's state updates are signed by the TSS group.",
        ...regularUpgrades,
      }),
      discovery.getContractDetails('TssStakingSlashing', {
        description:
          'This contract handles staking and slashing of TSS group members. Only whitelisted actors can stake.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('TssDelegationManager', {
        description:
          'Contract that manages different investing strategies related to delegation.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('TssDelegation', {
        description: 'Primary delegation contract.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('TssDelegationSlasher', {
        description:
          'This contract is used to add or remove slashing contracts related to delegation.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('Rollup', {
        description:
          'Main contract related to fraud proofs (not live yet). It is designated as the BVM_Proposer, meaning it can publish state roots. It is inspired by the Specular proof system.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('VerifierEntry', {
        description:
          'Contains the list of verifiers for the different EVM operations. Currently they are all set to the zero address.',
        ...regularUpgrades,
      }),
      discovery.getContractDetails('AssertionMap', {
        description: 'Extension of Rollup, contains the listst of assertions.',
      }),
      discovery.getContractDetails('EigenDataLayerChain', {
        description:
          'Main contract related to data availability. The proof of custody mechanism is not live.',
      }),
      discovery.getContractDetails('BLSRegistry'),
      discovery.getContractDetails('DataLayrServiceManager'),
      discovery.getContractDetails('PubkeyCompendium'),
      discovery.getContractDetails('InvestmentManager', {
        description:
          'Contract managing different investment strategies, forked from EigenLayer StrategyManager.',
      }),
      discovery.getContractDetails('MantleFirstStrat', {
        description: 'Basic do-nothing investment strategy.',
      }),
      discovery.getContractDetails('MantleSecondStrat', {
        description: 'Basic do-nothing investment strategy.',
      }),
      discovery.getContractDetails('RegistryPermission'),
      discovery.getContractDetails('Delegation'),
      discovery.getContractDetails('PauserRegistry'),
      discovery.getContractDetails('PauserRegistry2'),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'This address can upgrade the following contracts: L1CrossDomainMessenger, L1StandardBridge, AddressManager, L1MantleToken, TssGroupManager, TssStakingSlashing, TssDelegationSlasher, TssDelegationManager, TssDelegation, EigenDataLayerChain, Rollup, AssertionMap, VerifierEntry.',
    ),
    ...discovery.getMultisigPermission(
      'Owner2Multisig',
      'This address is the owner of the following contracts: TssGroupManager, VerifierEntry, EigenDataLayerChain, L1CrossDomainMessenger, TssStakingSlashing, TssDelegationSlasher, TssDelegationManager, TssDelegation. It is also designated as the FraudVerifier, meaning it can delete state roots.',
    ),
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('AddressManager', 'sequencer'),
      ],
      description: 'Central actor allowed to commit Mantle transactions to L1.',
    },
    {
      name: 'Tss group',
      accounts: [],
      description: `Group of addresses that sign state updates usign a threshold signature scheme. Members of the group can be slashed by the group itself. It is managed by the TssGroupManager contract. It is equivalent to a ${TssGroup} multisig.`,
    },
    {
      name: 'Rollup operators',
      accounts: discovery.getPermissionedAccounts('Rollup', 'operatorslist'),
      description:
        'Addresses that can initiate a state root update and challenge them. They currently sit behind a whitelist.',
    },
    {
      name: 'Rollup stakers',
      accounts: discovery.getPermissionedAccounts('Rollup', 'stakerslist'),
      description:
        'Addresses that stake on the Rollup contract. They are not in use yet.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://www.mantle.xyz/blog/announcements/mantle-network-mainnet-alpha',
      date: '2023-07-14T00:00:00.00Z',
      description: 'Mantle is live on mainnet.',
    },
  ],
}
