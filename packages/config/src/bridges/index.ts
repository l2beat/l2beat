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
import { orbiter } from './orbiter'
import { polygon } from './polygon'
import { polynetwork } from './polynetwork'
import { ronin } from './ronin'
import { sollet } from './sollet'
import { stargate } from './stargate'
import { synapse } from './synapse'
import { Bridge } from './types'
import { wormhole } from './wormhole'

export * from './types'

export const bridges: Bridge[] = [
  avalanche,
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
  orbiter,
  polygon,
  polynetwork,
  ronin,
  sollet,
  stargate,
  synapse,
  wormhole,
]
