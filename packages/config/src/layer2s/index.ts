import { apex } from './apex'
import { arbitrum } from './arbitrum'
import { aztec } from './aztec'
import { aztecconnect } from './aztecconnect'
import { base } from './base'
import { bobanetwork } from './bobanetwork'
import { canvasconnect } from './canvasconnect'
import { cartesiHoneypot } from './cartesiHoneypot'
import { HOMEPAGE_MILESTONES } from './common'
import { degate } from './degate'
import { dydx } from './dydx'
import { fuelv1 } from './fuelv1'
import { gluon } from './gluon'
import { hermez } from './hermez'
import { immutablex } from './immutablex'
import { kroma } from './kroma'
import { layer2finance } from './layer2finance'
import { layer2financezk } from './layer2financezk'
import { linea } from './linea'
import { loopring } from './loopring'
import { mantle } from './mantle'
import { metis } from './metis'
import { myria } from './myria'
import { nova } from './nova'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { polygonzkevm } from './polygonzkevm'
import { rhinofi } from './rhinofi'
import { scroll } from './scroll'
import { sorare } from './sorare'
import { starknet } from './starknet'
import { taiko } from './taiko'
import { Layer2 } from './types'
import { zkspace } from './zkspace'
import { zkswap } from './zkswap'
import { zkswap2 } from './zkswap2'
import { zksyncera } from './zksyncera'
import { zksynclite } from './zksynclite'
import { zora } from './zora'
export * from './common'
export * from './types'

export const layer2s: Layer2[] = [
  apex,
  arbitrum,
  aztec,
  aztecconnect,
  base,
  bobanetwork,
  canvasconnect,
  cartesiHoneypot,
  degate,
  dydx,
  fuelv1,
  gluon,
  hermez,
  immutablex,
  kroma,
  layer2finance,
  layer2financezk,
  linea,
  loopring,
  mantle,
  metis,
  myria,
  nova,
  omgnetwork,
  optimism,
  polygonzkevm,
  rhinofi,
  scroll,
  sorare,
  starknet,
  taiko,
  zkspace,
  zkswap,
  zkswap2,
  zksyncera,
  zksynclite,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
