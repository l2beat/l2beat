import { UnixTime } from '@l2beat/shared-pure'
import type { DaBridge } from '../../../types'
import { EthereumDaBridgeRisks } from '../common'
import { linkByDA } from '../utils/link-by-da'

export const enshrinedBridge: DaBridge = {
  id: 'enshrined-bridge',
  addedAt: new UnixTime(1721236013), // 2024-07-17T17:06:53Z
  type: 'Enshrined',
  display: {
    name: 'Enshrined Bridge',
    slug: 'enshrined-bridge',
    description: 'The DA bridge on Ethereum is enshrined.',
  },
  technology: {
    description: `
     ## Enshrined Bridge
    The DA bridge on Ethereum is enshrined, meaning that blob data is directly accessible on the consensus layer, with data availability guaranteed by the network's inherent consensus rules. 
    If a block contains unavailable data, full nodes will reject it, causing the chain to fork away from that block. This ensures data availability without requiring additional trust assumptions. 
    In contrast, external DA providers must rely on data availability attestations from the external validator set, introducing an extra layer of trust on the majority of validators.
    `,
  },
  usedIn: linkByDA({
    // To catch both blobs and calldata suffix
    layer: (layer) => layer?.startsWith('Ethereum'),
    bridge: (bridge) => bridge === 'Enshrined',
  }),
  risks: {
    daBridge: EthereumDaBridgeRisks.Enshrined,
    callout: `Unlike non-enshrined DA bridges, it does not place any honesty
          assumption on an external committee that provides data availability
          attestations to the DA bridge. From the rollup perspective,
          Ethereum's canonical chain cannot contain unavailable data
          commitments as full nodes self-verify the data availability of each
          block, discarding blocks with unavailable data. The rollup state
          validating bridge has access to all the data, as it is posted on chain.`,
  },
}
