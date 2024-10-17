import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('eigenda')
const eigenDiscovery = new ProjectDiscovery('shared-eigenlayer')

const upgrades = {
  upgradableBy: ['EigenDAProxyAdmin'],
  upgradeDelay: 'No delay',
}

const quorumThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumConfirmationThresholdPercentages',
)

const quorum1Threshold = parseInt(quorumThresholds.substring(2, 4), 16)
const quorum2Threshold = parseInt(quorumThresholds.substring(4, 6), 16)

const operatorSetParamsQuorum1 = discovery.getContractValue<number[]>(
  'RegistryCoordinator',
  'operatorSetParamsQuorum1',
)

const operatorSetParamsQuorum2 = discovery.getContractValue<number[]>(
  'RegistryCoordinator',
  'operatorSetParamsQuorum2',
)

const batchConfirmers = discovery.getContractValue<string[]>(
  'EigenDAServiceManager',
  'batchConfirmers',
)

const pausers = eigenDiscovery.getContractValue<string[]>(
  'PauserRegistry',
  'pausers',
)

const churnApprover = discovery.getContractValue<string>(
  'RegistryCoordinator',
  'churnApprover',
)

const ejectors = discovery.getContractValue<string[]>(
  'EjectionManager',
  'ejectors',
)

export const eigenDAbridge = {
  id: 'eigenda-bridge',
  type: 'DAC',
  display: {
    name: 'EigenDAServiceManager',
    slug: 'bridge',
    description:
      'EigenDA DA attestations are bridged to Ethereum through the EigenDAServiceManager smart contract.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  contracts: {
    addresses: [
      {
        ...discovery.getContractDetails('EigenDAServiceManager', {
          description:
            'The EigenDAServiceManager contract is the bridge contract that accepts blob batches data availability attestations. Batches availability is attested by EigenDA operators signatures and relayed to the service manager contract by the EigenDA disperser.',
        }),
        ...upgrades,
      },
      {
        ...discovery.getContractDetails('RegistryCoordinator', {
          description: `Contract used by operators to register with the EigenDA AVS. The coordinator has three registries: a StakeRegistry that keeps track of operators' stakes, a BLSApkRegistry that keeps track of operators' BLS public keys and aggregate BLS public keys for each quorum, and an IndexRegistry that keeps track of an ordered list of operators for each quorum.`,
        }),
        ...upgrades,
      },
      {
        ...eigenDiscovery.getContractDetails('PauserRegistry', {
          description:
            'Defines and stores pauser and unpauser roles for EigenLayer contracts and the EigenDAServiceManager.',
        }),
      },
      {
        ...discovery.getContractDetails('StakeRegistry', {
          description:
            'The StakeRegistry contract keeps track of the total stake of each operator.',
        }),
        ...upgrades,
      },
      {
        ...discovery.getContractDetails('BLSApkRegistry', {
          description:
            'The BLSApkRegistry contract keeps track of the BLS public keys of each operator and the quorum aggregated keys.',
        }),
        ...upgrades,
      },
      {
        ...discovery.getContractDetails('EjectionManager', {
          description:
            'The EjectionManager contract is responsible for ejecting operators from a quorum for violating the Service Legal Agreement (SLA).',
        }),
        ...upgrades,
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or any of its EigenLayer dependencies receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the disperser posts an invalid commitment and EigenDA operators do not make the data available for verification.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the churn approver or ejectors act maliciously and eject EigenDA operators from a quorum without cause.',
      },
      {
        category: 'Users can be censored if',
        text: 'the disperser does not distribute data to EigenDA operators.',
      },
    ],
  },
  technology: {
    description: `## DA Bridge
    The EigenDAServiceManager acts as a DA bridge smart contract verifying data availability claims from operators via signature verification.
    The checkSignature function checks that the signature of all signers plus non-signers is equal to the registered quorum aggregated public key from the BLS registry. The quorum aggregated public key gets updated every time an operator is registered.
    The bridge requires a threshold of signatures to be met before the data commitment is accepted. 
    To verify the threshold is met, the function takes the total stake at the reference block for the quorum from the StakeRegistry, and it subtracts the stake of non signers to get the signed stake.
    Finally, it checks that the signed stake over the total stake is more than the required stake threshold.

    ![EigenDA once stored](/images/da-layer-technology/eigenda/oncestored.png#center)

    Although thresholds are not enforced by the confirmBatch method, current quorum thresholds are set to ${quorum1Threshold}% of registered stake for the ETH quorum and ${quorum2Threshold}% for the EIGEN token quorum. The quorum thresholds are set on the EigenDAServiceManager contract and can be changed by the contract owner.
    There is a maximum of ${operatorSetParamsQuorum1[0]} operators that can register for the ETH quorum and ${operatorSetParamsQuorum2[0]} for the EIGEN token quorum. Once the cap is reached, new operators must have 10% more weight than the lowest-weighted operator to join the active set. Entering the quorum is subject to the approval of the churn approver. Operators can be ejected from a quorum by the ejectors without delay should they violate the Service Legal Agreement (SLA).
  `,
  },
  permissions: [
    {
      name: 'EigenDAProxyAdmin',
      description: `The contract authorized to upgrade the core EigenDA contracts.`,
      accounts: [
        {
          address: discovery.getContract('eigenDAProxyAdmin').address,
          type: 'Contract',
        },
      ],
      participants: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>('eigenDAProxyAdmin', 'owner'),
          ),
          type: 'MultiSig',
        },
      ],
    },
    ...eigenDiscovery.getMultisigPermission(
      'EigenLayerExecutorMultisig',
      'The proxy contract authorized to unpause the EigenDAServiceManager contract and upgrade core contracts through the EigenDAProxyAdmin contract.',
    ),
    ...eigenDiscovery.getMultisigPermission(
      'EigenLayerOperationsMultisig',
      'This multisig is the owner of the EigenDAServiceManager contract. It holds the power to change the contract state and upgrade the bridge.',
    ),
    {
      name: 'BatchConfirmers',
      description: `The list of addresses authorized to confirm the availability of blobs batches to the DA bridge.`,
      accounts: batchConfirmers.map((batchConfirmer) => ({
        address: EthereumAddress(batchConfirmer),
        type: 'EOA',
      })),
    },
    {
      name: 'Pausers',
      description: `The list of addresses authorized to pause the EigenDAServiceManager contract.`,
      accounts: pausers.map((pauser) => ({
        address: EthereumAddress(pauser),
        type: 'EOA',
      })),
    },
    {
      name: 'ChurnApprover',
      description: `The address authorized to approve the replacement of churned EigenDA operators from a quorum.`,
      accounts: [
        {
          address: EthereumAddress(churnApprover),
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Ejectors',
      description: `The list of addresses authorized to eject EigenDA operators from a quorum.`,
      accounts: ejectors.map((ejectors) => ({
        address: EthereumAddress(ejectors),
        type: 'EOA',
      })),
    },
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: 0, // currently 0 since threshold is not enforced
  membersCount: 400,
  transactionDataType: DacTransactionDataType.TransactionData,
  usedIn: toUsedInProject([]),
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    relayerFailure: 'noMechanism',
  },
} satisfies DaBridge
