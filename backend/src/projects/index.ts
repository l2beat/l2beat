import { Config, TVLResult } from '../services'
import { aztec } from './aztec'
import { dydx } from './dydx'
import { fuel } from './fuel'
import { hermez } from './hermez'
import { immutablex } from './immutablex'
import { layer2finance } from './layer2finance'
import { loopring } from './loopring'
import { optimism } from './optimism'
import { zkswap } from './zkswap'
import { zksync } from './zksync'

interface Project {
  (config: Config): Promise<ProjectData>
}

interface ProjectData {
  name: string
  bridges: {
    [address: string]: TVLResult
  }
}

export const projects: Project[] = [
  aztec,
  dydx,
  fuel,
  hermez,
  immutablex,
  layer2finance,
  loopring,
  optimism,
  zkswap,
  zksync,
]
