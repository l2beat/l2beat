import { acrossV2 } from './acrossV2'
import { aptos } from './aptos'
import { avalanche } from './avalanche'
import { cBridge } from './cBridge'
import { connext } from './connext'
import { gravity } from './gravity'
import { harmony } from './harmony'
import { hop } from './hop'
import { hyphen } from './hyphen'
import { multichain } from './multichain'
import { near } from './near'
import { nomad } from './nomad'
import { omni } from './omni'
import { opticsV1 } from './opticsV1'
import { opticsV2 } from './opticsV2'
import { orbit } from './orbit'
import { orbiter } from './orbiter'
import { polygonplasma } from './polygonplasma'
import { polygonpos } from './polygonpos'
import { polynetwork } from './polynetwork'
import { portal } from './portal'
import { ronin } from './ronin'
import { satellite } from './satellite'
import { sollet } from './sollet'
import { stargate } from './stargate'
import { synapse } from './synapse'
import { Bridge } from './types'
import { wormholeV1 } from './wormholeV1'
import { xdai } from './xdai'

export * from './types'

export const bridges: Bridge[] = [
  acrossV2,
  avalanche,
  aptos,
  cBridge,
  connext,
  gravity,
  harmony,
  hop,
  hyphen,
  multichain,
  near,
  nomad,
  omni,
  opticsV1,
  opticsV2,
  orbit,
  orbiter,
  polygonplasma,
  polygonpos,
  polynetwork,
  ronin,
  satellite,
  sollet,
  stargate,
  synapse,
  portal,
  wormholeV1,
  xdai,
]
