import { aevo } from '../../../../layer2s/aevo'
import { ancient } from '../../../../layer2s/ancient'
import { hypr } from '../../../../layer2s/hypr'
import { karak } from '../../../../layer2s/karak'
import { lyra } from '../../../../layer2s/lyra'
import { mantapacific } from '../../../../layer2s/mantapacific'
import { orderly } from '../../../../layer2s/orderly'
import { publicgoodsnetwork } from '../../../../layer2s/publicgoodsnetwork'
import { stack } from '../../../../layer3s/stack'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer, DaLayerKind } from '../../types/DaLayer'
import { blobstream } from './bridges/blobstream'
import { noBridge } from './bridges/no-bridge'

export const celestia: DaLayer = {
  id: 'celestia',
  kind: DaLayerKind.PublicBlockchain,
  display: {
    name: 'Celestia',
    slug: 'celestia',
    description: 'Celestia is a modular data availability network.',
  },
  bridges: [noBridge, ...blobstream],
  usedIn: [
    mantapacific.id,
    karak.id,
    aevo.id,
    lyra.id,
    publicgoodsnetwork.id,
    orderly.id,
    ancient.id,
    hypr.id,
    stack.id,
    // can we fetch these from the layer2s and layer3s?
  ],
  /*
    Node params sources:
    - unbondingPeriod, block times (time_iota_ms): https://celestiaorg.github.io/celestia-app/specs/params.html
    - pruningWindow: https://github.com/celestiaorg/CIPs/blob/main/cips/cip-4.md
  */
  pruningWindow: 86400 * 30, // 30 days in seconds
  consensusAlgorithm: {
    name: 'CometBFT',
    description: `CometBFT is the canonical implementation of the Tendermint consensus algorithm. 
    CometBFT allows for a state transition machine to be written in any programming language, and it allows for secure replication across many machines.
    The consensus protocol is fork-free by construction under an honest majority of stake assumption.`,
    blockTime: 15, // seconds
    consensusFinality: 1, // 1 second for tendermint, time_iota_ms
    unbondingPeriod: 1814400, // 21 days, staking.UnbondingTime
  },
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(true),
  },
  economicSecurity: {
    type: 'Celestia',
  },
}
