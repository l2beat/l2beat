import { UnixTime } from '@l2beat/shared-pure'
import { NO_BRIDGE } from '../../templates/no-bridge-template'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'
import { linkByDA } from '../../utils/link-by-da'

export const celestia: DaLayer = {
  id: 'avail',
  type: 'DaLayer',
  kind: 'PublicBlockchain',
  display: {
    name: 'Avail',
    slug: 'avail',
    description:
      'Avail is a data availability network.',
    links: {
      websites: ['https://celestia.org/'],
      documentation: ['https://docs.celestia.org/'],
      repositories: ['https://github.com/celestiaorg'],
      apps: [],
      explorers: ['https://celenium.io/'],
      socialMedia: [
        'https://x.com/CelestiaOrg',
        'https://discord.com/invite/YsnTPcSfWQ',
        'https://t.me/CelestiaCommunity',
      ],
    },
  },
  technology: `
    ## Consensus

    ## Blobs

    ## Data Availability Sampling (DAS)

    ## Erasure Coding Proof
 
    ## L2s Data Availability

    `,
  bridges: [
    NO_BRIDGE({
      layer: 'Avail',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.\n`,
    }),
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'Avail',
  }),
  /*
    Node params sources:

  */
  consensusAlgorithm: {
    name: 'BABE/GRANDPA',
    description: `Avail uses the BABE/GRANDPA consensus algorithm. BABE is a block production mechanism that is used to create new blocks in the Avail blockchain. GRANDPA is a finality gadget that is used to finalize blocks.`,
    blockTime: 20, // seconds
    consensusFinality: 60,  //seconds
    unbondingPeriod: UnixTime.DAY * 21, // staking.UnbondingTime
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: DasErasureCodingScheme.TwoDReedSolomon,
    erasureCodingProof: DasErasureCodingProof.ValidityProofs,
  },
  pruningWindow: 0, // unknown
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(false),
  },
  economicSecurity: {
    type: 'Avail',
  },
}
