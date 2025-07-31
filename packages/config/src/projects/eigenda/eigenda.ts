import { formatSeconds, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('eigenda')

const EIGENUpgradeDelay = discovery.getContractValue<number>(
  'TimelockControllerOwning',
  'getMinDelay',
)

const quorumThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumConfirmationThresholdPercentages',
)

const quorum1Threshold = Number.parseInt(quorumThresholds.substring(2, 4), 16)
const quorum2Threshold = Number.parseInt(quorumThresholds.substring(4, 6), 16)

const quorumAdversaryThresholds = discovery.getContractValue<string>(
  'EigenDAServiceManager',
  'quorumAdversaryThresholdPercentages',
)

const quorum1AdversaryThreshold = Number.parseInt(
  quorumAdversaryThresholds.substring(2, 4),
  16,
)
const quorum2AdversaryThreshold = Number.parseInt(
  quorumAdversaryThresholds.substring(4, 6),
  16,
)

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
const ejectableStakePercent =
  Number.parseFloat(ejectableStakePercentParam) / 100

const operatorSetParamsQuorum1 = discovery.getContractValue<{
  maxOperatorCount: number
  kickBIPsOfOperatorStake: number
  kickBIPsOfTotalStake: number
}>('RegistryCoordinator', 'operatorSetParamsQuorum1')

const operatorSetParamsQuorum2 = discovery.getContractValue<{
  maxOperatorCount: number
  kickBIPsOfOperatorStake: number
  kickBIPsOfTotalStake: number
}>('RegistryCoordinator', 'operatorSetParamsQuorum2')

const totalNumberOfRegisteredOperators = discovery.getContractValue<string[]>(
  'RegistryCoordinator',
  'registeredOperators',
).length

export const eigenda: BaseProject = {
  id: ProjectId('eigenda'),
  slug: 'eigenda',
  name: 'EigenDA',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  // tags
  isDaLayer: true,
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'EigenDA is a data availability solution built on Eigen Layer.',
    links: {
      websites: ['https://www.eigenda.xyz/'],
      documentation: ['https://docs.eigenda.xyz/overview'],
      repositories: ['https://github.com/Layr-Labs/eigenda'],
      explorers: ['https://blobs.eigenda.xyz/'],
      socialMedia: ['https://x.com/eigen_da'],
    },
    badges: [],
  },
  colors: {
    primary: '#6258FF',
    secondary: '#6258FF',
  },
  daLayer: {
    type: 'DA Service',
    systemCategory: 'public',
    technology: {
      description: `

    ## Architecture

    ![EigenDA architecture](/images/da-layer-technology/eigenda/architecture.png#center)

    EigenDA is composed by three types of off-chain entities: node operators, a disperser and a retriever.
    - EigenDA **operators** are node operators running the EigenDA node software and are registered to the EigenDA AVS in EigenLayer.
    - The **disperser** is the entity responsible for collecting the blobs from the sequencer, erasure coding them and generating the encoded blob's KZG commitments for each chunk. Although the disperser could be rollup-operated, it is currently a centralised entity operated by Eigen Labs.
    - Lastly, the **retriever** client is responsible for querying the EigenDA operators to retrieve blob chunks, verifying their integrity and reconstructs the original blob. 
    
    ### Operators Registration 
    Operators register with the EigenDAServiceManager via the registerOperatorToAVS() function, enabling them to participate in the data availability network. They are responsible for holding and serving blobs data, and earn rewards for their participation in the network.

    ![EigenDA operator registration](/images/da-layer-technology/eigenda/registration.png#center)

    ### Operators Stake Update  
    
    EigenDA operators' stake for quorum verification is fetched from the EigenDA StakeRegistry contract. To keep the stake in sync with changes in share balances in the EigenLayer DelegationManager (e.g., due to tokens delegated/undelegated to operators), the permissionless updateOperators() function on the RegistryCoordinator contract needs to be called periodically. This function updates the operators' quorum weight in the StakeRegistry contract based on the operators' shares in the EigenLayer DelegationManager contract.
    ![EigenDA operator stake sync](/images/da-layer-technology/eigenda/stakesync.png#center)

    ### Operators Blob Storage and Retrieval 

    The process of storing a blob on EigenDA works as follows. A sequencer submits blobs to the EigenDA Disperser, which erasure codes the blobs into chunks and generates KZG commitments and proofs for each chunk, certifying the correctness of the data. The disperser then sends the chunks, KZG commitments, and KZG proofs to the operators.
    Multiple operators are responsible for storing chunks of the encoded data blobs and their associated KZG commitment and proof.
    Once the chunks, KZG commitments, and KZG proofs are sent to the operators, each of them generates a signature certifying that they have stored the data. These signatures are then sent to the Disperser which aggregates them and submits them to Ethereum by sending a transaction to the EigenDAServiceManager (the DA bridge).
    
    ![EigenDA storing/retrieving](/images/da-layer-technology/eigenda/storing-retrieving.png#center)

    ## L2 Data Availability
    The Disperser collects the operators' signatures and submits them to the EigenDAServiceManager contract via the confirmBatch() function. This submission includes a call to the BLSRegistry contract to verify signatures and check whether the required quorum of operators' stake has been achieved.
    Threshold BLS signatures are not used. Instead, the threshold check is performed on the signers' total stake fetched by the StakeRegistry, and the stake threshold percentage to reach is provided in the batch header input data.

    The EigenDARollupUtils.sol library's verifyBlob() function can then be used by L2s to verify that a data blob is included within a confirmed batch in the EigenDAServiceManager. 
    This function is not used by the EigenDAServiceManager contract itself, but rather by L2 systems to prove inclusion of the blob in the EigenDAServiceManager contract, and that their trust assumptions (i.e., batch confirmation threshold) were as expected.
  `,
      references: [
        {
          title: 'EigenDA - Documentation',
          url: 'https://docs.eigenda.xyz/overview',
        },
        {
          title: 'EigenDA Disperser - Source Code',
          url: 'https://github.com/Layr-Labs/eigenda/blob/2ed86a0c1dd730b56c8235031c19e08a9837bde8/disperser/batcher/batcher.go',
        },
        {
          title: 'EigenDA Rollup Utils - Source Code',
          url: 'https://github.com/Layr-Labs/eigenda-utils/blob/c4cbc9ec078aeca3e4a04bd278e2fb136bf3e6de/src/libraries/EigenDARollupUtils.sol',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the disperser does not distribute data to EigenDA operators.',
        },
      ],
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('eigenda'),
      bridge: undefined,
    }),
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('EIGEN'),
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
    pruningWindow: 86400 * 14, // 14 days in seconds
    throughput: [
      {
        size: 15728640, // 15 MB
        frequency: 1, // x second
        sinceTimestamp: 1719187200, // 2024-06-24
      },
    ],
    finality: 600, // ~10 minutes
    sovereignProjectsTrackingConfig: [
      {
        projectId: ProjectId('mantle-testnet'),
        name: 'Mantle-testnet',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0xc16267ecb2297f8a98fce214686e80697da91198',
          },
        ],
      },
      {
        projectId: ProjectId('matter-labs-wonderfi'),
        name: 'Matter Labs - WonderFi',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0xdaf4b26d608d58f53ab6f0758a12de01296ce5bf',
          },
        ],
      },
      {
        projectId: ProjectId('altlayer'),
        name: 'AltLayer',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0x4fdbd273b8d2c1c429a7e3078063c49528aa8264',
          },
        ],
      },
      {
        projectId: ProjectId('altlayer-2'),
        name: 'AltLayer-2',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0x1359fbd4b9bc9441a90436719426157526742c9a',
          },
        ],
      },
      {
        projectId: ProjectId('altlayer-cyber'),
        name: 'Altlayer Cyber',
        daTrackingConfig: [
          { type: 'eigen-da', sinceTimestamp: 0, customerId: '35.167.254.127' },
        ],
      },
      {
        projectId: ProjectId('conduit'),
        name: 'Conduit',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0x8dc6f0bd2ce3c40d633f5541e21e7574598f7c75',
          },
        ],
      },
      {
        projectId: ProjectId('layer-n'),
        name: 'Layer N',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0xd697219f32129f4544a554be015386fac9445507',
          },
        ],
      },
      {
        projectId: ProjectId('treasure'),
        name: 'Treasure',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 0,
            customerId: '0x96561d11f55f99f7cda780b77e524195bde1dcde',
          },
        ],
      },
    ],
  },
  daBridge: {
    name: 'Service Manager',
    daLayer: ProjectId('eigenda'),
    technology: {
      description: `
## Architecture

![EigenDA architecture once stored](/images/da-bridge-technology/eigenda/architecture1.png#center)

The EigenDAServiceManager acts as a DA bridge smart contract verifying data availability claims from operators via signature verification.
The checkSignatures() function checks that the signature of all signers plus non-signers is equal to the registered quorum aggregated public key from the BLS registry. The quorum aggregated public key gets updated every time an operator is registered.
The bridge requires a threshold of signatures to be met before the data commitment is accepted. 
To verify the threshold is met, the function takes the total stake at the reference block for the quorum from the StakeRegistry, and it subtracts the stake of non signers to get the signed stake.
Finally, it checks that the signed stake over the total stake is more than the required stake threshold.

![EigenDA bridge architecture](/images/da-bridge-technology/eigenda/architecture2.png#center)

Although thresholds are not enforced onchain by the confirmBatch method, the minimum thresholds that the disperser would need to reach before relaying the batch commitment to Ethereum are set to ${quorum1Threshold}% of the registered stake for the ETH quorum and ${quorum2Threshold}% for the EIGEN token quorum. Meeting these dispersal thresholds allows the system to tolerate up to ${quorum1AdversaryThreshold}% (quorum 1) and ${quorum2AdversaryThreshold}% (quorum 2) of the total stake being adversarial, achieving this with approximately 4.5 data redundancy.  
The quorum thresholds are set on the EigenDAServiceManager contract and can be changed by the contract owner.
There is a maximum of ${operatorSetParamsQuorum1.maxOperatorCount} operators that can register for the ETH quorum and ${operatorSetParamsQuorum2.maxOperatorCount} for the EIGEN token quorum. Once the cap is reached, new operators must have 10% more weight than the lowest-weighted operator to join the active set. Entering the quorum is subject to the approval of the churn approver. Operators can be ejected from a quorum by the ejectors without delay should they violate the Service Legal Agreement (SLA). \n

Ejectors can eject maximum ${ejectableStakePercent}% of the total stake in a ${formatSeconds(ejectionRateLimitWindow[0])} window for the ETH quorum, and the same stake percentage over a ${formatSeconds(ejectionRateLimitWindow[1])} window for the EIGEN quorum.
An ejected operator can rejoin the quorum after ${formatSeconds(ejectionCooldown)}. 
    `,
      references: [
        {
          title: 'EigenDA Registry Coordinator - Etherscan',
          url: 'https://etherscan.io/address/0xdcabf0be991d4609096cce316df08d091356e03f',
        },
        {
          title: 'EigenDA Service Manager - Etherscan',
          url: 'https://etherscan.io/address/0x58fDE694Db83e589ABb21A6Fe66cb20Ce5554a07',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the relayer posts an invalid commitment and EigenDA operators do not make the data available for verification.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the bridge contract.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the bridge (EigenDAServiceManager) contract is paused by the pausers.',
        },
      ],
    },
    dac: {
      requiredMembers: 0, // currently 0 since threshold is not enforced
      membersCount: 400, // max allowed operators (quorum 1 + quorum 2)
    },
    usedIn: linkByDA({
      layer: ProjectId('eigenda'),
      bridge: ProjectId('eigenda'),
    }),
    risks: {
      committeeSecurity: DaCommitteeSecurityRisk.LimitedCommitteeSecurity(
        'Permissioned',
        undefined,
        totalNumberOfRegisteredOperators,
      ),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge (EigenDAServiceManager) contract receives a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the EigenLayer core contracts (DelegationManager, StrategyManager) receive a malicious code upgrade. There is no delay on code upgrades.',
      },
      {
        category: 'Funds can be lost if',
        text: `the EigenLayer EIGEN token contract receives a malicious code upgrade. There is a ${formatSeconds(EIGENUpgradeDelay)} delay on code upgrades.`,
      },
      {
        category: 'Funds can be lost if',
        text: 'the churn approver or ejectors act maliciously and eject EigenDA operators from a quorum without cause.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge accepts an incorrect or malicious data commitment provided by node operators.',
      },
    ],
  },
  permissions: discovery.getDiscoveredPermissions(),
  milestones: [
    {
      title: 'EigenDA launch on mainnet',
      url: 'https://blog.eigenlayer.xyz/mainnet-launch-eigenlayer-eigenda/',
      date: '2024-04-09T00:00:00Z',
      description: 'EigenLayer and EigenDA launch on the Ethereum mainnet.',
      type: 'general',
    },
    {
      title: 'EIGEN token unlock',
      url: 'https://x.com/eigenlayer/status/1840967244408344619',
      date: '2024-10-01T00:00:00Z',
      description: 'EIGEN token becomes transferable.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
