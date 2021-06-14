import { arbitrum } from './arbitrum'
import { aztec } from './aztec'
import { deversifi } from './deversifi'
import { dydx } from './dydx'
import { fuel } from './fuel'
import { hermez } from './hermez'
import { immutablex } from './immutablex'
import { layer2finance } from './layer2finance'
import { leverj } from './leverj'
import { loopring } from './loopring'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { Project } from './Project'
import { zkswap } from './zkswap'
import { zksync } from './zksync'

export * from './Project'

export const projects: Project[] = [
  arbitrum,
  aztec,
  deversifi,
  dydx,
  fuel,
  hermez,
  immutablex,
  layer2finance,
  leverj,
  loopring,
  omgnetwork,
  optimism,
  zkswap,
  zksync,
]
