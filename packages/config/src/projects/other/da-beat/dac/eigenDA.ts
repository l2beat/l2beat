import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { eigenDAbridge } from './bridges/eigenDABridge'

export const eigenDA: DaLayer = {
  id: 'eigen-da',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'Eigen DA',
    slug: 'eigenda',
    description:
      'EigenDA is a data availability solution built on Eigen Layer.',
    links: {
      websites: [],
      documentation: [],
      repositories: [],
      apps: [],
      explorers: [],
      socialMedia: [],
    },
  },
  technology: `
    EigenDA is composed by three types of off-chain entities: node operators, a disperser and a retriever.
    EigenDA operators are a network of node operators running the EigenDA node software and registered to the EigenDA AVS in EigenLayer.
    Operators register with the EigenDA Service Manager via the registerOperatorToAVS() function, enabling them to participate in the data availability layer. They are resposible fo holding and serving blobs data, and earn rewards for their participation in the network.
    The disperser is the entity resposible for collecting the blobs from the sequencer, erasure coding them and generating the encoded blob's KZG commitments for each chunk. 
    Once the chunks, KZG commitments, and KZG proofs are sent to the operators, the disperser collects signatures from them. The aggregated signatures are then uploaded to the Ethereum network as part of the data sent to the EigenDA bridge.
    The disperser uses direct communication to EigenDA operators through unicast, rather than standard P2P gossiping. Although the disperser could be rollup-operated, it is currently a centralised entity operated by Eigen Labs.
    Lastly, the retriever queries the EigenDA operators to retrieve blob chunks, verifies their accuracy, and reconstructs the original blob. The retriever service is hosted by Eigen Labs, but client rollups may also implement their own retriever as a sidecar to their sequencer.
    
    ![EigenDA storing/retrieving](/images/da-layer-technology/eigenda/storing-retrieving.png#center)

  `,
  bridges: [eigenDAbridge],
  usedIn: [],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
