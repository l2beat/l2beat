import type { Bridge } from '../../types'
import { acrossV3 } from './acrossV3'
import { allbridge } from './allbridge'
import { amarok } from './amarok'
import { ankr } from './ankr'
import { aptos } from './aptos'
import { avalanche } from './avalanche'
import { beamerbridgev2 } from './beamerBridgeV2'
import { cBridge } from './cBridge'
import { chainport } from './chainport'
import { connext } from './connext'
import { davos } from './davos'
import { debridge } from './debridge'
import { fraxferry } from './fraxferry'
import { gravity } from './gravity'
import { harmony } from './harmony'
import { hop } from './hop'
import { hyperlane } from './hyperlane'
import { hyphen } from './hyphen'
import { layerzerov2oft } from './layerzerov2oft'
import { lzOmnichain } from './lzOmnichain'
import { multichain } from './multichain'
import { near } from './near'
import { nomad } from './nomad'
import { omni } from './omni'
import { opticsV1 } from './opticsV1'
import { opticsV2 } from './opticsV2'
import { orbit } from './orbit'
import { orbiter } from './orbiter'
import { pNetwork } from './pNetwork'
import { polynetwork } from './polynetwork'
import { portal } from './portal'
import { pulseChain } from './pulseChain'
import { ronin } from './ronin'
import { satellite } from './satellite'
import { skaleIMA } from './skaleIMA'
import { socket } from './socket'
import { sollet } from './sollet'
import { sonicgateway } from './sonicgateway'
import { stargate } from './stargate'
import { stargatev2 } from './stargatev2'
import { sygma } from './sygma'
import { symbiosis } from './symbiosis'
import { synapse } from './synapse'
import { transporter } from './transporter'
import { wormholeV1 } from './wormholeV1'
import { xdai } from './xdai'

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
  transporter,
  portal,
  wormholeV1,
  xdai,
  symbiosis,
]
