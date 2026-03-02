import type { Bridge } from '../internalTypes'
import { acrossV3 } from '../projects/across-v3/across-v3'
import { avalanche } from '../projects/avalanche/avalanche'
import { cBridge } from '../projects/cbridge/cbridge'
import { debridge } from '../projects/debridge/debridge'
import { everclearbridge } from '../projects/everclearbridge/everclearbridge'
import { hop } from '../projects/hop/hop'
import { hyperlane } from '../projects/hyperlane/hyperlane'
import { hyperliquid } from '../projects/hyperliquid/hyperliquid'
import { layerzerov2oft } from '../projects/layerzerov2oft/layerzerov2oft'
import { nearomni } from '../projects/nearomni/nearomni'
import { omni } from '../projects/omni/omni'
import { orbiter } from '../projects/orbiter/orbiter'
import { portal } from '../projects/portal/portal'
import { satellite } from '../projects/satellite/satellite'
import { sonicgateway } from '../projects/sonicgateway/sonicgateway'
import { stargatev2 } from '../projects/stargatev2/stargatev2'

export const bridges: Bridge[] = [
  acrossV3,
  avalanche,
  cBridge,
  debridge,
  everclearbridge,
  hyperlane,
  hop,
  hyperliquid,
  layerzerov2oft,
  nearomni,
  omni,
  orbiter,
  satellite,
  sonicgateway,
  stargatev2,
  portal,
]
