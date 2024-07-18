import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer, DaLayerKind } from '../../types/DaLayer'
import { linkByDA } from '../../utils/link-by-da'

export const near: DaLayer = {
  id: 'near',
  kind: DaLayerKind.PublicBlockchain,
  display: {
    name: 'NEAR DA',
    slug: 'near-da',
    description: `NEAR's Data Availability Layer (NEAR DA) leverages the sharded architecture of the NEAR Protocol to provide a modular data availability layer for rollups.`,
  },
  bridges: [],
  usedIn: linkByDA({
    layer: (layer) => layer === 'NearDA',
  }),
  consensusAlgorithm: {
    name: 'Nightshade',
    description: `Nightshade is a sharding-based, Proof-of-Stake (PoS) consensus protocol enabling parallel transaction processing. 
    Nightshade uses heaviest-chain fork choice rule, and a finality gadget that introduces extra slashing conditions such as unless a very large
    percentage of the total stake needs to be slashed for the chain to fork.`,
    blockTime: 1.2, // seconds average
    consensusFinality: 1.2, // to do: look into Doomslug finality
    unbondingPeriod: 86400 * 2, // up to 48 hours
  },
  dataAvailabilitySampling: {
    supportsDAS: false,
  },
  pruningWindow: 43200 * 3, // minimum 3 epochs (12 hours each), claimed in practice around 5 epochs 
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'NEAR',
  },
}
