import { UnixTime } from '@l2beat/shared-pure'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer } from '../../types/DaLayer'
import { DasErasureCodingProof } from '../../types/DasErasureCodingProof'
import { DasErasureCodingScheme } from '../../types/DasErasureCodingScheme'
import { linkByDA } from '../../utils/link-by-da'
import { blobstream } from './bridges/blobstream'
import { noBridge } from './bridges/no-bridge'

export const celestia: DaLayer = {
  id: 'celestia',
  type: 'da-layer',
  kind: 'public-blockchain',
  display: {
    name: 'Celestia',
    slug: 'celestia',
    description: 'Celestia is a modular data availability network.',
    links: {
      websites: ['https://celestia.org/'],
      documentation: ['https://docs.celestia.org/'],
      repositories: ['https://github.com/celestiaorg'],
    },
  },
  technology:
    'Some note about the technology used by the data availability layer.\n## Markdown supported',
  bridges: [noBridge, ...blobstream],
  usedIn: linkByDA({
    layer: (layer) => layer === 'Celestia',
  }),
  /*
    Node params sources:
    - unbondingPeriod, block times (time_iota_ms): https://celestiaorg.github.io/celestia-app/specs/params.html
    - pruningWindow: https://github.com/celestiaorg/CIPs/blob/main/cips/cip-4.md
  */
  consensusAlgorithm: {
    name: 'CometBFT',
    description: `CometBFT is the canonical implementation of the Tendermint consensus algorithm.
    CometBFT allows for a state transition machine to be written in any programming language, and it allows for secure replication across many machines.
    The consensus protocol is fork-free by construction under an honest majority of stake assumption.`,
    blockTime: 15, // seconds
    consensusFinality: 1, // 1 second for tendermint, time_iota_ms
    unbondingPeriod: UnixTime.DAY * 21, // staking.UnbondingTime
  },
  dataAvailabilitySampling: {
    erasureCodingScheme: DasErasureCodingScheme.TwoDReedSolomon,
    erasureCodingProof: DasErasureCodingProof.FraudProofs,
  },
  pruningWindow: 86400 * 30, // 30 days in seconds
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(true),
  },
  economicSecurity: {
    type: 'Celestia',
  },
}
