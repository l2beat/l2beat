import { donatuz } from '../../../layer3s/donatuz'
import { NO_BRIDGE } from '../templates/no-bridge-template'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { linkByDA } from '../utils/link-by-da'
import { toUsedInProject } from '../utils/to-used-in-project'
import { eigenDAbridge } from './bridges/eigenDABridge'

export const eigenDA: DaLayer = {
  id: 'eigen-da',
  type: 'DaLayer',
  kind: 'DAC',
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
  technology: `

    ## Architecture
    EigenDA is composed by three types of off-chain entities: node operators, a disperser and a retriever.
    - EigenDA **operators** are node operators running the EigenDA node software and are registered to the EigenDA AVS in EigenLayer.
    - The **disperser** is the entity resposible for collecting the blobs from the sequencer, erasure coding them and generating the encoded blob's KZG commitments for each chunk. Although the disperser could be rollup-operated, it is currently a centralised entity operated by Eigen Labs.
    - Lastly, the **retriever** client is responsible for querying the EigenDA operators to retrieve blob chunks, verifying their integrity and reconstructs the original blob. 
    
    Operators register with the EigenDAServiceManager via the registerOperatorToAVS() function, enabling them to participate in the data availability network. They are resposible for holding and serving blobs data, and earn rewards for their participation in the network.
    The process of storing a blob on EigenDA works as follows. A sequencer submits blobs to the EigenDA Disperser, which erasure codes the blobs into chunks and generates KZG commitments and proofs for each chunk, certifying the correctness of the data. The disperser then sends the chunks, KZG commitments, and KZG proofs to the operators.
    Multiple operators are responsible for storing chunks of the encoded data blobs and their associated KZG commitment and proof.
    Once the chunks, KZG commitments, and KZG proofs are sent to the operators, each of them generates a signature certifying that they have stored the data. These signatures are then sent to the Disperser which aggregates them and uploads them to Ethereum by sending a transaction to the EigenDAServiceManager (the DA bridge).
    
    ![EigenDA storing/retrieving](/images/da-layer-technology/eigenda/storing-retrieving.png#center)

    ## L2 Data Availability
    The Disperser collects the operators' signatures and submits them to the EigenDAServiceManager contract via the confirmBatch() function. This submission includes a call to the BLSRegistry contract to verify signatures and check whether the required quorum of operators' stake has been achieved.
    Threshold BLS signatures are not used. Instead, the threshold check is performed on the signers' total stake fetched by the StakeRegistry, and the stake threshold percentage to reach is provided in the batch header input data.

    The EigenDARollupUtils.sol library's verifyBlob() function can then used by scaling solutions to verify that a data blob is included within a confirmed batch in the EigenDAServiceManager. 

  `,
  bridges: [
    NO_BRIDGE({
      layer: 'EigenDA',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
      usedIn: [...toUsedInProject([donatuz])],
    }),
    eigenDAbridge,
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'EigenDA',
  }),
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
