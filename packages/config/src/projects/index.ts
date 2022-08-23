import { arbitrum } from './arbitrum'
import { avalancheBridge } from './avalancheBridge'
import { aztec } from './aztec'
import { aztecconnect } from './aztecconnect'
import { bobanetwork } from './bobanetwork'
import { cBridge } from './cBridge'
import { connextBridge } from './connextBridge'
import { dydx } from './dydx'
import { fantomBridge } from './fantomBridge'
import { fuelv1 } from './fuelv1'
import { gluon } from './gluon'
import { gravityBridge } from './gravityBridge'
import { harmonyBridge } from './harmonyBridge'
import { hermez } from './hermez'
import { hopBridge } from './hopBridge'
import { hyphenBridge } from './hyphenBridge'
import { immutablex } from './immutablex'
import { layer2finance } from './layer2finance'
import { layer2financezk } from './layer2financezk'
import { loopring } from './loopring'
import { metis } from './metis'
import { nearBridge } from './nearBridge'
import { nomadBridge } from './nomadBridge'
import { nova } from './nova'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { orbiterBridge } from './orbiterBridge'
import { polygonBridge } from './polygonBridge'
import { rhinofi } from './rhinofi'
import { roninBridge } from './roninBridge'
import { solletBridge } from './solletBridge'
import { sorare } from './sorare'
import { starGateBridge } from './starGateBridge'
import { starknet } from './starknet'
import { synapseBridge } from './synapseBridge'
import { Project } from './types'
import { wormholeBridge } from './wormholeBridge'
import { xDaiBridge } from './xDaiBridge'
import { zkspace } from './zkspace'
import { zkswap } from './zkswap'
import { zkswap2 } from './zkswap2'
import { zksync } from './zksync'

export * from './types'

export const projects: Project[] = [
  // arbitrum,
  // aztec,
  // aztecconnect,
  // bobanetwork,
  // rhinofi,
  // dydx,
  // fuelv1,
  // gluon,
  // hermez,
  // immutablex,
  // layer2finance,
  // layer2financezk,
  // loopring,
  // metis,
  // nova,
  // omgnetwork,
  // optimism,
  // sorare,
  // starknet,
  // zkswap,
  // zkswap2,
  // zkspace,
  // zksync,
  nearBridge,
  avalancheBridge,
  fantomBridge,
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
]
