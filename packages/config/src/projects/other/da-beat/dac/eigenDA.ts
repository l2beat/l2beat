import { UnixTime } from '@l2beat/shared-pure'
import { donatuz } from '../../../layer3s/donatuz'
import { NO_BRIDGE } from '../templates/no-bridge-template'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DacDaLayer } from '../types/DaLayer'
import { toUsedInProject } from '../utils/to-used-in-project'
import { eigenDAbridge } from './bridges/eigenDABridge'
import { soon } from '../../../layer2s/soon'

export const eigenDA: DacDaLayer = {
  id: 'eigen-da',
  type: 'DaLayer',
  kind: 'DA Service',
  systemCategory: 'public',
  display: {
    name: 'EigenDA',
    slug: 'eigenda',
    description:
      'EigenDA is a data availability solution built on Eigen Layer.',
    links: {
      websites: ['https://www.eigenda.xyz/'],
      documentation: ['https://docs.eigenda.xyz/overview'],
      repositories: ['https://github.com/Layr-Labs/eigenda'],
      apps: [],
      explorers: ['https://blobs.eigenda.xyz/'],
      socialMedia: ['https://x.com/eigen_da'],
    },
  },
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
        text: 'EigenDA - Documentation',
        href: 'https://docs.eigenda.xyz/overview',
      },
      {
        text: 'EigenDA Disperser - Source Code',
        href: 'https://github.com/Layr-Labs/eigenda/blob/2ed86a0c1dd730b56c8235031c19e08a9837bde8/disperser/batcher/batcher.go',
      },
      {
        text: 'EigenDA Rollup Utils - Source Code',
        href: 'https://github.com/Layr-Labs/eigenda-utils/blob/c4cbc9ec078aeca3e4a04bd278e2fb136bf3e6de/src/libraries/EigenDARollupUtils.sol',
      },
    ],
    risks: [
      {
        category: 'Users can be censored if',
        text: 'the disperser does not distribute data to EigenDA operators.',
      },
    ],
  },
  bridges: [
    NO_BRIDGE({
      createdAt: new UnixTime(1724426960), // 2024-08-23T15:29:20Z
      layer: 'EigenDA',
      description:
        'The risk profile in this page refers to L2s that do not integrate with a data availability bridge.',
      technology: {
        description: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
      },
      usedIn: [...toUsedInProject([donatuz, soon])],
    }),
    eigenDAbridge,
  ],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('EIGEN'),
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
