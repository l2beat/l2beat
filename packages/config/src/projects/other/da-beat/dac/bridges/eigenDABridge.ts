import {
  ChainId,
  EthereumAddress,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../../discovery/ProjectDiscovery'
import { DaCommitteeSecurityRisk, DaUpgradeabilityRisk } from '../../types'
import { DaBridge } from '../../types/DaBridge'
import { DaRelayerFailureRisk } from '../../types/DaRelayerFailureRisk'
import { DacTransactionDataType } from '../../types/DacTransactionDataType'
import { toUsedInProject } from '../../utils/to-used-in-project'

const discovery = new ProjectDiscovery('eigenda')
const eigenDiscovery = new ProjectDiscovery('shared-eigenlayer')

const upgrades = {
  upgradableBy: ['EigenDAProxyAdmin'],
  upgradeDelay: 'No delay',
}

const EigenTimelockUpgradeDelay = eigenDiscovery.getContractValue<number>(
  'EigenLayer Timelock',
  'delay',
)

const eigenLayerUpgrades = {
  upgradableBy: ['EigenLayerCommunityMultisig', 'EigenLayerOperationsMultisig'],
  upgradeDelay: `${formatSeconds(EigenTimelockUpgradeDelay)} delay via EigenLayerOperationsMultisig, no delay via EigenLayerCommunityMultisig.`,
}

const EIGENUpgradeDelay = eigenDiscovery.getContractValue<number>(
  'EIGEN Timelock',
  'getMinDelay',
)

const EIGENUpgrades = {
  upgradableBy: ['EIGEN Timelock'],
  upgradeDelay: `${formatSeconds(EIGENUpgradeDelay)} delay.`,
}

const quorumThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumConfirmationThresholdPercentages',
)

const quorum1Threshold = parseInt(quorumThresholds.substring(2, 4), 16)
const quorum2Threshold = parseInt(quorumThresholds.substring(4, 6), 16)

const ejectionCooldown = discovery.getContractValue<number>(
  'RegistryCoordinator',
  'ejectionCooldown',
)

const ejectionRateLimitWindow = discovery.getContractValue<number[]>(
  'EjectionManager',
  'ejectionRateLimitWindow',
) // [0] for quorum 1. [1] for quorum 2.

const ejectableStakePercentParam = discovery.getContractValue<string>(
  'EjectionManager',
  'ejectableStakePercent',
)
const ejectableStakePercent = parseFloat(ejectableStakePercentParam) / 100

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
  createdAt: new UnixTime(1724426960), // 2024-08-23T15:29:20Z
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
      {
        ...eigenDiscovery.getContractDetails('PauserRegistry', {
          description:
            'Defines and stores pauser and unpauser roles for EigenLayer contracts and the EigenDAServiceManager.',
        }),
      },
      {
        ...eigenDiscovery.getContractDetails('DelegationManager', {
          description: `The DelegationManager contract is responsible for registering EigenLayer operators and managing the EigenLayer strategies delegations. The EigenDA StakeRegistry contract reads from the DelegationManager to track the total stake of each EigenDA operator.`,
        }),
        ...eigenLayerUpgrades,
      },
      {
        ...eigenDiscovery.getContractDetails('StrategyManager', {
          description:
            'The StrategyManager contract is responsible for managing the EigenLayer token strategies. Each EigenDA quorum has at least one strategy that defines the operators quorum stake.',
        }),
        ...eigenLayerUpgrades,
      },
      {
        ...discovery.getContractDetails('EigenStrategy', {
          description: `The EigenStrategy contract is responsible for managing the bEIGEN token strategy, representing the stake for the second EigenDA quorum.`,
        }),
        ...eigenLayerUpgrades,
      },
      {
        ...eigenDiscovery.getContractDetails('EIGEN token', {
          description: `The EIGEN token can be socially forked to slash operators for data withholding attacks (and other intersubjectively attributable faults).
              EIGEN is a wrapper over a second token, bEIGEN, which will be used solely for intersubjective staking. Forking EIGEN means changing the canonical implementation of the bEIGEN token in the EIGEN token contract.`,
        }),
        ...EIGENUpgrades,
      },
    ],
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge (EigenDAServiceManager) contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'EigenLayer core contracts (DelegationManager, StrategyManager) receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: `EigenLayer EIGEN token contract receives a malicious code upgrade. There is a ${formatSeconds(EIGENUpgradeDelay)} delay on code upgrades.`,
      },
      {
        category: 'Funds can be lost if',
        text: 'the churn approver or ejectors act maliciously and eject EigenDA operators from a quorum without cause.',
      },
    ],
  },
  technology: {
    description: `
    ## Architecture

    ![EigenDA architecture once stored](/images/da-bridge-technology/eigenda/architecture1.png#center)

    The EigenDAServiceManager acts as a DA bridge smart contract verifying data availability claims from operators via signature verification.
    The checkSignature function checks that the signature of all signers plus non-signers is equal to the registered quorum aggregated public key from the BLS registry. The quorum aggregated public key gets updated every time an operator is registered.
    The bridge requires a threshold of signatures to be met before the data commitment is accepted. 
    To verify the threshold is met, the function takes the total stake at the reference block for the quorum from the StakeRegistry, and it subtracts the stake of non signers to get the signed stake.
    Finally, it checks that the signed stake over the total stake is more than the required stake threshold.

    ![EigenDA bridge architecture](/images/da-bridge-technology/eigenda/architecture2.png#center)

    Although thresholds are not enforced by the confirmBatch method, current quorum thresholds are set to ${quorum1Threshold}% of registered stake for the ETH quorum and ${quorum2Threshold}% for the EIGEN token quorum. The quorum thresholds are set on the EigenDAServiceManager contract and can be changed by the contract owner.
    There is a maximum of ${operatorSetParamsQuorum1[0]} operators that can register for the ETH quorum and ${operatorSetParamsQuorum2[0]} for the EIGEN token quorum. Once the cap is reached, new operators must have 10% more weight than the lowest-weighted operator to join the active set. Entering the quorum is subject to the approval of the churn approver. Operators can be ejected from a quorum by the ejectors without delay should they violate the Service Legal Agreement (SLA). \n

    Ejectors can eject maximum ${ejectableStakePercent}% of the total stake in a ${formatSeconds(ejectionRateLimitWindow[0])} window for the ETH quorum, and the same stake percentage over a ${formatSeconds(ejectionRateLimitWindow[1])} window for the EIGEN quorum.
    An ejected operator can rejoin the quorum after ${formatSeconds(ejectionCooldown)}. 
  `,
    risks: [
      {
        category: 'Funds can be frozen if',
        text: 'the permissioned relayers are unable to submit DA commitments to the Vector contract.',
      },
      {
        category: 'Funds can be frozen if',
        text: 'the bridge (EigenDAServiceManager) contract is paused by the pausers.',
      },
    ],
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
    {
      name: 'EigenLayerProxyAdmin',
      description: `The contract authorized to upgrade the core EigenLayer contracts.`,
      accounts: [
        {
          address: eigenDiscovery.getContract('EigenLayerProxyAdmin').address,
          type: 'Contract',
        },
      ],
      participants: [
        {
          address: EthereumAddress(
            eigenDiscovery.getContractValue<string>(
              'EigenLayerProxyAdmin',
              'owner',
            ),
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
    ...eigenDiscovery.getMultisigPermission(
      'EigenLayerCommunityMultisig',
      'This multisig is one of the owners of EigenLayerExecutorMultisig and can upgrade EigenLayer core contracts without delay.',
    ),
    eigenDiscovery.contractAsPermissioned(
      eigenDiscovery.getContract('EigenLayer Timelock'),
      'The timelock contract for upgrading EigenLayer core contracts via EigenLayerOperationsMultisig.',
    ),
  ],
  chain: ChainId.ETHEREUM,
  requiredMembers: 0, // currently 0 since threshold is not enforced
  membersCount: 400,
  transactionDataType: DacTransactionDataType.TransactionData,
  usedIn: toUsedInProject([]),
  risks: {
    committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(),
    upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    relayerFailure: DaRelayerFailureRisk.NoMechanism,
  },
} satisfies DaBridge
