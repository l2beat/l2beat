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
import { blobStream } from './bridges/blob-stream'
import { noBridge } from './bridges/no-bridge'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const celestia: DaLayer = {
  id: 'celestia',
  kind: DaLayerKind.PublicBlockchain,
  display: {
    name: 'Celestia',
    slug: 'celestia',
    description: 'Celestia is a modular data availability network.',
  },
  bridges: [noBridge, blobStream],
  usedIn: [ // can we fetch these from the layer2s and layer3s?
    mantapacific.id,
    karak.id,
    aevo.id,
    lyra.id,
    publicgoodsnetwork.id,
    orderly.id,
    ancient.id,
    hypr.id,
    stack.id,
  ],
  pruningWindow: 86400 * 30, // 30 days in seconds
  consensusFinality: 1000,
  unbondingPeriod: 1814400, // 21 days - techni
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(false),
  },
  economicSecurity: {
    type: 'Ethereum',
  },
}
