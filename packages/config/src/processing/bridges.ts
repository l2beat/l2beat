import type { Bridge } from '../internalTypes'
import { acrossV3 } from '../projects/bridges/acrossV3'
import { allbridge } from '../projects/bridges/allbridge'
import { amarok } from '../projects/bridges/amarok'
import { ankr } from '../projects/bridges/ankr'
import { aptos } from '../projects/bridges/aptos'
import { avalanche } from '../projects/bridges/avalanche'
import { beamerbridgev2 } from '../projects/bridges/beamerBridgeV2'
import { cBridge } from '../projects/bridges/cBridge'
import { chainport } from '../projects/bridges/chainport'
import { connext } from '../projects/bridges/connext'
import { davos } from '../projects/bridges/davos'
import { debridge } from '../projects/bridges/debridge'
import { fraxferry } from '../projects/bridges/fraxferry'
import { gravity } from '../projects/bridges/gravity'
import { harmony } from '../projects/bridges/harmony'
import { hop } from '../projects/bridges/hop'
import { hyperlane } from '../projects/bridges/hyperlane'
import { hyphen } from '../projects/bridges/hyphen'
import { layerzerov2oft } from '../projects/bridges/layerzerov2oft'
import { lzOmnichain } from '../projects/bridges/lzOmnichain'
import { multichain } from '../projects/bridges/multichain'
import { near } from '../projects/bridges/near'
import { nomad } from '../projects/bridges/nomad'
import { omni } from '../projects/bridges/omni'
import { opticsV1 } from '../projects/bridges/opticsV1'
import { opticsV2 } from '../projects/bridges/opticsV2'
import { orbit } from '../projects/bridges/orbit'
import { orbiter } from '../projects/bridges/orbiter'
import { pNetwork } from '../projects/bridges/pNetwork'
import { polynetwork } from '../projects/bridges/polynetwork'
import { portal } from '../projects/bridges/portal'
import { pulseChain } from '../projects/bridges/pulseChain'
import { ronin } from '../projects/bridges/ronin'
import { satellite } from '../projects/bridges/satellite'
import { skaleIMA } from '../projects/bridges/skaleIMA'
import { socket } from '../projects/bridges/socket'
import { sollet } from '../projects/bridges/sollet'
import { sonicgateway } from '../projects/bridges/sonicgateway'
import { stargate } from '../projects/bridges/stargate'
import { stargatev2 } from '../projects/bridges/stargatev2'
import { sygma } from '../projects/bridges/sygma'
import { symbiosis } from '../projects/bridges/symbiosis'
import { synapse } from '../projects/bridges/synapse'
import { train } from '../projects/bridges/train'
import { transporter } from '../projects/bridges/transporter'
import { wormholeV1 } from '../projects/bridges/wormholeV1'
import { xdai } from '../projects/bridges/xdai'

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
  gravity,
  harmony,
  hyperlane,
  chainport,
  hop,
  hyphen,
  lzOmnichain,
  layerzerov2oft,
  multichain,
  near,
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
  xdai,
  symbiosis,
]
