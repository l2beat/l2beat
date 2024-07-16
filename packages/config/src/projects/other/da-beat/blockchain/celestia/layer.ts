import { ProjectId } from '@l2beat/shared-pure'
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
import { DaLayer } from '../../types/DaLayer'
import { blobStream } from './bridges/blobstream'
import { noBridge } from './bridges/no-bridge'

/**
 * THIS IS EXAMPLE DATA FOR SKETCH PURPOSES
 */
export const celestia: DaLayer = {
  id: ProjectId('celestia'),
  type: 'da-beat',
  kind: 'public-blockchain',
  display: {
    name: 'Celestia',
    slug: 'celestia',
    description:
      'Celestia ullamco pariatur occaecat ut deserunt reprehenderit aute ut mollit. Ut esse aliqua ullamco ipsum ullamco incididunt amet. Laborum cupidatat aute irure cupidatat duis adipisicing consequat.',
    links: {
      websites: ['https://celestia.org/'],
      documentation: ['https://docs.celestia.org/'],
      repositories: ['https://github.com/celestiaorg'],
    },
  },
  technology:
    'Some note about the technology used by the data availability layer.\n## Markdown supported',
  bridges: [noBridge, ...blobStream],
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
  ],
  storageDuration: 1000,
  consensusFinality: 1000,
  unbondingPeriod: 1814400, // 21 days
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.DasWithBlobsReconstruction(false),
  },
  economicSecurity: {
    type: 'Ethereum',
  },
}
