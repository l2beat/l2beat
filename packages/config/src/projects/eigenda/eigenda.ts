import {
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
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
    description: 'EigenDA is a data availability solution built on EigenLayer.',
    links: {
      websites: ['https://www.eigenda.xyz/'],
      documentation: ['https://docs.eigenda.xyz/overview'],
      repositories: ['https://github.com/Layr-Labs/eigenda'],
      explorers: ['https://blobs.eigenda.xyz/'],
      socialMedia: ['https://x.com/eigen_da'],
    },
    badges: [],
  },
  trackedTxsConfig: [],
  colors: {
    primary: {
      light: '#6258FF',
    },
    secondary: {
      light: '#6258FF',
    },
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
    - Lastly, the **retriever** client is responsible for querying the EigenDA operators to retrieve blob chunks, verifying their integrity and reconstructing the original blob.

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

    ## Data Availability Certificates

    EigenDA uses different certificate formats depending on the version, each with corresponding verifier contracts:

    ### Certificate Types
    - **V1 Certificates**: Used in EigenDA V1, verified through the EigenDAServiceManager contract via the confirmBatch() function. These certificates contain batch headers with KZG commitments and BLS aggregated signatures from operators.

    - **V2/V3 Certificates**: Used in EigenDA V2, which introduces significant architectural changes. The sequencer acts as the relayer and does not post batches to the service manager. Instead, certificates are verified through dedicated DACert Verifier contracts that correspond to different certificate versions.

    ### EigenDA V2 Changes
    In EigenDA V2, the architecture has evolved to improve efficiency:
    - **Sequencer as Relayer**: The sequencer now acts as the relayer, eliminating the need to post batches to the service manager
    - **Direct Certificate Verification**: Certificates are verified directly through version-specific DACert Verifier contracts
    - **Improved Throughput**: The new architecture supports higher throughput by removing bottlenecks in the batch confirmation process

    ### Certificate Verification Process
    1. **Certificate Construction**: The EigenDA client constructs certificates from BlobStatusReply data received from the disperser
    2. **Version Detection**: The certificate version is determined from the commitment structure
    3. **Verifier Selection**: The appropriate DACert Verifier contract is selected based on the certificate version
    4. **Onchain Verification**: The verifier contract's checkDACert function validates the certificate against operator signatures and stake thresholds

    ## L2 Data Availability
    The verification process differs between EigenDA versions:

    **EigenDA V1**: The Disperser collects operators' signatures and submits them to the EigenDAServiceManager contract via the confirmBatch() function. This submission includes a call to the BLSRegistry contract to verify signatures and check whether the required quorum of operators' stake has been achieved.

    **EigenDA V2**: Certificate verification is handled by dedicated DACert Verifier contracts. Each certificate version corresponds to a specific verifier that validates the certificate format and cryptographic proofs without requiring batch submissions to a central service manager.

    Threshold BLS signatures are not used. Instead, the threshold check is performed on the signers' total stake fetched by the StakeRegistry, and the stake threshold percentage to reach is provided in the batch header input data.

    The EigenDARollupUtils.sol library's verifyBlob() function can then be used by L2s to verify that a data blob is included within a confirmed batch in the EigenDAServiceManager (V1) or through the appropriate DACert Verifier contract (V2/V3).
    This function is not used by the EigenDAServiceManager contract itself, but rather by L2 systems to prove inclusion of the blob and that their trust assumptions (i.e., batch confirmation threshold) were as expected.
  `,
      references: [
        {
          title: 'EigenDA - Documentation',
          url: 'https://docs.eigenda.xyz/overview',
        },
        {
          title: 'EigenDA Integration Spec - Lifecycle Phases',
          url: 'https://layr-labs.github.io/eigenda/integration/spec/5-lifecycle-phases.html#secure-dispersal',
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
    validators: {
      type: 'static',
      count: totalNumberOfRegisteredOperators,
    },
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
      {
        size: 'NO_CAP',
        frequency: 1, // x second
        sinceTimestamp: 1753833600, // 2025-07-30
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
      {
        projectId: ProjectId('openledger'),
        name: 'OpenLedger',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1752044400,
            customerId: '0xe16fabeb99a6c098e4d7b4d442df0c827d5a6d26',
          },
        ],
      },
      {
        projectId: ProjectId('alchemy-production'),
        name: 'Alchemy Production',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1753833600,
            customerId: '0x3ba8c28a0209dea4d0502031f83d09a17a389fb0',
          },
        ],
      },
      {
        projectId: ProjectId('powerloom'),
        name: 'Powerloom',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1754438400,
            customerId: '0x00efb491755397ab8727ab45c4aef5fdcd3ecef8',
          },
        ],
      },
      // under review so it goes here for now
      {
        projectId: ProjectId('soon-base'),
        name: 'SOON - Base',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1748934000,
            customerId: '0xa11b7dea1592011c0055c62efb9566a845493003',
          },
        ],
      },
      {
        projectId: ProjectId('polymer'),
        name: 'Polymer',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1731974400,
            customerId: '0xf33f8cfea5857ebf248520cf6bc33640680ff83b',
          },
        ],
      },
      {
        projectId: ProjectId('crestal'),
        name: 'Crestal',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1728399600,
            customerId: '0x2659d4555e482ec4131a493def0770a922c75de3',
          },
        ],
      },
      {
        projectId: ProjectId('rise'),
        name: 'Rise',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1767607200, // 2026-01-05T10:00:00Z
            customerId: '0x78d5974216f751eb328018f003067f77e8be2fc4',
          },
        ],
      },
      {
        projectId: ProjectId('conduit-2'),
        name: 'Conduit',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1719266400,
            customerId: '34.145.120.220',
          },
        ],
      },
      {
        projectId: ProjectId('conduit-3'),
        name: 'Conduit',
        daTrackingConfig: [
          {
            type: 'eigen-da',
            sinceTimestamp: 1719262800,
            customerId: '34.168.104.248',
          },
        ],
      },
    ],
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
      title: 'EigenDA V2 launch',
      url: 'https://x.com/0xkydo/status/1950571973790363737',
      date: '2025-07-30T00:00:00Z',
      description: 'EigenDA V2 launch on Ethereum mainnet.',
      type: 'general',
    },
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
