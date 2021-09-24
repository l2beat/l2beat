import { arbitrum } from './arbitrum'
import { aztec } from './aztec'
import { bobanetwork } from './bobanetwork'
import { deversifi } from './deversifi'
import { dydx } from './dydx'
import { fuel } from './fuel'
import { gluon } from './gluon'
import { habitat } from './habitat'
import { hermez } from './hermez'
import { immutablex } from './immutablex'
import { layer2finance } from './layer2finance'
import { loopring } from './loopring'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { sorare } from './sorare'
import { Project } from './types'
import { zkswap } from './zkswap'
import { zkswapv2 } from './zkswapv2'
import { zksync } from './zksync'

export * from './types'

export const projects: Project[] = [
  arbitrum,
  aztec,
  bobanetwork,
  deversifi,
  dydx,
  fuel,
  gluon,
  habitat,
  hermez,
  immutablex,
  layer2finance,
  loopring,
  omgnetwork,
  optimism,
  sorare,
  zkswap,
  zkswapv2,
  zksync,
]
