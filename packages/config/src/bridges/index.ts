import { avalancheBridge } from '../bridges/avalancheBridge'
import { cBridge } from '../bridges/cBridge'
import { connextBridge } from '../bridges/connextBridge'
import { gravityBridge } from '../bridges/gravityBridge'
import { harmonyBridge } from '../bridges/harmonyBridge'
import { hopBridge } from '../bridges/hopBridge'
import { hyphenBridge } from '../bridges/hyphenBridge'
import { multichainBridge } from '../bridges/multichainBridge'
import { nearBridge } from '../bridges/nearBridge'
import { nomadBridge } from '../bridges/nomadBridge'
import { orbiterBridge } from '../bridges/orbiterBridge'
import { polygonBridge } from '../bridges/polygonBridge'
import { polynetworkBridge } from '../bridges/polynetworkBridge'
import { roninBridge } from '../bridges/roninBridge'
import { solletBridge } from '../bridges/solletBridge'
import { starGateBridge } from '../bridges/starGateBridge'
import { synapseBridge } from '../bridges/synapseBridge'
import { wormholeBridge } from '../bridges/wormholeBridge'
import { xDaiBridge } from '../bridges/xDaiBridge'
import { BridgeDescription } from './types/bridge'

export const bridges: BridgeDescription[] = [
  nearBridge,
  avalancheBridge,
  multichainBridge,
  polygonBridge,
  wormholeBridge,
  starGateBridge,
  harmonyBridge,
  xDaiBridge,
  roninBridge,
  gravityBridge,
  nomadBridge,
  solletBridge,
  synapseBridge,
  hopBridge,
  cBridge,
  connextBridge,
  orbiterBridge,
  hyphenBridge,
  polynetworkBridge,
]
