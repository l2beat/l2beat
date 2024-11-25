import { UnixTime } from '@l2beat/shared-pure'
import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'

export const espressoDA: DaLayer = {
  id: 'espressoDA',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  systemCategory: 'public',
  display: {
    name: 'EspressoDA',
    slug: 'espressoDA',
    description:
      'Espresso DA (Tiramisu) is a three-layer data availability (DA) solution based on the HotShot consensus.',
    links: {
      websites: ['https://espressosys.com/'],
      documentation: ['https://docs.espressosys.com/'],
      repositories: ['https://github.com/espressosystems/'],
      apps: [],
      explorers: ['https://explorer.main.net.espresso.network/'],
      socialMedia: [
        'https://x.com/EspressoSys',
        'https://discord.com/invite/YHZPk5dbcq',
        'https://medium.com/@espressosys',
      ],
    },
  },
  technology: {
    description: `
    ## Architecture
    ![EspressoDA architecture](/images/da-layer-technology/espressoDA/architecture.png#center)

    ## Consensus

    EspressoDA uses HotShot.
    
    ## Data Availability Sampling (DAS)

    ## Erasure Coding Proof

    ## L2s Data Availability
    `,
    references: [],
    risks: [],
  },
  bridges: [
    NO_BRIDGE({
      createdAt: new UnixTime(1721138888), // 2024-07-16T14:08:08Z
      layer: 'EspressoDA',
      description: `The risk profile in this page refers to L2s that do not integrate with a data availability bridge.
        Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.`,
      technology: {
        description: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
      },
    }),
  ],
  consensusAlgorithm: {
    name: 'HotShot',
    description: ``,
    blockTime: 8,
    consensusFinality: 1, 
    unbondingPeriod: UnixTime.DAY * 21, 
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: DasErasureCodingScheme.TwoDReedSolomon,
    erasureCodingProof: DasErasureCodingProof.ValidityProofs,
  },
  pruningWindow: 86400 * 30, // 30 days in seconds
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithNoBlobsReconstruction(true),
  },
  economicSecurity: {
    type: 'Celestia',
  },
}
