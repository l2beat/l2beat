import type { Bridge } from '../internalTypes'
import { acrossV3 } from '../projects/across-v3/across-v3'
import { allbridge } from '../projects/allbridge/allbridge'
import { amarok } from '../projects/amarok/amarok'
import { ankr } from '../projects/ankr/ankr'
import { aptos } from '../projects/aptos/aptos'
import { avalanche } from '../projects/avalanche/avalanche'
import { beamerbridgev2 } from '../projects/beamer-bridge-v2/beamer-bridge-v2'
import { cBridge } from '../projects/cbridge/cbridge'
import { chainport } from '../projects/chainport/chainport'
import { connext } from '../projects/connext/connext'
import { davos } from '../projects/davos/davos'
import { debridge } from '../projects/debridge/debridge'
import { everclearbridge } from '../projects/everclearbridge/everclearbridge'
import { fraxferry } from '../projects/fraxferry/fraxferry'
import { gravity } from '../projects/gravity/gravity'
import { hop } from '../projects/hop/hop'
import { hyperlane } from '../projects/hyperlane/hyperlane'
import { hyperliquid } from '../projects/hyperliquid/hyperliquid'
import { hyphen } from '../projects/hyphen/hyphen'
import { layerzerov2oft } from '../projects/layerzerov2oft/layerzerov2oft'
import { lzOmnichain } from '../projects/lzomnichain/lzomnichain'
import { multichain } from '../projects/multichain/multichain'
import { near } from '../projects/near/near'
import { nearomni } from '../projects/nearomni/nearomni'
import { nomad } from '../projects/nomad/nomad'
import { omni } from '../projects/omni/omni'
import { opticsV1 } from '../projects/opticsV1/opticsV1'
import { opticsV2 } from '../projects/opticsV2/opticsV2'
import { orbit } from '../projects/orbit/orbit'
import { orbiter } from '../projects/orbiter/orbiter'
import { pNetwork } from '../projects/pNetwork/pNetwork'
import { polynetwork } from '../projects/polynetwork/polynetwork'
import { portal } from '../projects/portal/portal'
import { pulseChain } from '../projects/pulseChain/pulseChain'
import { ronin } from '../projects/ronin/ronin'
import { satellite } from '../projects/satellite/satellite'
import { skaleIMA } from '../projects/skale-ima/skale-ima'
import { socket } from '../projects/socket/socket'
import { sollet } from '../projects/sollet/sollet'
import { sonicgateway } from '../projects/sonicgateway/sonicgateway'
import { stargate } from '../projects/stargate/stargate'
import { stargatev2 } from '../projects/stargatev2/stargatev2'
import { sygma } from '../projects/sygma/sygma'
import { symbiosis } from '../projects/symbiosis/symbiosis'
import { synapse } from '../projects/synapse/synapse'
import { train } from '../projects/train/train'
import { transporter } from '../projects/transporter/transporter'
import { wormholeV1 } from '../projects/wormholeV1/wormholeV1'

export const bridges: Bridge[] = [
  acrossV3,
  allbridge,
  amarok,
  ankr,
  avalanche,
  aptos,
  beamerbridgev2,
  cBridge,
  connext,
  debridge,
  davos,
  everclearbridge,
  gravity,
  hyperlane,
  chainport,
  hop,
  hyperliquid,
  hyphen,
  lzOmnichain,
  layerzerov2oft,
  multichain,
  near,
  nearomni,
  fraxferry,
  nomad,
  omni,
  opticsV1,
  opticsV2,
  orbit,
  orbiter,
  polynetwork,
  pNetwork,
  pulseChain,
  ronin,
  satellite,
  skaleIMA,
  socket,
  sollet,
  sonicgateway,
  stargate,
  stargatev2,
  sygma,
  synapse,
  train,
  transporter,
  portal,
  wormholeV1,
  symbiosis,
]
